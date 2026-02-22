import { MortgageRules, MortgageInput, MortgageOutput } from './domain/types';

export interface SouthAfricaMortgageService {
    calculate(
        input: MortgageInput,
        rules: MortgageRules
    ): MortgageOutput;
}