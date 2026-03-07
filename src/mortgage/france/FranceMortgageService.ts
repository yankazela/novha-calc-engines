import { MortgageRules, MortgageInput, MortgageOutput } from './domain/types';

export interface FranceMortgageService {
    calculate(
        input: MortgageInput,
        rules: MortgageRules
    ): MortgageOutput;
}