import { ComputedIncomeTaxValues, IncomeTaxRules } from "./domain/types";
import { SouthAfricaIncomeTaxService } from "./SouthAfricaIncomeTaxService";
export declare class SouthAfricaIncomeTaxServiceImpl implements SouthAfricaIncomeTaxService {
    private _income;
    private _age;
    private _rules;
    private _medicalAidMembers;
    constructor(income: number, age: number, rules: IncomeTaxRules, medicalAidMembers?: number);
    calculateNetIncome(): ComputedIncomeTaxValues;
    private calculateBracketTaxWithBreakdown;
    private calculateBracketTax;
    private getTaxThreshold;
    private getRebate;
    private calculateUif;
    private calculateMedicalAidCredit;
    private round;
}
