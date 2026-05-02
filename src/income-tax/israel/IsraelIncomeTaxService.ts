import { ComputedIncomeTaxValues } from "./domain/types";

export interface IsraelIncomeTaxService {
    calculateNetIncome(): ComputedIncomeTaxValues;
}
