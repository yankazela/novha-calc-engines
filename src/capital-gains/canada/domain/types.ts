import { Breakdown } from "../../domain/types";

export interface Rules {
    inclusionRate: number;
    taxBrackets: TaxBracket[];
}

export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
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
