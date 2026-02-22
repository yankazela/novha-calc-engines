import { Breakdown } from "../../domain/types";

export interface FlatTaxRule {
    type: 'flat';
    rate: number;
    conditions?: {
        maxTurnover?: number;
    };
}

export interface ProgressiveTaxBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface ProgressiveTaxRule {
    type: 'progressive';
    brackets: ProgressiveTaxBracket[];
    conditions?: {
        maxTurnover?: number;
    };
}

export type TaxRule = FlatTaxRule | ProgressiveTaxRule;

export interface Rules {
    regimes: Record<string, TaxRule>;
}

export interface Input {
    taxableIncome: number;
    annualTurnover: number;
    isSmallBusiness: boolean;
}

export interface Result {
    corporateTax: number;
    effectiveTaxRate: number;
    breakdowns: Breakdown[];
}
