import { BracketAllocation } from "../domain/types";
import { USAIncomeTaxService } from "./USAIncomeTaxService";
import { ComputedIncomeTaxValues, FICAContributionRules, IncomeTaxRules } from "./domain/types";

export class USAIncomeTaxServiceImpl implements USAIncomeTaxService {
    private _income: number;
    private _rules: IncomeTaxRules;

    constructor(income: number, rules: IncomeTaxRules) {
        this._income = income;
        this._rules = rules;
    }

    public calculateNetIncome(): ComputedIncomeTaxValues {
        const standardDeduction = this._rules.standardDeduction.amount;
        const taxableIncome = Math.max(0, this._income - standardDeduction);

        const { grossTax, bracketBreakdown } = this.computeTaxBrackets(taxableIncome);

        const { socialSecurity, medicare } = this.computeFICA(
            this._income,
            this._rules.fica,
        );

        const totalDeductions = grossTax + socialSecurity + medicare;
        const netIncome = this._income - totalDeductions;

        return {
            grossIncome: this._income,
            incomeTax: this.round(grossTax),
            socialSecurity: this.round(socialSecurity),
            medicare: this.round(medicare),
            standardDeduction,
            totalDeductions: this.round(totalDeductions),
            netIncome: this.round(netIncome),
            effectiveTaxRate: this._income > 0 ? this.round(grossTax / this._income, 4) : 0,
            taxBracketBreakdown: bracketBreakdown,
        };
    }

    private computeTaxBrackets(
        taxableIncome: number,
    ): { grossTax: number; bracketBreakdown: BracketAllocation[] } {
        let tax = 0;
        const bracketBreakdown: BracketAllocation[] = [];

        for (let index = 0; index < this._rules.taxBrackets.length; index++) {
            const bracket = this._rules.taxBrackets[index];

            if (taxableIncome <= bracket.from) {
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

            const upper = bracket.to ?? taxableIncome;
            const taxableAmount = Math.min(upper, taxableIncome) - bracket.from;

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

    private computeFICA(
        income: number,
        rules: FICAContributionRules,
    ): { socialSecurity: number; medicare: number } {
        const socialSecurity =
            Math.min(income, rules.socialSecurity.wageBase) * rules.socialSecurity.rate;

        const regularMedicare = income * rules.medicare.rate;
        const additionalMedicare =
            income > rules.medicare.additionalThreshold
                ? (income - rules.medicare.additionalThreshold) * rules.medicare.additionalRate
                : 0;

        return { socialSecurity, medicare: regularMedicare + additionalMedicare };
    }

    private round(value: number, decimals = 2): number {
        return Number(value.toFixed(decimals));
    }
}
