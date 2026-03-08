import { Breakdown, Result } from "../domain/types";
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
        const otherIncome = this._input.totalTaxableIncome - gain;
        const { tax, breakdowns } = this.applyBrackets(taxableGain, otherIncome, this._rules.taxBrackets);

        return {
            taxableGain,
            capitalGainTax: tax,
            socialContributions: 0,
            netInvestmentIncomeTax: 0,
            totalTax: tax,
            effectiveRate: gain > 0 ? (tax / gain) * 100 : 0,
            breakdowns,
        };
    }

    private applyBrackets(
        taxableGain: number,
        otherIncome: number,
        brackets: TaxBracket[],
    ): { tax: number; breakdowns: Breakdown[] } {
        let tax = 0;
        const breakdowns: Breakdown[] = [];
        let remaining = taxableGain;
        let incomeUsed = otherIncome;

        for (const bracket of brackets) {
            if (remaining <= 0) break;

            const upper = bracket.to ?? Infinity;

            if (incomeUsed >= upper) continue;

            const bracketStart = Math.max(bracket.from, incomeUsed);
            const bracketSpace = upper - bracketStart;
            const taxable = Math.min(bracketSpace, remaining);

            if (taxable > 0) {
                const bracketTax = taxable * bracket.rate;
                tax += bracketTax;
                remaining -= taxable;
                incomeUsed += taxable;

                breakdowns.push({
                    from: `${bracket.from}`,
                    to: `${bracket.to ?? 'Above'}`,
                    rate: bracket.rate,
                    amount: bracketTax,
                });
            }
        }

        return { tax, breakdowns };
    }
}
