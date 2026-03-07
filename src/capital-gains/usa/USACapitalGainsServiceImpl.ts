import { Breakdown, Result } from "../domain/types";
import { USACapitalGainsService } from "./USACapitalGainsService";
import { Input, LongTermBracket, Rules } from "./domain/types";

export class USACapitalGainsServiceImpl implements USACapitalGainsService {
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

        const isLongTerm = this._input.holdingPeriodMonths > 12;
        const brackets = isLongTerm ? this._rules.longTermBrackets : this._rules.shortTermBrackets;

        const { tax, breakdowns } = this.applyBrackets(gain, this._input.totalTaxableIncome, brackets);

        let niit = 0;
        if (this._input.totalTaxableIncome > this._rules.netInvestmentIncomeTax.threshold) {
            niit = gain * this._rules.netInvestmentIncomeTax.rate;
            breakdowns.push({
                from: 'NIIT',
                to: 'All Gain',
                rate: this._rules.netInvestmentIncomeTax.rate,
                amount: niit,
            });
        }

        const totalTax = tax + niit;

        return {
            taxableGain: gain,
            capitalGainTax: tax,
            socialContributions: 0,
            netInvestmentIncomeTax: niit,
            totalTax,
            effectiveRate: gain > 0 ? (totalTax / gain) * 100 : 0,
            breakdowns,
        };
    }

    private applyBrackets(
        gain: number,
        totalIncome: number,
        brackets: LongTermBracket[],
    ): { tax: number; breakdowns: Breakdown[] } {
        let tax = 0;
        const breakdowns: Breakdown[] = [];
        let remaining = gain;
        let incomeUsed = totalIncome - gain;

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
