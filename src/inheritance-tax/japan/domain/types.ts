import { Breakdown } from "../../domain/types";

export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface Rules {
    baseExemption: number;
    perHeirExemption: number;
    taxBrackets: TaxBracket[];
}

export interface Input {
    estateValue: number;
    numberOfStatutoryHeirs: number;
}

export interface Result {
    taxableEstate: number;
    inheritanceTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
