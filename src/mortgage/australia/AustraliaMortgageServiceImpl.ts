import { AustraliaMortgageService } from "./AustraliaMortgageService";
import {
    AmortizationScheduleItem,
    MortgageInput,
    MortgageOutput,
    MortgageRules,
    StampDutyRules,
} from "./domain/types";

const PAYMENT_FREQUENCY_PAYMENTS_PER_YEAR: Record<string, number> = {
    MONTHLY: 12,
    FORTNIGHTLY: 26,
    WEEKLY: 52,
};

export class AustraliaMortgageServiceImpl implements AustraliaMortgageService {

    public calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput {
        const loanAmount = input.propertyPrice - input.downPayment;

        if (loanAmount <= 0) {
            throw new Error('Invalid loan amount: down payment must be less than property price');
        }

        const lvr = loanAmount / input.propertyPrice;

        const lmiPremium = this.computeLmi(loanAmount, lvr, rules);
        const totalMortgage = rules.lendersMortgageInsurance.premiumAddedToLoan
            ? loanAmount + lmiPremium
            : loanAmount;

        const paymentsPerYear = PAYMENT_FREQUENCY_PAYMENTS_PER_YEAR[input.paymentFrequency];
        const totalPayments = input.amortizationYears * paymentsPerYear;
        const periodicRate = (input.annualInterestRate / 100) / paymentsPerYear;

        const paymentAmount = this.calculatePayment(totalMortgage, periodicRate, totalPayments);
        const totalPaid = paymentAmount * totalPayments;
        const totalInterestPaid = totalPaid - totalMortgage;

        const stampDuty = this.calculateStampDuty(input.propertyPrice, rules.stampDuty);

        const amortizationSchedule = this.calculateAmortizationSchedule(
            totalMortgage,
            periodicRate,
            paymentAmount,
            totalPayments,
            input.amortizationYears,
            paymentsPerYear,
        );

        return {
            loanAmount,
            lmiPremium,
            totalMortgage,
            monthlyPayment: paymentAmount,
            totalInterestPaid,
            totalPaid,
            stampDuty,
            amortizationSchedule,
            otherFees: {
                notaryFees: {
                    value: stampDuty,
                    label: 'STAMP_DUTY',
                },
                bankFees: {
                    value: 0,
                    label: 'BANK_FEES',
                },
                monthlyInsuranceFees: {
                    value: lmiPremium,
                    label: 'LMI_PREMIUM',
                },
            },
        };
    }

    private computeLmi(loanAmount: number, lvr: number, rules: MortgageRules): number {
        if (lvr <= rules.lendersMortgageInsurance.requiredAboveLvr) {
            return 0;
        }

        const premiumRule = rules.lendersMortgageInsurance.premiumRates
            .find(r => lvr <= r.maxLvr);

        if (!premiumRule) {
            throw new Error('LVR exceeds maximum insurable limit');
        }

        return loanAmount * premiumRule.rate;
    }

    private calculateStampDuty(propertyPrice: number, stampDuty: StampDutyRules): number {
        let duty = 0;
        let previousLimit = 0;

        for (const bracket of stampDuty.brackets) {
            if (bracket.upTo !== undefined && propertyPrice > previousLimit) {
                const taxable = Math.min(propertyPrice, bracket.upTo) - previousLimit;
                duty += taxable * bracket.rate;
                previousLimit = bracket.upTo;
            }

            if (bracket.above !== undefined && propertyPrice > bracket.above) {
                duty += (propertyPrice - bracket.above) * bracket.rate;
                break;
            }
        }

        return duty;
    }

    private calculateAmortizationSchedule(
        principal: number,
        periodicRate: number,
        paymentAmount: number,
        totalPayments: number,
        amortizationYears: number,
        paymentsPerYear: number,
    ): AmortizationScheduleItem[] {
        const schedule: AmortizationScheduleItem[] = [];
        let balance = principal;

        for (let year = 1; year <= amortizationYears; year++) {
            let yearlyPrincipal = 0;
            let yearlyInterest = 0;

            const paymentsInYear = Math.min(paymentsPerYear, totalPayments - (year - 1) * paymentsPerYear);

            for (let payment = 1; payment <= paymentsInYear; payment++) {
                const interestPayment = balance * periodicRate;
                const principalPayment = paymentAmount - interestPayment;

                yearlyInterest += interestPayment;
                yearlyPrincipal += principalPayment;
                balance -= principalPayment;
            }

            schedule.push({
                year,
                principal: yearlyPrincipal,
                interest: yearlyInterest,
                balance: Math.max(0, balance),
            });

            if (balance <= 0) break;
        }

        return schedule;
    }

    private calculatePayment(principal: number, rate: number, periods: number): number {
        if (rate === 0) {
            return principal / periods;
        }

        return principal *
            (rate * Math.pow(1 + rate, periods)) /
            (Math.pow(1 + rate, periods) - 1);
    }
}
