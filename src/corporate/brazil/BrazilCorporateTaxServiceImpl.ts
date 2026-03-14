import { Breakdown } from "../domain/types";
import { BrazilCorporateTaxService } from "./BrazilCorporateTaxService";
import { Input, Result, Rules } from "./domain/types";

export class BrazilCorporateTaxServiceImpl implements BrazilCorporateTaxService {
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

        const irpjBase = income * this._rules.irpj.baseRate;
        const surcharge = income > this._rules.irpj.surchargeThreshold
            ? (income - this._rules.irpj.surchargeThreshold) * this._rules.irpj.surchargeRate
            : 0;
        const csll = income * this._rules.csll.rate;
        const corporateTax = irpjBase + surcharge + csll;

        const breakdowns: Breakdown[] = [
            { from: '0', to: 'All', rate: this._rules.irpj.baseRate, amount: irpjBase },
            { from: `${this._rules.irpj.surchargeThreshold}`, to: 'Surcharge', rate: this._rules.irpj.surchargeRate, amount: surcharge },
            { from: '0', to: 'CSLL', rate: this._rules.csll.rate, amount: csll },
        ];

        return {
            corporateTax,
            effectiveTaxRate: (corporateTax / income) * 100,
            breakdowns,
        };
    }
}
