import { BracketAllocation, TaxBracket } from "../../domain/types";

export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    standardDeduction: { amount: number };
    fica: FICAContributionRules;
}

export interface FICAContributionRules {
    socialSecurity: { rate: number; wageBase: number };
    medicare: { rate: number; additionalRate: number; additionalThreshold: number };
}

export interface ComputedIncomeTaxValues {
    grossIncome: number;
    incomeTax: number;
    socialSecurity: number;
    medicare: number;
    standardDeduction: number;
    totalDeductions: number;
    netIncome: number;
    effectiveTaxRate: number;
    taxBracketBreakdown: BracketAllocation[];
}
