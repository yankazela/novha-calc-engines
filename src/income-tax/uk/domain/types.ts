import { BracketAllocation, TaxBracket } from "../../domain/types";

export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    personalAllowance: PersonalAllowanceRules;
    nationalInsurance: NationalInsuranceRules;
}

export interface PersonalAllowanceRules {
    amount: number;
    taperThreshold: number;
    taperRate: number;
}

export interface NationalInsuranceRules {
    primaryThreshold: number;
    upperEarningsLimit: number;
    mainRate: number;
    upperRate: number;
}

export interface ComputedIncomeTaxValues {
    grossIncome: number;
    incomeTax: number;
    nationalInsurance: number;
    personalAllowance: number;
    totalDeductions: number;
    netIncome: number;
    effectiveTaxRate: number;
    taxBracketBreakdown: BracketAllocation[];
}
