import { ComputedIncomeTaxValues } from "./domain/types";

export interface GermanyIncomeTaxService {
    calculateNetIncome(): ComputedIncomeTaxValues;
}
