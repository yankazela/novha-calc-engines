import { Breakdown } from "../../domain/types";

export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface Rules {
    inclusionRate: number;
    taxBrackets: TaxBracket[];
}

export interface Input {
    estateValue: number;
    adjustedCostBase: number;
}

export interface Result {
    taxableEstate: number;
    inheritanceTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
