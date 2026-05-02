import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface NetherlandsMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
