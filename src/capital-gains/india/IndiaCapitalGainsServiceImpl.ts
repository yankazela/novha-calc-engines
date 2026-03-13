import { Breakdown, Result } from "../domain/types";
import { IndiaCapitalGainsService } from "./IndiaCapitalGainsService";
import { Input, Rules } from "./domain/types";

export class IndiaCapitalGainsServiceImpl implements IndiaCapitalGainsService {
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

        const isLongTerm = this._input.holdingPeriodMonths >= 12;
        const breakdowns: Breakdown[] = [];
        let tax = 0;

        if (isLongTerm) {
            const taxableGain = Math.max(0, gain - this._rules.longTermExemption);
            tax = taxableGain * this._rules.longTermRate;
            if (taxableGain > 0) {
                breakdowns.push({
                    from: `${this._rules.longTermExemption}`,
                    to: 'Above',
                    rate: this._rules.longTermRate,
                    amount: tax,
                });
            }
        } else {
            tax = gain * this._rules.shortTermRate;
            breakdowns.push({
                from: '0',
                to: 'All',
                rate: this._rules.shortTermRate,
                amount: tax,
            });
        }

        return {
            taxableGain: gain,
            capitalGainTax: tax,
            socialContributions: 0,
            netInvestmentIncomeTax: 0,
            totalTax: tax,
            effectiveRate: gain > 0 ? (tax / gain) * 100 : 0,
            breakdowns,
        };
    }
}
