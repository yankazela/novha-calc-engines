import { Breakdown } from '../domain/types';
import { Rules, Input, Result, ProgressiveTaxBracket } from './domain/types';
import { SouthAfricaCorporateTaxService } from './SouthAfricaCorporateTaxService';

export class SouthAfricaCorporateTaxServiceImpl implements SouthAfricaCorporateTaxService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const rule = this._rules.regimes[this._input.regime];

        if (!rule) {
            throw new Error(`Unknown tax regime: ${this._input.regime}`);
        }

        let tax = 0;
        let breakdowns: Breakdown[] = [];

        if (rule.type === 'flat') {
            tax = this._input.taxableIncome * rule.rate;
            breakdowns = [{
                from: '0',
                to: 'Above',
                rate: rule.rate,
                amount: tax
            }];
        }

        if (rule.type === 'progressive') {
            const result = this.calculateProgressiveTax(
                this._input.taxableIncome,
                rule.brackets
            );
            tax = result.total;
            breakdowns = result.breakdowns;
        }

        return {
            corporateTax: tax,
            effectiveTaxRate:
            this._input.taxableIncome > 0
                ? (tax / this._input.taxableIncome) * 100
                : 0,
            breakdowns,
        };
    }

    private calculateProgressiveTax(income: number, brackets: ProgressiveTaxBracket[]): { total: number; breakdowns: Breakdown[] } {
        let tax = 0;
        const breakdowns: Breakdown[] = [];

        for (const bracket of brackets) {
            if (income <= bracket.from) continue;

            const upperLimit =
            bracket.to === null ? income : Math.min(income, bracket.to);

            const taxableAmount = upperLimit - bracket.from;

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