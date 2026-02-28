import { Breakdown } from "../domain/types";
import { UKCorporateTaxService } from "./UKCorporateTaxService";
import { Input, MarginalReliefRule, Result, Rules } from "./domain/types";

export class UKCorporateTaxServiceImpl implements UKCorporateTaxService {
    private _input: Input;
    private _rules: Rules;

    constructor(input: Input, rules: Rules) {
        this._input = input;
        this._rules = rules;
    }

    calculate(): Result {
        const income = this._input.taxableIncome;
        const { smallProfits, main, marginalRelief } = this._rules.regimes;

        let tax = 0;
        let breakdowns: Breakdown[] = [];

        if (income <= 0) {
            return { corporateTax: 0, effectiveTaxRate: 0, breakdowns: [] };
        }

        if (income <= marginalRelief.lowerLimit) {
            tax = income * smallProfits.rate;
            breakdowns = [{
                from: '0',
                to: `${marginalRelief.lowerLimit}`,
                rate: smallProfits.rate,
                amount: tax,
            }];
        } else if (income >= marginalRelief.upperLimit) {
            tax = income * main.rate;
            breakdowns = [{
                from: '0',
                to: 'Above',
                rate: main.rate,
                amount: tax,
            }];
        } else {
            tax = this.applyMarginalRelief(income, marginalRelief);
            breakdowns = this.buildMarginalReliefBreakdowns(income, tax, marginalRelief);
        }

        return {
            corporateTax: tax,
            effectiveTaxRate: income > 0 ? (tax / income) * 100 : 0,
            breakdowns,
        };
    }

    private applyMarginalRelief(income: number, rules: MarginalReliefRule): number {
        const grossTax = income * rules.mainRate;
        const relief = rules.standardFraction * (rules.upperLimit - income);
        return grossTax - relief;
    }

    private buildMarginalReliefBreakdowns(
        income: number,
        tax: number,
        rules: MarginalReliefRule,
    ): Breakdown[] {
        const grossTax = income * rules.mainRate;
        const relief = rules.standardFraction * (rules.upperLimit - income);

        return [
            {
                from: '0',
                to: 'Above',
                rate: rules.mainRate,
                amount: grossTax,
            },
            {
                from: `${rules.lowerLimit}`,
                to: `${rules.upperLimit}`,
                rate: -(rules.standardFraction),
                amount: -relief,
            },
        ];
    }
}
