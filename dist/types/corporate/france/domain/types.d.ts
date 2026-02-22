import { Breakdown } from "../../domain/types";
export interface RegimeCondition {
    maxTurnover: number;
}
export interface RegimeItem {
    type: 'flat' | 'progressive';
    rate?: number;
    maxIncome?: number;
    brackets?: ProgressiveTaxBracket[];
}
export interface Regime {
    general: RegimeItem[];
    smallBusiness: RegimeItem[];
}
export interface Input {
    taxableIncome: number;
    annualTurnover: number;
    isSmallBusiness: boolean;
}
export interface Output {
    name: string;
    type: 'number' | 'string';
    unit?: string;
}
export interface FlatTaxRule {
    type: 'flat';
    rate: number;
    conditions?: RegimeCondition;
}
export interface ProgressiveTaxBracket {
    from: number;
    to: number | null;
    rate: number;
}
export interface ProgressiveTaxRule {
    type: 'progressive';
    brackets: ProgressiveTaxBracket[];
    eligibility?: Record<string, any>;
    conditions?: RegimeCondition;
}
export type TaxRule = FlatTaxRule | ProgressiveTaxRule;
export interface Rules {
    regimes: Record<string, TaxRule>;
}
export interface Result {
    corporateTax: number;
    effectiveTaxRate: number;
    breakdowns: Breakdown[];
}
