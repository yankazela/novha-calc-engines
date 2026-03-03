import { Breakdown } from "../domain/types";
import { USACorporateTaxService } from "./USACorporateTaxService";
import { Input, Result, Rules } from "./domain/types";

export class USACorporateTaxServiceImpl implements USACorporateTaxService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const income = this._input.taxableIncome;

        if (income <= 0) {
            return { corporateTax: 0, effectiveTaxRate: 0, breakdowns: [] };
        }

        const tax = income * this._rules.regime.rate;
        const breakdowns: Breakdown[] = [{
            from: '0',
            to: 'All',
            rate: this._rules.regime.rate,
            amount: tax,
        }];

        return {
            corporateTax: tax,
            effectiveTaxRate: (tax / income) * 100,
            breakdowns,
        };
    }
}
