import { ComputedIncomeTaxValues, IncomeTaxRules } from "./domain/types";
export interface SouthAfricaIncomeTaxService {
    calculateNetIncome(income: number, rules: IncomeTaxRules): ComputedIncomeTaxValues;
}
