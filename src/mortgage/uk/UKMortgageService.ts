import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface UKMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
