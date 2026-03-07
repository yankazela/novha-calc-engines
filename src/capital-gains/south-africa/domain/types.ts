export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface Rules {
    inclusionRate: number;
    annualExclusion: number;
    taxBrackets: TaxBracket[];
}

export interface Input {
    capitalGain: number;
    totalTaxableIncome: number;
}
