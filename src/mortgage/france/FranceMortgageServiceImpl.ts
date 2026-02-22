import { FranceMortgageService } from '../..';
import { MortgageRules, MortgageInput, MortgageOutput, AmortizationScheduleItem } from './domain/types';

export class FranceMortgageServiceImpl implements FranceMortgageService {
    private _input: MortgageInput;
    private _rules: MortgageRules;

    constructor(input: MortgageInput, rules: MortgageRules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): MortgageOutput {

        if (
            this._input.isFirstTimeBuyer &&
            this._rules.firstTimeBuyer &&
            this._rules.firstTimeBuyer.requiresPrimaryResidence &&
            !this._input.isPrimaryResidence
        ) {
        return this.ineligibleResult(this._input);
        }

        const debtRatio =
            this._input.isFirstTimeBuyer && this._rules.firstTimeBuyer &&this._rules.firstTimeBuyer.enabled
                ? this._rules.firstTimeBuyer.maxDebtRatio
                : this._rules.maxDebtRatio;

        const loanDurationYears =
            this._input.isFirstTimeBuyer && this._rules.firstTimeBuyer && this._rules.firstTimeBuyer.enabled
                ? this._rules.firstTimeBuyer.maxLoanDurationYears
                : this._input.isNewBuild
                ? this._rules.maxLoanDurationNewBuildYears
                : this._rules.maxLoanDurationYears;

        const minDownPayment = this._input.propertyPrice * this._rules.minDownPaymentRate;

        if (this._input.downPayment < minDownPayment) {
            return this.ineligibleResult(this._input);
        }

        const notaryRate = this._input.isNewBuild
        ? this._rules.fees.notaryRateNewProperty
        : this._rules.fees.notaryRateOldProperty;

        const notaryFees = this._input.propertyPrice * notaryRate;
        const bankFees = this._input.propertyPrice * this._rules.fees.bankFeesRate;
        const totalProjectCost = this._input.propertyPrice + notaryFees + bankFees;
        const requiredLoanAmount = totalProjectCost - this._input.downPayment;
        const stressedRate = this._input.annualInterestRate + this._rules.stressTest.interestRateBuffer;

        const monthlyInsuranceCost = (requiredLoanAmount * this._rules.insurance.averageRate) / 12;

        let maxMonthlyPayment = this._input.netMonthlyIncome * debtRatio;

        if (this._rules.insurance.includedInDebtRatio) {
            maxMonthlyPayment -= monthlyInsuranceCost;
        }

        const maxLoanAmount = this.calculateLoanAmount(
            maxMonthlyPayment,
            stressedRate,
            loanDurationYears
        );

        const monthlyPayment = this.calculateMonthlyPayment(
            requiredLoanAmount,
            this._input.annualInterestRate,
            loanDurationYears
        );

        const totalPaid = monthlyPayment * loanDurationYears * 12;
        const totalInterestPaid = totalPaid - requiredLoanAmount;

        const amortizationSchedule = this.calculateAmortizationSchedule(
            requiredLoanAmount,
            this._input.annualInterestRate,
            loanDurationYears,
            monthlyPayment
        );

        return {
            loanAmount: requiredLoanAmount,
            totalPaid,
            totalInterestPaid,
            monthlyPayment,
            requiredLoanAmount,
            maxMonthlyPayment,
            maxLoanAmount,
            totalProjectCost,
            loanDurationYears,
            debtRatio: debtRatio,
            monthlyInsuranceCost,
            isEligible: maxLoanAmount >= requiredLoanAmount,
            amortizationSchedule,
            otherFees: {
                notaryFees: {
                    value: notaryFees,
                    label: 'NOTARY_FEES'
                },
                bankFees: {
                    value: bankFees,
                    label: 'BANK_FEES'
                },
                monthlyInsuranceFees: {
                    value: monthlyInsuranceCost,
                    label: 'MONTHLY_INSURANCE_FEES'
                }
            }
        };
    }

    private calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
        const monthlyRate = annualRate / 100 / 12;
        const payments = years * 12;

        if (monthlyRate === 0) {
            return payments === 0 ? 0 : principal / payments;
        }

        return (
            principal *
            (monthlyRate / (1 - Math.pow(1 + monthlyRate, -payments)))
        );
    }

    private calculateAmortizationSchedule(
        loanAmount: number,
        annualRate: number,
        years: number,
        monthlyPayment: number
    ): AmortizationScheduleItem[] {
        const monthlyRate = annualRate / 100 / 12;
        const totalPayments = years * 12;

        if (monthlyRate === 0 || loanAmount <= 0 || monthlyPayment <= 0) {
            return [];
        }

        const schedule: AmortizationScheduleItem[] = [];
        let balance = loanAmount;

        for (let year = 1; year <= years; year++) {
            let yearlyPrincipal = 0;
            let yearlyInterest = 0;

            const paymentsInYear = Math.min(12, totalPayments - (year - 1) * 12);

            for (let month = 1; month <= paymentsInYear; month++) {
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
                balance: Math.max(0, balance)
            });

            if (balance <= 0) break;
        }

        return schedule;
    }

    private calculateLoanAmount(monthlyPayment: number, annualRate: number, years: number): number {
        const monthlyRate = annualRate / 100 / 12;
        const payments = years * 12;

        if (monthlyRate === 0) {
            return monthlyPayment * payments;
        }

        return (
            monthlyPayment *
            ((1 - Math.pow(1 + monthlyRate, -payments)) / monthlyRate)
        );
    }

    private ineligibleResult(input: MortgageInput): MortgageOutput {
        return {
            maxMonthlyPayment: 0,
            maxLoanAmount: 0,
            totalProjectCost: input.propertyPrice,
            requiredLoanAmount: input.propertyPrice - input.downPayment,
            loanDurationYears: 0,
            debtRatio: 0,
            monthlyInsuranceCost: 0,
            loanAmount: 0,
            monthlyPayment: 0,
            totalInterestPaid: 0,
            totalPaid: 0,
            isEligible: false,
            amortizationSchedule: [],
            otherFees: {
                notaryFees: {
                    value: 0,
                    label: 'NOTARY_FEES'
                },
                bankFees: {
                    value: 0,
                    label: 'BANK_FEES'
                },
                monthlyInsuranceFees: {
                    value: 0,
                    label: 'MONTHLY_INSURANCE_FEES'
                }
            }
        };
    }
}