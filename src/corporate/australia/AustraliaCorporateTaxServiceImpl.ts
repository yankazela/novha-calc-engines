import { Breakdown } from "../domain/types";
import { AustraliaCorporateTaxService } from "./AustraliaCorporateTaxService";
import { Input, ProgressiveTaxBracket, Result, Rules } from "./domain/types";

export class AustraliaCorporateTaxServiceImpl implements AustraliaCorporateTaxService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const regime = this._input.isSmallBusiness
            ? this._rules.regimes.smallBusiness
            : this._rules.regimes.general;

        if (!regime) {
            throw new Error('Unknown tax regime');
        }

        if (regime.conditions?.maxTurnover !== undefined) {
            if (this._input.annualTurnover > regime.conditions.maxTurnover) {
                throw new Error('Small business regime not applicable: turnover exceeded');
            }
        }

        let tax = 0;
        let breakdowns: Breakdown[] = [];

        if (regime.type === 'flat') {
            tax = this._input.taxableIncome * regime.rate;
            breakdowns = [{
                from: '0',
                to: 'Above',
                rate: regime.rate,
                amount: tax,
            }];
        } else if (regime.type === 'progressive') {
            const result = this.calculateProgressiveTax(
                this._input.taxableIncome,
                regime.brackets,
            );
            tax = result.total;
            breakdowns = result.breakdowns;
        } else {
            throw new Error('Unsupported regime type');
        }

        return {
            corporateTax: tax,
            effectiveTaxRate: this._input.taxableIncome > 0
                ? (tax / this._input.taxableIncome) * 100
                : 0,
            breakdowns,
        };
    }

    private calculateProgressiveTax(
        income: number,
        brackets: ProgressiveTaxBracket[],
    ): { total: number; breakdowns: Breakdown[] } {
        let tax = 0;
        const breakdowns: Breakdown[] = [];

        for (const bracket of brackets) {
            if (income <= bracket.from) break;

            const upper = bracket.to === null ? income : Math.min(income, bracket.to);
            const taxableAmount = upper - bracket.from;

            if (taxableAmount > 0) {
                const bracketTax = taxableAmount * bracket.rate;
                tax += bracketTax;

                breakdowns.push({
                    from: `${bracket.from}`,
                    to: `${bracket.to ?? 'Above'}`,
                    rate: bracket.rate,
                    amount: bracketTax,
                });
            }
        }

        return { total: tax, breakdowns };
    }
}
