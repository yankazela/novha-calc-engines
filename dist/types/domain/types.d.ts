export declare enum CalculatorType {
    INCOME_TAX = "INCOME_TAX",
    MORTGAGE = "MORTGAGE",
    LOAN = "LOAN"
}
export interface RuleMeta {
    id: string;
    country: string;
    region: string;
    calculator: CalculatorType;
    version: string;
    effectivefrom: string;
    effectiveto: string | null;
    source?: RuleSource[];
}
export interface RuleSource {
    name: string;
    url: string;
}
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
