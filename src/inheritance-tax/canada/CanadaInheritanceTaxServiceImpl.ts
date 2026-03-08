import { Breakdown } from "../domain/types";
import { CanadaInheritanceTaxService } from "./CanadaInheritanceTaxService";
import { Input, Result, Rules, TaxBracket } from "./domain/types";

export class CanadaInheritanceTaxServiceImpl implements CanadaInheritanceTaxService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const gain = this._input.estateValue - this._input.adjustedCostBase;

        if (gain <= 0) {
            return {
                taxableEstate: 0,
                inheritanceTax: 0,
                effectiveRate: 0,
                breakdowns: [],
            };
        }

        const taxableGain = gain * this._rules.inclusionRate;
        const { tax, breakdowns } = this.applyBrackets(taxableGain, this._rules.taxBrackets);

        return {
            taxableEstate: taxableGain,
            inheritanceTax: tax,
            effectiveRate: gain > 0 ? (tax / gain) * 100 : 0,
            breakdowns,
        };
    }

    private applyBrackets(
        taxableAmount: number,
        brackets: TaxBracket[],
    ): { tax: number; breakdowns: Breakdown[] } {
        let tax = 0;
        const breakdowns: Breakdown[] = [];

        for (const bracket of brackets) {
            if (taxableAmount <= bracket.from) break;

            const upper = bracket.to ?? taxableAmount;
            const taxable = Math.min(upper, taxableAmount) - bracket.from;

            if (taxable > 0) {
                const bracketTax = taxable * bracket.rate;
                tax += bracketTax;

                breakdowns.push({
                    from: `${bracket.from}`,
                    to: `${bracket.to ?? 'Above'}`,
                    rate: bracket.rate,
                    amount: bracketTax,
                });
            }
        }

        return { tax, breakdowns };
    }
}
