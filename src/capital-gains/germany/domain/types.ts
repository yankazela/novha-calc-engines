import { Breakdown } from "../../domain/types";

export interface Rules {
    flatTaxRate: number;
    solidaritySurchargeRate: number;
    annualExemption: number;
}

export interface Input {
    capitalGain: number;
}

export interface Result {
    taxableGain: number;
    capitalGainsTax: number;
    solidaritySurcharge: number;
    totalTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
