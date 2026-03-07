import { Breakdown } from "../../domain/types";

export interface Rules {
    applicable: false;
}

export interface Input {
    estateValue: number;
}

export interface Result {
    taxableEstate: number;
    inheritanceTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
