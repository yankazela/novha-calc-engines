import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface SwitzerlandMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
