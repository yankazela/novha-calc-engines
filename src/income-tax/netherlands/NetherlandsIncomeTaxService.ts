import { ComputedIncomeTaxValues } from "./domain/types";

export interface NetherlandsIncomeTaxService {
    calculateNetIncome(): ComputedIncomeTaxValues;
}
