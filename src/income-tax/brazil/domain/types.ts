import { BracketAllocation, TaxBracket } from "../../domain/types";

export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    inss: INSSRules;
}

export interface INSSRules {
    rate: number;
    cap: number;
}

export interface ComputedIncomeTaxValues {
    grossIncome: number;
    incomeTax: number;
    inss: number;
    totalDeductions: number;
    netIncome: number;
    effectiveTaxRate: number;
    taxBracketBreakdown: BracketAllocation[];
}
