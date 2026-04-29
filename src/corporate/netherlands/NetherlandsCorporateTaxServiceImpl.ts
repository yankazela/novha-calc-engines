import { Breakdown } from "../domain/types";
import { NetherlandsCorporateTaxService } from "./NetherlandsCorporateTaxService";
import { Input, Result, Rules } from "./domain/types";

export class NetherlandsCorporateTaxServiceImpl implements NetherlandsCorporateTaxService {
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

        let tax = 0;
        const breakdowns: Breakdown[] = [];

        for (const tier of this._rules.tiers) {
            if (income <= tier.from) break;

            const upper = tier.to ?? income;
            const taxable = Math.min(upper, income) - tier.from;

            if (taxable > 0) {
                const tierTax = taxable * tier.rate;
                tax += tierTax;
                breakdowns.push({
                    from: `${tier.from}`,
                    to: `${tier.to ?? 'Above'}`,
                    rate: tier.rate,
                    amount: tierTax,
                });
            }
        }

        return {
            corporateTax: tax,
            effectiveTaxRate: (tax / income) * 100,
            breakdowns,
        };
    }
}
