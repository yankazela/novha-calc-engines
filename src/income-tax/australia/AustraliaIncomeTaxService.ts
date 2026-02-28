import { ComputedIncomeTaxValues, IncomeTaxRules } from "./domain/types";

export interface AustraliaIncomeTaxService {
    calculateNetIncome(
        income: number,
        rules: IncomeTaxRules,
        isResident: boolean,
        includeMedicareLevy: boolean,
    ): ComputedIncomeTaxValues;
}
