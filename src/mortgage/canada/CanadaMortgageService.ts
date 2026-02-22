import { MortgageCalculationInput, MortgageCalculationResult, MortgageRules } from "./domain/types";

export interface CanadaMortgageService {
    calculate(
        input: MortgageCalculationInput,
        rules: MortgageRules
    ): MortgageCalculationResult;
} 