import { OtherFees } from "../../domain/types";

export interface MortgageRules {
    loanConstraints: LoanConstraints;
    interest: InterestRules;
    landTransferTax: LandTransferTaxRules;
    notaryFeeRate: number;
    registrationFeeRate: number;
}

export interface LoanConstraints {
    maxLtvPercent: number;
    maxAmortizationYears: number;
}

export interface InterestRules {
    compounding: 'MONTHLY';
}

export interface LandTransferTaxRules {
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
}

export interface MortgageOutput {
    loanAmount: number;
    totalMortgage: number;
    monthlyPayment: number;
    totalInterestPaid: number;
    totalPaid: number;
    landTransferTax: number;
    notaryFees: number;
    registrationFees: number;
    amortizationSchedule: AmortizationScheduleItem[];
    otherFees: OtherFees;
}
