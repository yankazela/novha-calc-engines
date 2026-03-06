import { Breakdown } from "../../domain/types";

export interface LongTermBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface Rules {
    longTermBrackets: LongTermBracket[];
    shortTermBrackets: LongTermBracket[];
    netInvestmentIncomeTax: { rate: number; threshold: number };
}

export interface Input {
    capitalGain: number;
    totalTaxableIncome: number;
    holdingPeriodMonths: number;
}

export interface Result {
    capitalGainsTax: number;
    netInvestmentIncomeTax: number;
    totalTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
