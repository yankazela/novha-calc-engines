import { Breakdown } from "../domain/types";
import { UKCapitalGainsService } from "./UKCapitalGainsService";
import { Input, Result, Rules } from "./domain/types";

export class UKCapitalGainsServiceImpl implements UKCapitalGainsService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const gain = this._input.capitalGain;

        if (gain <= 0) {
            return { taxableGain: 0, capitalGainsTax: 0, effectiveRate: 0, breakdowns: [] };
        }

        const taxableGain = Math.max(0, gain - this._rules.annualExemption);

        if (taxableGain <= 0) {
            return {
                taxableGain: 0,
                capitalGainsTax: 0,
                effectiveRate: 0,
                breakdowns: [{
                    from: '0',
                    to: `${this._rules.annualExemption}`,
                    rate: 0,
                    amount: 0,
                }],
            };
        }

        const basicRateRemaining = Math.max(0, this._rules.basicRateLimit - this._input.totalTaxableIncome);
        const breakdowns: Breakdown[] = [];
        let tax = 0;

        if (basicRateRemaining > 0) {
            const basicRateGain = Math.min(taxableGain, basicRateRemaining);
            const basicTax = basicRateGain * this._rules.basicRate;
            tax += basicTax;

            breakdowns.push({
                from: '0',
                to: `${basicRateRemaining}`,
                rate: this._rules.basicRate,
                amount: basicTax,
            });

            const higherRateGain = taxableGain - basicRateGain;
            if (higherRateGain > 0) {
                const higherTax = higherRateGain * this._rules.higherRate;
                tax += higherTax;

                breakdowns.push({
                    from: `${basicRateRemaining}`,
                    to: 'Above',
                    rate: this._rules.higherRate,
                    amount: higherTax,
                });
            }
        } else {
            const higherTax = taxableGain * this._rules.higherRate;
            tax += higherTax;

            breakdowns.push({
                from: '0',
                to: 'Above',
                rate: this._rules.higherRate,
                amount: higherTax,
            });
        }

        return {
            taxableGain,
            capitalGainsTax: tax,
            effectiveRate: gain > 0 ? (tax / gain) * 100 : 0,
            breakdowns,
        };
    }
}
