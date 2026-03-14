import { Breakdown } from "../domain/types";
import { JapanInheritanceTaxService } from "./JapanInheritanceTaxService";
import { Input, Result, Rules, TaxBracket } from "./domain/types";

export class JapanInheritanceTaxServiceImpl implements JapanInheritanceTaxService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const estate = this._input.estateValue;
        const heirs = Math.max(1, this._input.numberOfStatutoryHeirs);
        const exemption = this._rules.baseExemption + this._rules.perHeirExemption * heirs;

        if (estate <= 0 || estate <= exemption) {
            return {
                taxableEstate: 0,
                inheritanceTax: 0,
                effectiveRate: 0,
                breakdowns: [],
            };
        }

        const taxableEstate = estate - exemption;
        const { tax, breakdowns } = this.applyBrackets(taxableEstate, this._rules.taxBrackets);

        return {
            taxableEstate,
            inheritanceTax: tax,
            effectiveRate: estate > 0 ? (tax / estate) * 100 : 0,
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
