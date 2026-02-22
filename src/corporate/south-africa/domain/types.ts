import { Breakdown } from "../../domain/types";

export interface Input {
	taxableIncome: number;
    regime: 'LARGE' | 'SBC';
}

export interface Output {
	name: string;
	type: 'number' | 'string';
	unit?: string;
}

export interface FlatTaxRule {
	type: 'flat';
	rate: number;
}

export interface ProgressiveTaxBracket {
	from: number;
	to: number | null;
	rate: number;
}

export interface ProgressiveTaxRule {
	type: 'progressive';
	brackets: ProgressiveTaxBracket[];
	eligibility?: Record<string, any>;
}

export type TaxRule = FlatTaxRule | ProgressiveTaxRule;

export interface Rules {
  	regimes: Record<string, TaxRule>;
}

export interface Result {
	corporateTax: number;
	effectiveTaxRate: number;
	breakdowns: Breakdown[];
}

