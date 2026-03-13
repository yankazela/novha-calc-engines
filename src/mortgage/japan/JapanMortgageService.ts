import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface JapanMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
