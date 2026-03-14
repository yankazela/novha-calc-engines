import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface IndiaMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
