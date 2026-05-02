import { BracketAllocation } from "../domain/types";
import { NetherlandsIncomeTaxService } from "./NetherlandsIncomeTaxService";
import { ComputedIncomeTaxValues, IncomeTaxRules } from "./domain/types";

export class NetherlandsIncomeTaxServiceImpl implements NetherlandsIncomeTaxService {
    private _income: number;
    private _rules: IncomeTaxRules;

    constructor(income: number, rules: IncomeTaxRules) {
        this._income = income;
        this._rules = rules;
    }

    public calculateNetIncome(): ComputedIncomeTaxValues {
        const { grossTax, bracketBreakdown } = this.computeTaxBrackets(this._income);
        const socialContributions = this._income * this._rules.socialContributions.rate;
        const totalDeductions = grossTax + socialContributions;
        const netIncome = this._income - totalDeductions;

        return {
            grossIncome: this._income,
            incomeTax: this.round(grossTax),
            socialContributions: this.round(socialContributions),
            totalDeductions: this.round(totalDeductions),
            netIncome: this.round(netIncome),
            effectiveTaxRate: this._income > 0 ? this.round(grossTax / this._income, 4) : 0,
            taxBracketBreakdown: bracketBreakdown,
        };
    }

    private computeTaxBrackets(
        income: number,
    ): { grossTax: number; bracketBreakdown: BracketAllocation[] } {
        let tax = 0;
        const bracketBreakdown: BracketAllocation[] = [];

        for (let index = 0; index < this._rules.taxBrackets.length; index++) {
            const bracket = this._rules.taxBrackets[index];

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

            const upper = bracket.to ?? income;
            const taxableAmount = Math.min(upper, income) - bracket.from;

            const taxOnAmount = taxableAmount * bracket.rate;
            tax += taxOnAmount;
            bracketBreakdown.push({
                bracketIndex: index,
                bracketName: `Bracket ${index + 1}`,
                from: bracket.from,
                to: bracket.to ?? null,
                rate: bracket.rate,
                amountInBracket: taxableAmount,
                taxOnAmount,
            });
        }

        return { grossTax: tax, bracketBreakdown };
    }

    private round(value: number, decimals = 2): number {
        return Number(value.toFixed(decimals));
    }
}
