import { Breakdown } from "../../domain/types";

export interface Rules {
    nilRateBand: number;
    standardRate: number;
    charityRate: number;
    charityThreshold: number;
}

export interface Input {
    estateValue: number;
    charitableGivingPercent: number;
}

export interface Result {
    taxableEstate: number;
    inheritanceTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
