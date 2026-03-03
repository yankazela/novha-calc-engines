import { USAMortgageService } from "./USAMortgageService";
import {
    AmortizationScheduleItem,
    MortgageInput,
    MortgageOutput,
    MortgageRules,
    TransferTaxBracket,
} from "./domain/types";

export class USAMortgageServiceImpl implements USAMortgageService {

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

        const transferTax = this.calculateTransferTax(
            input.propertyPrice,
            rules.transferTax.brackets,
        );

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
            transferTax,
            amortizationSchedule,
            otherFees: {
                notaryFees: {
                    value: transferTax,
                    label: 'TRANSFER_TAX',
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

    private calculateTransferTax(
        propertyPrice: number,
        brackets: TransferTaxBracket[],
    ): number {
        let tax = 0;
        let previousLimit = 0;

        for (const bracket of brackets) {
            if (bracket.upTo !== undefined && propertyPrice > previousLimit) {
                const taxable = Math.min(propertyPrice, bracket.upTo) - previousLimit;
                tax += taxable * bracket.rate;
                previousLimit = bracket.upTo;
            }

            if (bracket.above !== undefined && propertyPrice > bracket.above) {
                tax += (propertyPrice - bracket.above) * bracket.rate;
                break;
            }
        }

        return tax;
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
