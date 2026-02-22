import { ComputedIncomeTaxValues, IncomeTaxRules } from "./domain/types";

export interface CanadaIncomeTaxService {
    calculateNetIncome(
        income: number,
        rules: IncomeTaxRules,
    ): ComputedIncomeTaxValues;
}