import { Breakdown, Result } from "../domain/types";
import { JapanCapitalGainsService } from "./JapanCapitalGainsService";
import { Input, Rules } from "./domain/types";

export class JapanCapitalGainsServiceImpl implements JapanCapitalGainsService {
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

        const tax = gain * this._rules.flatRate;
        const breakdowns: Breakdown[] = [{
            from: '0',
            to: 'All',
            rate: this._rules.flatRate,
            amount: tax,
        }];

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
}
