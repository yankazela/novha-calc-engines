import { AustraliaInheritanceTaxService } from "./AustraliaInheritanceTaxService";
import { Input, Result, Rules } from "./domain/types";

export class AustraliaInheritanceTaxServiceImpl implements AustraliaInheritanceTaxService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        return {
            taxableEstate: 0,
            inheritanceTax: 0,
            effectiveRate: 0,
            breakdowns: [],
        };
    }
}
