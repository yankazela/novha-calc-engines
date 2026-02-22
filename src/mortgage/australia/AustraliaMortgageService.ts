import { MortgageInput, MortgageOutput, MortgageRules } from "./domain/types";

export interface AustraliaMortgageService {
    calculate(input: MortgageInput, rules: MortgageRules): MortgageOutput;
}
