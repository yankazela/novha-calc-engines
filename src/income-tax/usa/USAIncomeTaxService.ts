import { ComputedIncomeTaxValues } from "./domain/types";

export interface USAIncomeTaxService {
    calculateNetIncome(): ComputedIncomeTaxValues;
}
