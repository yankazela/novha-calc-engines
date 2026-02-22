import { Rules, Input, Result } from './domain/types';
import { FranceCorporateTaxService } from './FranceCorporateTaxService';
export declare class FranceCorporateTaxServiceImpl implements FranceCorporateTaxService {
    private _input;
    private _rules;
    constructor(input: Input, rules: Rules);
    calculate(): Result;
    private applyRules;
}
