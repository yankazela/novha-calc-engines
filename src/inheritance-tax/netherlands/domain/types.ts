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

export type TaxClassName = 'Partner' | 'Child' | 'Other';

export interface Rules {
    taxClasses: {
        Partner: TaxClass;
        Child: TaxClass;
        Other: TaxClass;
    };
}

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
