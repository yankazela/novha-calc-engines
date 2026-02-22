import { Rules, Input, Result } from './domain/types';
import { CanadaCorporateTaxService } from './CanadaCorporateTaxService';
export declare class CanadaCorporateTaxServiceImpl implements CanadaCorporateTaxService {
    private _input;
    private _rules;
    constructor(input: Input, rules: Rules);
    calculate(): Result;
    private applyRules;
}
