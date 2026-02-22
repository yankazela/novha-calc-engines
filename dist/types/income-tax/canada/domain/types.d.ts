import { BracketAllocation, TaxBracket } from "../../domain/types";
export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    credits?: Record<string, TaxCredit>;
    contributions?: Contributions;
}
export interface TaxCredit {
    amount: number;
    type: 'nonRefundable' | 'refundable';
    rate: number;
}
export interface Contributions {
    cpp?: CPPContribution;
    ei?: EIContribution;
}
export interface CPPContribution {
    rate: number;
    maxContribution: number;
    exemption: number;
}
export interface EIContribution {
    rate: number;
    maxInsurableEarnings: number;
    maxContribution: number;
}
export interface ComputedIncomeTaxValues {
    grossIncome: number;
    incomeTax: number;
    cpp: number;
    ei: number;
    totalDeductions: number;
    netIncome: number;
    effectiveTaxRate: number;
    taxBracketBreakdown: BracketAllocation[];
}
