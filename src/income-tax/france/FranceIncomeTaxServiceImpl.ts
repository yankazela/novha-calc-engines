import { BracketAllocation } from "../domain/types";
import { ComputedIncomeTaxValues, IncomeTaxRules } from "./domain/types";
import { FranceIncomeTaxService } from "./FranceIncomeTaxService";

export class FranceIncomeTaxServiceImpl implements FranceIncomeTaxService {
    private _income: number;
    private _rules: IncomeTaxRules;
    private _familyParts: number;

    constructor(income: number, rules: IncomeTaxRules, familyParts: number) {
        this._income = income;
        this._rules = rules;
        this._familyParts = familyParts;
    }

    public calculateNetIncome(): ComputedIncomeTaxValues {

		const taxablePerPart = this._familyParts * this._income / this._familyParts;
		const { tax: taxPerPart, marginalRate, bracketBreakdown } = this.calculateProgressiveTax(taxablePerPart);
		const incomeTax = taxPerPart * this._familyParts;
		const socialContributions = this._income * this._rules.socialContributions.employee.rate;
		const totalDeductions = incomeTax + socialContributions;
		const netIncome = this._income - totalDeductions;

		return {
			grossIncome: this._income,
			incomeTax: this.round(incomeTax),
			socialContributions: this.round(socialContributions),
			totalDeductions: this.round(totalDeductions),
			netIncome: this.round(netIncome),
			averageTaxRate: this.round(incomeTax / this._income),
			marginalTaxRate: marginalRate,
			taxBracketBreakdown: bracketBreakdown,
		};
	}


    private calculateProgressiveTax(income: number): {
        tax: number;
        marginalRate: number;
        bracketBreakdown: BracketAllocation[];
    } {
		let tax = 0;
		let marginalRate = 0;
		const bracketBreakdown: BracketAllocation[] = [];

		for (let index = 0; index < this._rules.taxBrackets.length; index++) {
			const bracket = this._rules.taxBrackets[index];
			const upperBound = bracket.to ?? income;

			if (income <= bracket.from) {
				bracketBreakdown.push({
					bracketIndex: index,
					bracketName: `Bracket ${index + 1}`,
					from: bracket.from,
					to: bracket.to ?? null,
					rate: bracket.rate,
					amountInBracket: 0,
					taxOnAmount: 0,
				});
				break;
			}

			const taxableAmount = Math.min(upperBound, income) - bracket.from;

			if (taxableAmount > 0) {
				tax += taxableAmount * bracket.rate;
				marginalRate = bracket.rate;
				bracketBreakdown.push({
					bracketIndex: index,
					bracketName: `Bracket ${index + 1}`,
					from: bracket.from,
					to: bracket.to ?? null,
					rate: bracket.rate,
					amountInBracket: taxableAmount,
					taxOnAmount: taxableAmount * bracket.rate,
				});
			} else {
				bracketBreakdown.push({
					bracketIndex: index,
					bracketName: `Bracket ${index + 1}`,
					from: bracket.from,
					to: bracket.to ?? null,
					rate: bracket.rate,
					amountInBracket: 0,
					taxOnAmount: 0,
				});
			}
		}

		return { tax, marginalRate, bracketBreakdown };
	}

    private round(value: number): number {
		return Math.round(value * 100) / 100;
	}
}
