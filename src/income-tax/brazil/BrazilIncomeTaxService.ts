import { ComputedIncomeTaxValues } from "./domain/types";

export interface BrazilIncomeTaxService {
    calculateNetIncome(): ComputedIncomeTaxValues;
}
