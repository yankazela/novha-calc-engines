import { Breakdown } from "../domain/types";
import { GermanyCapitalGainsService } from "./GermanyCapitalGainsService";
import { Input, Result, Rules } from "./domain/types";

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
                capitalGainsTax: 0,
                solidaritySurcharge: 0,
                totalTax: 0,
                effectiveRate: 0,
                breakdowns: [],
            };
        }

        const taxableGain = Math.max(0, gain - this._rules.annualExemption);

        if (taxableGain <= 0) {
            return {
                taxableGain: 0,
                capitalGainsTax: 0,
                solidaritySurcharge: 0,
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

        const capitalGainsTax = taxableGain * this._rules.flatTaxRate;
        const solidaritySurcharge = capitalGainsTax * this._rules.solidaritySurchargeRate;
        const totalTax = capitalGainsTax + solidaritySurcharge;

        const breakdowns: Breakdown[] = [
            {
                from: '0',
                to: 'All',
                rate: this._rules.flatTaxRate,
                amount: capitalGainsTax,
            },
            {
                from: 'CGT',
                to: 'Solidarity',
                rate: this._rules.solidaritySurchargeRate,
                amount: solidaritySurcharge,
            },
        ];

        return {
            taxableGain,
            capitalGainsTax,
            solidaritySurcharge,
            totalTax,
            effectiveRate: gain > 0 ? (totalTax / gain) * 100 : 0,
            breakdowns,
        };
    }
}
