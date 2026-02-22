import { CanadaIncomeTaxService } from "./CanadaIncomeTaxService";
import { ComputedIncomeTaxValues, IncomeTaxRules } from "./domain/types";
export declare class CanadaIncomeTaxServiceImpl implements CanadaIncomeTaxService {
    private _income;
    private _rules;
    constructor(income: number, rules: IncomeTaxRules);
    calculateNetIncome(): ComputedIncomeTaxValues;
    private computeTaxBracketBreakdown;
    private computeGrossTax;
    private applyCredits;
    private computeCPP;
    private computeEI;
}
