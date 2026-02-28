import { UKMortgageService } from "./UKMortgageService";
import {
    AmortizationScheduleItem,
    MortgageInput,
    MortgageOutput,
    MortgageRules,
    StampDutyBracket,
} from "./domain/types";

export class UKMortgageServiceImpl implements UKMortgageService {

    public calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput {
        const loanAmount = input.propertyPrice - input.downPayment;

        if (loanAmount <= 0) {
            throw new Error('Invalid loan amount: down payment must be less than property price');
        }

        const totalPayments = input.amortizationYears * 12;
        const monthlyRate = (input.annualInterestRate / 100) / 12;

        const monthlyPayment = this.calculatePayment(loanAmount, monthlyRate, totalPayments);
        const totalPaid = monthlyPayment * totalPayments;
        const totalInterestPaid = totalPaid - loanAmount;

        const stampDuty = this.calculateStampDuty(input, rules);

        const amortizationSchedule = this.calculateAmortizationSchedule(
            loanAmount,
            monthlyRate,
            monthlyPayment,
            totalPayments,
            input.amortizationYears,
        );

        return {
            loanAmount,
            totalMortgage: loanAmount,
            monthlyPayment,
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
                    value: 0,
                    label: 'MONTHLY_INSURANCE_FEES',
                },
            },
        };
    }

    private calculateStampDuty(input: MortgageInput, rules: MortgageRules): number {
        const { propertyPrice, isFirstTimeBuyer } = input;
        const { firstTimeBuyer, standardBrackets } = rules.stampDuty;

        const useFirstTimeBuyerRules =
            isFirstTimeBuyer && propertyPrice <= firstTimeBuyer.maxEligiblePropertyPrice;

        const brackets = useFirstTimeBuyerRules ? firstTimeBuyer.brackets : standardBrackets;

        return this.applyStampDutyBrackets(propertyPrice, brackets);
    }

    private applyStampDutyBrackets(propertyPrice: number, brackets: StampDutyBracket[]): number {
        let duty = 0;
        let previousLimit = 0;

        for (const bracket of brackets) {
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
        monthlyRate: number,
        monthlyPayment: number,
        totalPayments: number,
        amortizationYears: number,
    ): AmortizationScheduleItem[] {
        const schedule: AmortizationScheduleItem[] = [];
        let balance = principal;

        for (let year = 1; year <= amortizationYears; year++) {
            let yearlyPrincipal = 0;
            let yearlyInterest = 0;

            const paymentsInYear = Math.min(12, totalPayments - (year - 1) * 12);

            for (let payment = 1; payment <= paymentsInYear; payment++) {
                const interestPayment = balance * monthlyRate;
                const principalPayment = monthlyPayment - interestPayment;

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
