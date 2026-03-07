export interface Breakdown {
    from: string;
    to: string;
    rate: number;
    amount: number;
}
export interface Result {
    taxableGain: number;
    capitalGainTax: number;
    socialContributions: number;
    totalTax: number;
    netInvestmentIncomeTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
