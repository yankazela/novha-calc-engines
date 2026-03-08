import { Breakdown } from "../../domain/types";

export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface TaxClass {
    exemption: number;
    brackets: TaxBracket[];
}

export interface Rules {
    taxClasses: {
        I: TaxClass;
        II: TaxClass;
        III: TaxClass;
    };
}

export type TaxClassName = 'I' | 'II' | 'III';

export interface Input {
    estateValue: number;
    taxClass: TaxClassName;
}

export interface Result {
    taxableEstate: number;
    inheritanceTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
