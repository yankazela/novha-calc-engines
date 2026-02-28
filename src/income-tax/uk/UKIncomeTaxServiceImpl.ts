import { BracketAllocation } from "../domain/types";
import { UKIncomeTaxService } from "./UKIncomeTaxService";
import {
    ComputedIncomeTaxValues,
    IncomeTaxRules,
    NationalInsuranceRules,
    PersonalAllowanceRules,
} from "./domain/types";

export class UKIncomeTaxServiceImpl implements UKIncomeTaxService {
    private _income: number;
    private _rules: IncomeTaxRules;

    constructor(income: number, rules: IncomeTaxRules) {
        this._income = income;
        this._rules = rules;
    }

    public calculateNetIncome(): ComputedIncomeTaxValues {
        const effectivePA = this.computePersonalAllowance(
            this._income,
            this._rules.personalAllowance,
        );
        const taxableIncome = Math.max(0, this._income - effectivePA);

        const { grossTax, bracketBreakdown } = this.computeTaxBrackets(taxableIncome);

        const ni = this.computeNationalInsurance(
            this._income,
            this._rules.nationalInsurance,
        );

        const totalDeductions = grossTax + ni;
        const netIncome = this._income - totalDeductions;

        return {
            grossIncome: this._income,
            incomeTax: this.round(grossTax),
            nationalInsurance: this.round(ni),
            personalAllowance: effectivePA,
            totalDeductions: this.round(totalDeductions),
            netIncome: this.round(netIncome),
            effectiveTaxRate: this._income > 0 ? this.round(grossTax / this._income, 4) : 0,
            taxBracketBreakdown: bracketBreakdown,
        };
    }

    private computePersonalAllowance(
        income: number,
        rules: PersonalAllowanceRules,
    ): number {
        if (income <= rules.taperThreshold) {
            return rules.amount;
        }

        const reduction = Math.floor((income - rules.taperThreshold) * rules.taperRate);
        return Math.max(0, rules.amount - reduction);
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

    private computeNationalInsurance(
        income: number,
        rules: NationalInsuranceRules,
    ): number {
        if (income <= rules.primaryThreshold) {
            return 0;
        }

        if (income <= rules.upperEarningsLimit) {
            return (income - rules.primaryThreshold) * rules.mainRate;
        }

        const mainBand = (rules.upperEarningsLimit - rules.primaryThreshold) * rules.mainRate;
        const upperBand = (income - rules.upperEarningsLimit) * rules.upperRate;
        return mainBand + upperBand;
    }

    private round(value: number, decimals = 2): number {
        return Number(value.toFixed(decimals));
    }
}
