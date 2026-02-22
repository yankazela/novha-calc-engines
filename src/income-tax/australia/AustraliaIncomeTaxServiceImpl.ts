import { BracketAllocation } from "../domain/types";
import { AustraliaIncomeTaxService } from "./AustraliaIncomeTaxService";
import {
    ComputedIncomeTaxValues,
    IncomeTaxRules,
    LowIncomeTaxOffset,
    MedicareLevyRules,
} from "./domain/types";

export class AustraliaIncomeTaxServiceImpl implements AustraliaIncomeTaxService {
    private _income: number;
    private _rules: IncomeTaxRules;

    constructor(income: number, rules: IncomeTaxRules) {
        this._income = income;
        this._rules = rules;
    }

    public calculateNetIncome(): ComputedIncomeTaxValues {
        const { grossTax, bracketBreakdown } = this.computeTaxBracketBreakdown(
            this._income,
            this._rules,
        );

        const lito = this.computeLowIncomeTaxOffset(
            this._income,
            this._rules.lowIncomeTaxOffset,
        );

        const incomeTax = Math.max(0, grossTax - lito);
        const medicareLevy = this.computeMedicareLevy(
            this._income,
            this._rules.medicareLevy,
        );

        const totalDeductions = incomeTax + medicareLevy;
        const netIncome = this._income - totalDeductions;

        return {
            grossIncome: this._income,
            incomeTax: this.round(incomeTax),
            medicareLevy: this.round(medicareLevy),
            lowIncomeTaxOffset: this.round(lito),
            totalDeductions: this.round(totalDeductions),
            netIncome: this.round(netIncome),
            effectiveTaxRate: this._income > 0 ? this.round(incomeTax / this._income, 4) : 0,
            taxBracketBreakdown: bracketBreakdown,
        };
    }

    private computeTaxBracketBreakdown(
        income: number,
        rules: IncomeTaxRules,
    ): { grossTax: number; bracketBreakdown: BracketAllocation[] } {
        let tax = 0;
        const bracketBreakdown: BracketAllocation[] = [];

        for (let index = 0; index < rules.taxBrackets.length; index++) {
            const bracket = rules.taxBrackets[index];

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

    private computeLowIncomeTaxOffset(income: number, lito: LowIncomeTaxOffset): number {
        if (income <= lito.phaseOutStart) {
            return lito.maxOffset;
        }

        if (income >= lito.phaseOutEnd) {
            return 0;
        }

        const reduction = (income - lito.phaseOutStart) * lito.phaseOutRate;
        return Math.max(0, lito.maxOffset - reduction);
    }

    private computeMedicareLevy(income: number, medicare: MedicareLevyRules): number {
        if (income <= medicare.shadingInThreshold) {
            return 0;
        }

        if (income <= medicare.fullLevyThreshold) {
            return (income - medicare.shadingInThreshold) * medicare.reductionRate;
        }

        return income * medicare.rate;
    }

    private round(value: number, decimals = 2): number {
        return Number(value.toFixed(decimals));
    }
}
