export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface Rules {
    cgtDiscount: number;
    cgtDiscountMinMonths: number;
    taxBrackets: TaxBracket[];
}

export interface Input {
    capitalGain: number;
    totalTaxableIncome: number;
    holdingPeriodMonths: number;
}
