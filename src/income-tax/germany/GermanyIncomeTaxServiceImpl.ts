import { BracketAllocation } from "../domain/types";
import { GermanyIncomeTaxService } from "./GermanyIncomeTaxService";
import {
    ComputedIncomeTaxValues,
    IncomeTaxRules,
    SolidaritySurchargeRules,
    SocialContributionRules,
} from "./domain/types";

export class GermanyIncomeTaxServiceImpl implements GermanyIncomeTaxService {
    private _income: number;
    private _rules: IncomeTaxRules;

    constructor(income: number, rules: IncomeTaxRules) {
        this._income = income;
        this._rules = rules;
    }

    public calculateNetIncome(): ComputedIncomeTaxValues {
        const { grossTax, bracketBreakdown } = this.computeTaxBrackets(this._income);

        const solidaritySurcharge = this.computeSolidaritySurcharge(
            grossTax,
            this._rules.solidaritySurcharge,
        );

        const socialContributions = this.computeSocialContributions(
            this._income,
            this._rules.socialContributions,
        );

        const totalDeductions = grossTax + solidaritySurcharge + socialContributions;
        const netIncome = this._income - totalDeductions;

        return {
            grossIncome: this._income,
            incomeTax: this.round(grossTax),
            solidaritySurcharge: this.round(solidaritySurcharge),
            socialContributions: this.round(socialContributions),
            totalDeductions: this.round(totalDeductions),
            netIncome: this.round(netIncome),
            effectiveTaxRate: this._income > 0 ? this.round(grossTax / this._income, 4) : 0,
            taxBracketBreakdown: bracketBreakdown,
        };
    }

    private computeTaxBrackets(
        income: number,
    ): { grossTax: number; bracketBreakdown: BracketAllocation[] } {
        let tax = 0;
        const bracketBreakdown: BracketAllocation[] = [];

        for (let index = 0; index < this._rules.taxBrackets.length; index++) {
            const bracket = this._rules.taxBrackets[index];

            if (income <= bracket.from) {
                bracketBreakdown.push({
                    bracketIndex: index,
                    bracketName: `Bracket ${index + 1}`,
                    from: bracket.from,
                    to: bracket.to ?? null,
                    rate: bracket.rate,
                    amountInBracket: 0,
                    taxOnAmount: 0,
                });
                break;
            }

            const upper = bracket.to ?? income;
            const taxableAmount = Math.min(upper, income) - bracket.from;

            if (taxableAmount > 0) {
                const taxOnAmount = taxableAmount * bracket.rate;
                tax += taxOnAmount;
                bracketBreakdown.push({
                    bracketIndex: index,
                    bracketName: `Bracket ${index + 1}`,
                    from: bracket.from,
                    to: bracket.to ?? null,
                    rate: bracket.rate,
                    amountInBracket: taxableAmount,
                    taxOnAmount,
                });
            } else {
                bracketBreakdown.push({
                    bracketIndex: index,
                    bracketName: `Bracket ${index + 1}`,
                    from: bracket.from,
                    to: bracket.to ?? null,
                    rate: bracket.rate,
                    amountInBracket: 0,
                    taxOnAmount: 0,
                });
            }
        }

        return { grossTax: tax, bracketBreakdown };
    }

    private computeSolidaritySurcharge(
        incomeTax: number,
        rules: SolidaritySurchargeRules,
    ): number {
        if (incomeTax <= rules.exemptionThreshold) {
            return 0;
        }

        return incomeTax * rules.rate;
    }

    private computeSocialContributions(
        income: number,
        rules: SocialContributionRules,
    ): number {
        return income * rules.rate;
    }

    private round(value: number, decimals = 2): number {
        return Number(value.toFixed(decimals));
    }
}
