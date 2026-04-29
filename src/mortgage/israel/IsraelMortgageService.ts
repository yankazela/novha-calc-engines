import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface IsraelMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
