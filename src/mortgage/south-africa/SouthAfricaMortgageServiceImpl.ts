import { MortgageRules, MortgageInput, MortgageOutput, AmortizationScheduleItem } from './domain/types';
import { SouthAfricaMortgageService } from './SouthAfricaMortgageService';

export class SouthAfricaMortgageServiceImpl implements SouthAfricaMortgageService {
  constructor(
    private readonly input: MortgageInput,
    private readonly rules: MortgageRules
) {}

	calculate(): MortgageOutput {
		const loanAmount = this.input.propertyPrice - this.input.downPayment;

		// Monthly interest rate
		const monthlyRate = this.input.annualInterestRate / 100 / 12;
		const totalPayments = this.input.amortizationYears * 12;

		// Standard amortized monthly payment formula
		const monthlyPayment =
		(loanAmount * monthlyRate) /
		(1 - Math.pow(1 + monthlyRate, -totalPayments));

		const totalPaid = monthlyPayment * totalPayments;
		const totalInterestPaid = totalPaid - loanAmount;

		// Debt-to-income ratio
		const debtToIncomeRatio =
		(monthlyPayment / this.input.grossMonthlyIncome) * 100;

		const isAffordable =
		debtToIncomeRatio <= this.rules.loanConstraints.maxDebtToIncomePercent;

		// Fees
		const bondRegistrationFee =
		loanAmount * (this.rules.fees.bondRegistrationPercent / 100);

		const transferDuty = this.calculateTransferDuty(this.input.propertyPrice);
		const amortizationSchedule = this.calculateAmortizationSchedule(
			loanAmount,
			monthlyRate,
			monthlyPayment,
			totalPayments
		);

		return {
			loanAmount,
			monthlyPayment,
			totalInterestPaid,
			totalPaid,
			debtToIncomeRatio,
			isAffordable,
			transferDuty,
			bondRegistrationFee,
			amortizationSchedule,
			otherFees: {
                notaryFees: {
                    value: bondRegistrationFee,
                    label: 'BOND_REGISTRATION_FEES'
                },
                bankFees: {
                    value: transferDuty,
                    label: 'TRANSFER_DUTY'
                },
                monthlyInsuranceFees: {
                    value: 0,
                    label: 'MONTHLY_INSURANCE_FEES'
                }
            }
		};
	}

	private calculateAmortizationSchedule(
		loanAmount: number,
		monthlyRate: number,
		monthlyPayment: number,
		totalPayments: number
	): AmortizationScheduleItem[] {
		const schedule: AmortizationScheduleItem[] = [];
		let balance = loanAmount;

		for (let year = 1; year <= this.input.amortizationYears; year++) {
			let yearlyPrincipal = 0;
			let yearlyInterest = 0;

			// Calculate for 12 months or remaining payments
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

	private calculateTransferDuty(propertyPrice: number): number {
		let duty = 0;
		let previousLimit = 0;

		for (const bracket of this.rules.fees.transferDuty.brackets) {
			if (bracket.upTo && propertyPrice > previousLimit) {
				const taxable = Math.min(propertyPrice, bracket.upTo) - previousLimit;
				duty += taxable * bracket.rate;
				previousLimit = bracket.upTo;
			}

			if (bracket.above && propertyPrice > bracket.above) {
				duty += (propertyPrice - bracket.above) * bracket.rate;
				break;
			}
		}

		return duty;
	}
}
