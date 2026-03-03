import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface GermanyMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
