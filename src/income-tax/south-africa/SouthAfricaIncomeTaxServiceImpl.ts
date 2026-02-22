import { BracketAllocation } from "../domain/types";
import { ComputedIncomeTaxValues, IncomeTaxRules } from "./domain/types";
import { SouthAfricaIncomeTaxService } from "./SouthAfricaIncomeTaxService";

export class SouthAfricaIncomeTaxServiceImpl implements SouthAfricaIncomeTaxService {
    private _income: number;
    private _age: number;
    private _rules: IncomeTaxRules;
    private _medicalAidMembers: number = 0;

    constructor(income: number, age: number, rules: IncomeTaxRules, medicalAidMembers: number = 0) {
        this._income = income;
        this._age = age;
        this._rules = rules;
        this._medicalAidMembers = medicalAidMembers;
    }

    calculateNetIncome(): ComputedIncomeTaxValues {
        const grossIncome = this._income;

        const threshold = this.getTaxThreshold(this._age);

        if (this._income <= threshold) {
            return {
                grossIncome,
                incomeTax: 0,
                uif: 0,
                totalDeductions: 0,
                netIncome: grossIncome,
                effectiveTaxRate: 0,
                taxBracketBreakdown: [],
            };
        }

        const { grossTax, bracketBreakdown } = this.calculateBracketTaxWithBreakdown(this._income);

        const rebate = this.getRebate(this._age);
        const medicalAidCredit =
            this.calculateMedicalAidCredit(this._medicalAidMembers);
        const incomeTax = Math.max(0, grossTax - rebate - medicalAidCredit);

        const uif = this.calculateUif(this._income);

        const totalDeductions = incomeTax + uif;
        const netIncome = grossIncome - totalDeductions;
        const effectiveTaxRate = incomeTax / grossIncome;

        return {
            grossIncome,
            incomeTax: this.round(incomeTax),
            uif: this.round(uif),
            totalDeductions: this.round(totalDeductions),
            netIncome: this.round(netIncome),
            effectiveTaxRate: this.round(effectiveTaxRate, 4),
            taxBracketBreakdown: bracketBreakdown,
        };
    }

    private calculateBracketTaxWithBreakdown(income: number): { grossTax: number; bracketBreakdown: BracketAllocation[] } {
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
                    taxOnAmount: taxOnAmount,
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

    private calculateBracketTax(income: number): number {
        let tax = 0;

        for (const bracket of this._rules.taxBrackets) {
            if (income <= bracket.from) break;

            const upper = bracket.to ?? income;
            const taxableAmount = Math.min(upper, income) - bracket.from;

            if (taxableAmount > 0) {
                tax += taxableAmount * bracket.rate;
            }
        }

        return tax;
    }

    private getTaxThreshold(age: number): number {
        const thresholds = this._rules.taxThresholds;

        if (age >= 75) return thresholds.age75Plus;
        if (age >= 65) return thresholds.age65To74;

        return thresholds.under65;
    }

    private getRebate(age: number): number {
        let rebate = this._rules.rebates.primary.amount;

        if (age >= this._rules.rebates.secondary.ageMin) {
            rebate += this._rules.rebates.secondary.amount;
        }

        if (age >= this._rules.rebates.tertiary.ageMin) {
            rebate += this._rules.rebates.tertiary.amount;
        }

        return rebate;
    }

    private calculateUif(income: number): number {
        const cappedIncome = Math.min(
            income,
            this._rules.uif.annualIncomeCap,
        );

        return Math.min(
            cappedIncome * this._rules.uif.rate,
            this._rules.uif.maxAnnualContribution,
        );
    }

    private calculateMedicalAidCredit(members: number): number {
        if (members <= 0) return 0;

        const monthly = this._rules.medicalAidTaxCredit.monthly;

        let monthlyCredit = monthly.taxpayer;

        if (members >= 2) {
            monthlyCredit += monthly.firstDependant;
        }

        if (members > 2) {
            monthlyCredit +=
                (members - 2) * monthly.additionalDependant;
        }

        return (
            monthlyCredit *
            this._rules.medicalAidTaxCredit.annualMultiplier
        );
    }

    private round(value: number, decimals = 2): number {
        return Number(value.toFixed(decimals));
    }
}