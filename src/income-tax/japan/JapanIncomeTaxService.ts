import { ComputedIncomeTaxValues } from "./domain/types";

export interface JapanIncomeTaxService {
    calculateNetIncome(): ComputedIncomeTaxValues;
}
