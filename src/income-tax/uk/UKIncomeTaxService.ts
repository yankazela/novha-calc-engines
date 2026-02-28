import { ComputedIncomeTaxValues } from "./domain/types";

export interface UKIncomeTaxService {
    calculateNetIncome(): ComputedIncomeTaxValues;
}
