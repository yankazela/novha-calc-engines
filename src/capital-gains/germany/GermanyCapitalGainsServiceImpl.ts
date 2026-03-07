import { Breakdown, Result } from "../domain/types";
import { GermanyCapitalGainsService } from "./GermanyCapitalGainsService";
import { Input, Rules } from "./domain/types";

export class GermanyCapitalGainsServiceImpl implements GermanyCapitalGainsService {
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

        const taxableGain = Math.max(0, gain - this._rules.annualExemption);

        if (taxableGain <= 0) {
            return {
                taxableGain: 0,
                capitalGainTax: 0,
                socialContributions: 0,
                netInvestmentIncomeTax: 0,
                totalTax: 0,
                effectiveRate: 0,
                breakdowns: [{
                    from: '0',
                    to: `${this._rules.annualExemption}`,
                    rate: 0,
                    amount: 0,
                }],
            };
        }

        const capitalGainTax = taxableGain * this._rules.flatTaxRate;
        const socialContributions = capitalGainTax * this._rules.solidaritySurchargeRate;
        const totalTax = capitalGainTax + socialContributions;

        const breakdowns: Breakdown[] = [
            {
                from: '0',
                to: 'All',
                rate: this._rules.flatTaxRate,
                amount: capitalGainTax,
            },
            {
                from: 'CGT',
                to: 'Solidarity',
                rate: this._rules.solidaritySurchargeRate,
                amount: socialContributions,
            },
        ];

        return {
            taxableGain,
            capitalGainTax,
            socialContributions,
            netInvestmentIncomeTax: 0,
            totalTax,
            effectiveRate: gain > 0 ? (totalTax / gain) * 100 : 0,
            breakdowns,
        };
    }
}
