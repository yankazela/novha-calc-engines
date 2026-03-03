import { Breakdown } from "../../domain/types";

export interface Rules {
    corporateIncomeTax: { rate: number };
    solidaritySurcharge: { rate: number };
    tradeTax: { multiplier: number; assessmentRate: number };
}

export interface Input {
    taxableIncome: number;
}

export interface Result {
    corporateTax: number;
    solidaritySurcharge: number;
    tradeTax: number;
    totalTax: number;
    effectiveTaxRate: number;
    breakdowns: Breakdown[];
}
