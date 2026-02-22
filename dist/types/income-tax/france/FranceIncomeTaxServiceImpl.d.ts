import { ComputedIncomeTaxValues, IncomeTaxRules } from "./domain/types";
import { FranceIncomeTaxService } from "./FranceIncomeTaxService";
export declare class FranceIncomeTaxServiceImpl implements FranceIncomeTaxService {
    private _income;
    private _rules;
    private _familyParts;
    constructor(income: number, rules: IncomeTaxRules, familyParts: number);
    calculateNetIncome(): ComputedIncomeTaxValues;
    private calculateProgressiveTax;
    private round;
}
