import { BracketAllocation, TaxBracket } from "../../domain/types";

export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    cess: { rate: number };
}

export interface ComputedIncomeTaxValues {
    grossIncome: number;
    incomeTax: number;
    cess: number;
    totalDeductions: number;
    netIncome: number;
    effectiveTaxRate: number;
    taxBracketBreakdown: BracketAllocation[];
}
