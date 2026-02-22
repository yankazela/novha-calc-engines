import { RuleMeta } from "../../../shared/domain/types";
import { BracketAllocation, RuleInput, RuleOutput, TaxBracket } from "../../domain/types";

export interface IncomeTaxRules {
    taxBrackets: TaxBracket[];
    quotientFamilial: QuotientFamilial;
    socialContributions: Contributions;
}

export interface Contributions {
    employee: { rate: number; };
}

export interface QuotientFamilial {
    enabled: boolean;
}

export interface IncomeTaxCalculatorSchema {
    meta: RuleMeta;
    inputs: RuleInput[];
    outputs: RuleOutput[];
    rules: IncomeTaxRules;
}

export interface ComputedIncomeTaxValues {
    grossIncome: number;
	incomeTax: number;
	socialContributions: number;
	totalDeductions: number;
	netIncome: number;
	averageTaxRate: number;
	marginalTaxRate: number;
	taxBracketBreakdown: BracketAllocation[];
}