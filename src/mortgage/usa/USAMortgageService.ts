import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface USAMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
