import { BracketAllocation, TaxBracket } from "../../domain/types";

export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    inhabitantTax: { rate: number };
}

export interface ComputedIncomeTaxValues {
    grossIncome: number;
    nationalIncomeTax: number;
    inhabitantTax: number;
    totalDeductions: number;
    netIncome: number;
    effectiveTaxRate: number;
    taxBracketBreakdown: BracketAllocation[];
}
