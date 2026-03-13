import { BracketAllocation } from "../domain/types";
import { BrazilIncomeTaxService } from "./BrazilIncomeTaxService";
import { ComputedIncomeTaxValues, INSSRules, IncomeTaxRules } from "./domain/types";

export class BrazilIncomeTaxServiceImpl implements BrazilIncomeTaxService {
    private _income: number;
    private _rules: IncomeTaxRules;

    constructor(income: number, rules: IncomeTaxRules) {
        this._income = income;
        this._rules = rules;
    }

    public calculateNetIncome(): ComputedIncomeTaxValues {
        const { grossTax, bracketBreakdown } = this.computeTaxBrackets(this._income);
        const inss = this.computeINSS(this._income, this._rules.inss);
        const totalDeductions = grossTax + inss;
        const netIncome = this._income - totalDeductions;

        return {
            grossIncome: this._income,
            incomeTax: this.round(grossTax),
            inss: this.round(inss),
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

            if (taxableAmount > 0) {
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

        return { grossTax: tax, bracketBreakdown };
    }

    private computeINSS(income: number, rules: INSSRules): number {
        return Math.min(income, rules.cap) * rules.rate;
    }

    private round(value: number, decimals = 2): number {
        return Number(value.toFixed(decimals));
    }
}
