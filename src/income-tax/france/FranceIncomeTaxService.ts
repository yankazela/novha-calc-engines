import { ComputedIncomeTaxValues } from "./domain/types";

export interface FranceIncomeTaxService {
    calculateNetIncome(income: number): ComputedIncomeTaxValues;
}