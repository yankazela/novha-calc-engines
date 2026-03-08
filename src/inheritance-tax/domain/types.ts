export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface Breakdown {
    from: string;
    to: string;
    rate: number;
    amount: number;
}

export interface Result {
    taxableEstate: number;
    inheritanceTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
