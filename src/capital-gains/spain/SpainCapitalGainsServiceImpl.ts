import { Breakdown, Result } from "../domain/types";
import { SpainCapitalGainsService } from "./SpainCapitalGainsService";
import { CapitalGainsBracket, Input, Rules } from "./domain/types";

export class SpainCapitalGainsServiceImpl implements SpainCapitalGainsService {
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
                breakdowns: [],
            };
        }

        const { tax, breakdowns } = this.applyBrackets(gain, this._rules.brackets);

        return {
            taxableGain: gain,
            capitalGainTax: tax,
            socialContributions: 0,
            netInvestmentIncomeTax: 0,
            totalTax: tax,
            effectiveRate: (tax / gain) * 100,
            breakdowns,
        };
    }

    private applyBrackets(
        gain: number,
        brackets: CapitalGainsBracket[],
    ): { tax: number; breakdowns: Breakdown[] } {
        let tax = 0;
        const breakdowns: Breakdown[] = [];

        for (const bracket of brackets) {
            if (gain <= bracket.from) break;

            const upper = bracket.to ?? gain;
            const taxable = Math.min(upper, gain) - bracket.from;

            if (taxable > 0) {
                const bracketTax = taxable * bracket.rate;
                tax += bracketTax;
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
