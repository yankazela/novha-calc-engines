import { FranceMortgageService } from '../..';
import { MortgageRules, MortgageInput, MortgageOutput } from './domain/types';
export declare class FranceMortgageServiceImpl implements FranceMortgageService {
    private _input;
    private _rules;
    constructor(input: MortgageInput, rules: MortgageRules);
    calculate(): MortgageOutput;
    private calculateMonthlyPayment;
    private calculateAmortizationSchedule;
    private calculateLoanAmount;
    private ineligibleResult;
}
