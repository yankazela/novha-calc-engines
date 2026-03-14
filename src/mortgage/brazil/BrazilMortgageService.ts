import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface BrazilMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
