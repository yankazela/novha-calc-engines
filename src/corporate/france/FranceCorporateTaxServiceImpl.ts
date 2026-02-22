import { Breakdown } from '../domain/types';
import { Rules, Input, Result, ProgressiveTaxBracket } from './domain/types';
import { FranceCorporateTaxService } from './FranceCorporateTaxService';

export class FranceCorporateTaxServiceImpl implements FranceCorporateTaxService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const result = this.applyRules(this._rules, this._input);

        const totalTax = result.tax;

        return {
            corporateTax: totalTax,
            effectiveTaxRate:
                this._input.taxableIncome > 0
                    ? (totalTax / this._input.taxableIncome) * 100
                    : 0,
            breakdowns: result.breakdowns,
        };
    }

    private applyRules(rules: Rules, input: Input): { tax: number; breakdowns: Breakdown[] } {
        const regime = input.isSmallBusiness
            ? rules.regimes.smallBusiness
            : rules.regimes.general;

        if (regime.conditions?.maxTurnover) {
            if (input.annualTurnover > regime.conditions.maxTurnover) {
                throw new Error('SME regime not applicable: turnover exceeded');
            }
        }

        if (regime.type === 'flat') {
            const tax = input.taxableIncome * regime.rate;
            return {
                tax,
                breakdowns:[{
                    from: '0',
                    to: 'Above',
                    rate: regime.rate,
                    amount: tax
                }]
            };
        }

        if (regime.type === 'progressive') {
            let remaining = input.taxableIncome;
            let tax = 0;
            const breakdowns: Breakdown[] = [];

            for (const bracket of regime.brackets) {
                if (remaining <= 0) break;

                const upper = bracket.to ?? Infinity;
                const taxable = Math.min(upper - bracket.from, remaining);

                const bracketTax = taxable * bracket.rate;
                tax += bracketTax;
                remaining -= taxable;

                breakdowns.push({
                    from: `${bracket.from}`,
                    to: `${bracket.to ?? 'Above'}`,
                    rate: bracket.rate,
                    amount: bracketTax,
                });
            }

            return { tax, breakdowns };
        }

        throw new Error('Unsupported regime type');
    }
}