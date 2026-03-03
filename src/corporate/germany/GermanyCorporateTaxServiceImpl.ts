import { Breakdown } from "../domain/types";
import { GermanyCorporateTaxService } from "./GermanyCorporateTaxService";
import { Input, Result, Rules } from "./domain/types";

export class GermanyCorporateTaxServiceImpl implements GermanyCorporateTaxService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const income = this._input.taxableIncome;

        if (income <= 0) {
            return {
                corporateTax: 0,
                solidaritySurcharge: 0,
                tradeTax: 0,
                totalTax: 0,
                effectiveTaxRate: 0,
                breakdowns: [],
            };
        }

        const corporateTax = income * this._rules.corporateIncomeTax.rate;
        const solidaritySurcharge = corporateTax * this._rules.solidaritySurcharge.rate;
        const tradeTax =
            income * this._rules.tradeTax.multiplier * this._rules.tradeTax.assessmentRate;
        const totalTax = corporateTax + solidaritySurcharge + tradeTax;

        const breakdowns: Breakdown[] = [
            {
                from: '0',
                to: 'All',
                rate: this._rules.corporateIncomeTax.rate,
                amount: corporateTax,
            },
            {
                from: 'Corp Tax',
                to: 'Solidarity',
                rate: this._rules.solidaritySurcharge.rate,
                amount: solidaritySurcharge,
            },
            {
                from: '0',
                to: 'Trade',
                rate: this._rules.tradeTax.multiplier * this._rules.tradeTax.assessmentRate,
                amount: tradeTax,
            },
        ];

        return {
            corporateTax,
            solidaritySurcharge,
            tradeTax,
            totalTax,
            effectiveTaxRate: (totalTax / income) * 100,
            breakdowns,
        };
    }
}
