import { RuleMeta } from "../../shared/domain/types";

export interface RuleInput {
    name: string;
    type: 'number' | 'select' | 'text';
    required: boolean;
    unit?: string;
}

export interface RuleOutput {
    name: string;
    type: 'number' | 'string';
    unit?: string;
}

export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface IncomeTaxCalculatorSchema<T> {
    meta: RuleMeta;
    inputs: RuleInput[];
    outputs: RuleOutput[];
    rules: T;
}

export interface AgeBasedRebate {
    ageMin: number;
    amount: number;
}

export interface BracketAllocation {
    bracketIndex: number;
    bracketName: string;
    from: number;
    to: number | null;
    rate: number;
    amountInBracket: number;
    taxOnAmount: number;
}