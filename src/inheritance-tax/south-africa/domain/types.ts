import { Breakdown } from "../../domain/types";

export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface Rules {
    primaryAbatement: number;
    taxBrackets: TaxBracket[];
}

export interface Input {
    estateValue: number;
    deductions: number;
}

export interface Result {
    taxableEstate: number;
    inheritanceTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
