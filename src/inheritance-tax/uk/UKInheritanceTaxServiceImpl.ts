import { Breakdown } from "../domain/types";
import { UKInheritanceTaxService } from "./UKInheritanceTaxService";
import { Input, Result, Rules } from "./domain/types";

export class UKInheritanceTaxServiceImpl implements UKInheritanceTaxService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const estate = this._input.estateValue;

        if (estate <= 0 || estate <= this._rules.nilRateBand) {
            return {
                taxableEstate: 0,
                inheritanceTax: 0,
                effectiveRate: 0,
                breakdowns: [],
            };
        }

        const taxableEstate = estate - this._rules.nilRateBand;
        const rate = this._input.charitableGivingPercent >= this._rules.charityThreshold
            ? this._rules.charityRate
            : this._rules.standardRate;
        const tax = taxableEstate * rate;

        const breakdowns: Breakdown[] = [{
            from: `${this._rules.nilRateBand}`,
            to: 'Above',
            rate,
            amount: tax,
        }];

        return {
            taxableEstate,
            inheritanceTax: tax,
            effectiveRate: estate > 0 ? (tax / estate) * 100 : 0,
            breakdowns,
        };
    }
}
