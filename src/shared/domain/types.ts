export enum CalculatorType {
    INCOME_TAX = 'INCOME_TAX',
    MORTGAGE = 'MORTGAGE',
    LOAN = 'LOAN',
    CORPORATE_TAX = 'CORPORATE_TAX',
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