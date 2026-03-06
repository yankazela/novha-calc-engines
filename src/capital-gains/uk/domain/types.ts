import { Breakdown } from "../../domain/types";

export interface Rules {
    annualExemption: number;
    basicRate: number;
    higherRate: number;
    basicRateLimit: number;
}

export interface Input {
    capitalGain: number;
    totalTaxableIncome: number;
}

export interface Result {
    taxableGain: number;
    capitalGainsTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
