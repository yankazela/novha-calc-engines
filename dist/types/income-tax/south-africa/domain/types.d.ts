import { AgeBasedRebate, BracketAllocation, TaxBracket } from "../../domain/types";
export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    rebates: TaxRebates;
    taxThresholds: TaxThresholds;
    medicalAidTaxCredit: MedicalAidTaxCredit;
    uif: UifRules;
}
export interface TaxRebates {
    primary: AgeBasedRebate;
    secondary: AgeBasedRebate;
    tertiary: AgeBasedRebate;
}
export interface TaxThresholds {
    under65: number;
    age65To74: number;
    age75Plus: number;
}
export interface MedicalAidTaxCredit {
    monthly: MedicalAidMonthlyCredit;
    annualMultiplier: number;
}
export interface MedicalAidMonthlyCredit {
    taxpayer: number;
    firstDependant: number;
    additionalDependant: number;
}
export interface UifRules {
    rate: number;
    annualIncomeCap: number;
    maxAnnualContribution: number;
}
export interface ComputedIncomeTaxValues {
    grossIncome: number;
    incomeTax: number;
    uif: number;
    totalDeductions: number;
    netIncome: number;
    effectiveTaxRate: number;
    taxBracketBreakdown: BracketAllocation[];
}
