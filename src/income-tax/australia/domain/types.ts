import { BracketAllocation, TaxBracket } from "../../domain/types";

export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    medicareLevy: MedicareLevyRules;
    lowIncomeTaxOffset: LowIncomeTaxOffset;
    lowAndMiddleIncomeTaxOffset?: LowAndMiddleIncomeTaxOffset;
}

export interface MedicareLevyRules {
    rate: number;
    shadingInThreshold: number;
    fullLevyThreshold: number;
    reductionRate: number;
}

export interface LowIncomeTaxOffset {
    maxOffset: number;
    phaseOutStart: number;
    phaseOutEnd: number;
    phaseOutRate: number;
}

export interface LowAndMiddleIncomeTaxOffset {
    maxOffset: number;
    phaseOutStart: number;
    phaseOutEnd: number;
    phaseOutRate: number;
}

export interface ComputedIncomeTaxValues {
    grossIncome: number;
    incomeTax: number;
    medicareLevy: number;
    lowIncomeTaxOffset: number;
    totalDeductions: number;
    netIncome: number;
    effectiveTaxRate: number;
    taxBracketBreakdown: BracketAllocation[];
}
