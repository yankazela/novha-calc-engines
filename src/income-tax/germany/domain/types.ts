import { BracketAllocation, TaxBracket } from "../../domain/types";

export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    solidaritySurcharge: SolidaritySurchargeRules;
    socialContributions: SocialContributionRules;
}

export interface SolidaritySurchargeRules {
    rate: number;
    exemptionThreshold: number;
}

export interface SocialContributionRules {
    rate: number;
}

export interface ComputedIncomeTaxValues {
    grossIncome: number;
    incomeTax: number;
    solidaritySurcharge: number;
    socialContributions: number;
    totalDeductions: number;
    netIncome: number;
    effectiveTaxRate: number;
    taxBracketBreakdown: BracketAllocation[];
}
