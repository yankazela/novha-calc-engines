import { Breakdown } from "../../domain/types";

export interface TaxTier {
    from: number;
    to: number | null;
    rate: number;
}

export interface Rules {
    tiers: TaxTier[];
}

export interface Input {
    taxableIncome: number;
}

export interface Result {
    corporateTax: number;
    effectiveTaxRate: number;
    breakdowns: Breakdown[];
}
