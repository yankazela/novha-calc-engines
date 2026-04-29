import { ComputedIncomeTaxValues } from "./domain/types";

export interface SwitzerlandIncomeTaxService {
    calculateNetIncome(): ComputedIncomeTaxValues;
}
