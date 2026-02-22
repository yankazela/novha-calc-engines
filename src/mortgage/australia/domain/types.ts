import { OtherFees } from "../../domain/types";

export interface MortgageRules {
    loanConstraints: LoanConstraints;
    lendersMortgageInsurance: LendersMortgageInsuranceRules;
    interest: InterestRules;
    stampDuty: StampDutyRules;
}

export interface LoanConstraints {
    maxLvr: number;
    maxAmortizationYears: number;
}

export interface LendersMortgageInsuranceRate {
    maxLvr: number;
    rate: number;
}

export interface LendersMortgageInsuranceRules {
    requiredAboveLvr: number;
    premiumRates: LendersMortgageInsuranceRate[];
    premiumAddedToLoan: boolean;
}

export interface InterestRules {
    compounding: 'MONTHLY';
}

export interface StampDutyBracket {
    upTo?: number;
    above?: number;
    rate: number;
}

export interface StampDutyRules {
    brackets: StampDutyBracket[];
}

export interface AmortizationScheduleItem {
    year: number;
    principal: number;
    interest: number;
    balance: number;
}

export interface MortgageInput {
    propertyPrice: number;
    downPayment: number;
    annualInterestRate: number;
    amortizationYears: number;
    paymentFrequency: 'MONTHLY' | 'FORTNIGHTLY' | 'WEEKLY';
}

export interface MortgageOutput {
    loanAmount: number;
    lmiPremium: number;
    totalMortgage: number;
    monthlyPayment: number;
    totalInterestPaid: number;
    totalPaid: number;
    stampDuty: number;
    amortizationSchedule: AmortizationScheduleItem[];
    otherFees: OtherFees;
}
