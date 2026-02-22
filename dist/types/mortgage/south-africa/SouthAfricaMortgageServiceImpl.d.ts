import { MortgageRules, MortgageInput, MortgageOutput } from './domain/types';
import { SouthAfricaMortgageService } from './SouthAfricaMortgageService';
export declare class SouthAfricaMortgageServiceImpl implements SouthAfricaMortgageService {
    private readonly input;
    private readonly rules;
    constructor(input: MortgageInput, rules: MortgageRules);
    calculate(): MortgageOutput;
    private calculateAmortizationSchedule;
    private calculateTransferDuty;
}
