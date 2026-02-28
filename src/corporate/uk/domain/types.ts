import { Breakdown } from "../../domain/types";

export interface FlatTaxRule {
    type: 'flat';
    rate: number;
    conditions?: {
        maxIncome?: number;
    };
}

export interface MarginalReliefRule {
    type: 'marginal_relief';
    mainRate: number;
    smallProfitsRate: number;
    upperLimit: number;
    lowerLimit: number;
    standardFraction: number;
}

export type TaxRule = FlatTaxRule | MarginalReliefRule;

export interface Rules {
    regimes: {
        smallProfits: FlatTaxRule;
        main: FlatTaxRule;
        marginalRelief: MarginalReliefRule;
    };
}

export interface Input {
    taxableIncome: number;
}

export interface Result {
    corporateTax: number;
    effectiveTaxRate: number;
    breakdowns: Breakdown[];
}
