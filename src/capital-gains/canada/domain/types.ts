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
