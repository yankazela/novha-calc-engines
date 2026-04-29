import { BracketAllocation, TaxBracket } from "../../domain/types";

export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    socialContributions: { rate: number };
}

export interface ComputedIncomeTaxValues {
    grossIncome: number;
    incomeTax: number;
    socialContributions: number;
    totalDeductions: number;
    netIncome: number;
    effectiveTaxRate: number;
    taxBracketBreakdown: BracketAllocation[];
}
