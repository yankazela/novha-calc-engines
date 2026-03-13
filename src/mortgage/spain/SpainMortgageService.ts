import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface SpainMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
