import { Breakdown, Result } from "../domain/types";
import { FranceCapitalGainsService } from "./FranceCapitalGainsService";
import { Input, Rules } from "./domain/types";

export class FranceCapitalGainsServiceImpl implements FranceCapitalGainsService {
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
                taxableGain: gain,
                capitalGainTax: 0,
                socialContributions: 0,
                netInvestmentIncomeTax: 0,
                totalTax: 0,
                effectiveRate: 0,
                breakdowns: []
            };
        }

        const capitalGainTax = gain * this._rules.flatTaxRate;
        const socialContributions = gain * this._rules.socialContributionsRate;
        const totalTax = capitalGainTax + socialContributions;

        const breakdowns: Breakdown[] = [
            {
                from: '0',
                to: 'All',
                rate: this._rules.flatTaxRate,
                amount: capitalGainTax,
            },
            {
                from: '0',
                to: 'Social',
                rate: this._rules.socialContributionsRate,
                amount: socialContributions,
            },
        ];

        return {
            taxableGain: gain,
            capitalGainTax,
            socialContributions,
            netInvestmentIncomeTax: 0,
            totalTax,
            effectiveRate: (totalTax / gain) * 100,
            breakdowns,
        };
    }
}
