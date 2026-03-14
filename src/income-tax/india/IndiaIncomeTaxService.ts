import { ComputedIncomeTaxValues } from "./domain/types";

export interface IndiaIncomeTaxService {
    calculateNetIncome(): ComputedIncomeTaxValues;
}
