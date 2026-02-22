import { Rules, Input, Result } from './domain/types';
import { SouthAfricaCorporateTaxService } from './SouthAfricaCorporateTaxService';
export declare class SouthAfricaCorporateTaxServiceImpl implements SouthAfricaCorporateTaxService {
    private _input;
    private _rules;
    constructor(input: Input, rules: Rules);
    calculate(): Result;
    private calculateProgressiveTax;
}
