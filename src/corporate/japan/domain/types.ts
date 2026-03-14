import { Breakdown } from "../../domain/types";

export interface Rules {
    regime: { type: 'flat'; rate: number };
}

export interface Input {
    taxableIncome: number;
}

export interface Result {
    corporateTax: number;
    effectiveTaxRate: number;
    breakdowns: Breakdown[];
}
