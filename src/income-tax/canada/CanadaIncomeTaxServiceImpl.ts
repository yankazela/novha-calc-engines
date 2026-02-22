import { BracketAllocation, TaxBracket } from "../domain/types";
import { CanadaIncomeTaxService } from "./CanadaIncomeTaxService";
import {
    CPPContribution,
    ComputedIncomeTaxValues,
    EIContribution,
    IncomeTaxRules,
    TaxCredit
} from "./domain/types";


export class CanadaIncomeTaxServiceImpl implements CanadaIncomeTaxService {
    private _income: number;
    private _rules: IncomeTaxRules;

    constructor(income: number, rules: IncomeTaxRules) {
        this._income = income;
        this._rules = rules;
    }

    public calculateNetIncome(): ComputedIncomeTaxValues {

        const bracketBreakdown = this.computeTaxBracketBreakdown(this._income, this._rules.taxBrackets);
        const grossTax = bracketBreakdown.reduce((total, b) => total + b.taxOnAmount, 0);
        const netTax = this.applyCredits(grossTax, this._rules.credits);
        const cpp = this.computeCPP(this._income, this._rules.contributions?.cpp);
        const ei = this.computeEI(this._income, this._rules.contributions?.ei);

        return {
            grossIncome: this._income,
            incomeTax: netTax,
            cpp,
            ei,
            totalDeductions: netTax + cpp + ei,
            netIncome: this._income - netTax - cpp - ei,
            effectiveTaxRate: netTax / this._income,
            taxBracketBreakdown: bracketBreakdown,
        };
    }

    private computeTaxBracketBreakdown(income: number, brackets: TaxBracket[]): BracketAllocation[] {
        return brackets.map((b, index) => {
            if (income <= b.from) {
                return {
                    bracketIndex: index,
                    bracketName: `Bracket ${index + 1}`,
                    from: b.from,
                    to: b.to ?? null,
                    rate: b.rate,
                    amountInBracket: 0,
                    taxOnAmount: 0,
                };
            }
    
            const upper = b.to ?? income;
            const taxable = Math.min(income, upper) - b.from;
            const taxOnAmount = taxable * b.rate;
    
            return {
                bracketIndex: index,
                bracketName: `Bracket ${index + 1}`,
                from: b.from,
                to: b.to ?? null,
                rate: b.rate,
                amountInBracket: taxable,
                taxOnAmount: taxOnAmount,
            };
        });
    }

    private computeGrossTax(income: number, brackets: TaxBracket[]): number {
        return brackets.reduce((total, b) => {
            if (income <= b.from) return total;
    
            const upper = b.to ?? income;
            const taxable = Math.min(income, upper) - b.from;
    
            return total + taxable * b.rate;
        }, 0);
    }

    private applyCredits(tax: number, credits: Record<string, TaxCredit> = {}): number {
        const totalCredits = Object.values(credits).reduce(
            (sum, c) => sum + c.amount * c.rate,
            0,
        );
    
        return Math.max(0, tax - totalCredits);
    }

    private computeCPP(income: number, cpp?: CPPContribution): number {
        if (!cpp || income <= cpp.exemption) return 0;
    
        const contributable = income - cpp.exemption;
        return Math.min(
            contributable * cpp.rate,
            cpp.maxContribution,
        );
    }

    private computeEI(income: number, ei?: EIContribution): number {
        if (!ei) return 0;
    
        const insurableIncome = Math.min(
            income,
            ei.maxInsurableEarnings,
        );
    
        return Math.min(
            insurableIncome * ei.rate,
            ei.maxContribution,
        );
    }
}