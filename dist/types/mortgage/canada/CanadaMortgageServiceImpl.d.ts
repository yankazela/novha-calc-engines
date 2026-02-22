import { CanadaMortgageService } from './CanadaMortgageService';
import { MortgageRules, MortgageCalculationInput, MortgageCalculationResult } from './domain/types';
export declare class CanadaMortgageServiceImpl implements CanadaMortgageService {
    calculate(input: MortgageCalculationInput, rules: MortgageRules): MortgageCalculationResult;
    private calculateAmortizationSchedule;
    private convertCanadianRate;
    private calculatePayment;
}
