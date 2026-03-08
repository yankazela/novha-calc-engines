import { Result } from "../domain/types";
import { CanadaCapitalGainsService } from "./CanadaCapitalGainsService";
import { Input, Rules, TaxBracket } from "./domain/types";

export class CanadaCapitalGainsServiceImpl implements CanadaCapitalGainsService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const gain = this._input.capitalGain;

        if (gain <= 0) {
            return {
                taxableGain: 0,
                capitalGainTax: 0,
                socialContributions: 0,
                netInvestmentIncomeTax: 0,
                totalTax: 0,
                effectiveRate: 0,
                breakdowns: []
            };
        }

        const taxableGain = gain * this._rules.inclusionRate;

        // income BEFORE the capital gain
        const baseIncome = this._input.totalTaxableIncome;

        const incomeWithGain = baseIncome + taxableGain;

        const baseTax = this.calculateProgressiveTax(baseIncome, this._rules.taxBrackets);
        const taxWithGain = this.calculateProgressiveTax(incomeWithGain, this._rules.taxBrackets);

        const capitalGainTax = taxWithGain - baseTax;

        return {
            taxableGain,
            capitalGainTax,
            socialContributions: 0,
            netInvestmentIncomeTax: 0,
            totalTax: capitalGainTax,
            effectiveRate: gain > 0 ? (capitalGainTax / gain) * 100 : 0,
            breakdowns: []
        };
    }

    private calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
        let tax = 0;

        for (const bracket of brackets) {
            const upper = bracket.to ?? Infinity;

            if (income <= bracket.from) break;

            const taxable = Math.min(income, upper) - bracket.from;

            if (taxable > 0) {
                tax += taxable * bracket.rate;
            }
        }

        return tax;
    }
}