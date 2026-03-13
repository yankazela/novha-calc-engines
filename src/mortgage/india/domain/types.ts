import { OtherFees } from "../../domain/types";

export interface MortgageRules {
    loanConstraints: LoanConstraints;
    interest: InterestRules;
    stampDuty: StampDutyRules;
}

export interface LoanConstraints {
    maxLtvPercent: number;
    maxAmortizationYears: number;
}

export interface InterestRules {
    compounding: 'MONTHLY';
}

export interface StampDutyRules {
    rate: number;
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
    isFirstTimeBuyer: boolean;
}

export interface MortgageOutput {
    loanAmount: number;
    totalMortgage: number;
    monthlyPayment: number;
    totalInterestPaid: number;
    totalPaid: number;
    stampDuty: number;
    amortizationSchedule: AmortizationScheduleItem[];
    otherFees: OtherFees;
}
