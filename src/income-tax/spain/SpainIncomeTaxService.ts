import { ComputedIncomeTaxValues } from "./domain/types";

export interface SpainIncomeTaxService {
    calculateNetIncome(): ComputedIncomeTaxValues;
}
