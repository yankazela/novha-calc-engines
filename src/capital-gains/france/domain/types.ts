import { Breakdown } from "../../domain/types";

export interface Rules {
    flatTaxRate: number;
    socialContributionsRate: number;
}

export interface Input {
    capitalGain: number;
}

export interface Result {
    incomeTax: number;
    socialContributions: number;
    totalTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
