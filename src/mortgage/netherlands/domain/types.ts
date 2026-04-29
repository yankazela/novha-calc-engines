import { OtherFees } from "../../domain/types";

export interface MortgageRules {
    loanConstraints: { maxLtvPercent: number; maxAmortizationYears: number };
    interest: { compounding: 'MONTHLY' };
    transferTax: { primaryResidenceRate: number; otherRate: number };
    notaryFeeRate: number;
    landRegistryFeeRate: number;
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
    isPrimaryResidence: boolean;
}

export interface MortgageOutput {
    loanAmount: number;
    totalMortgage: number;
    monthlyPayment: number;
    totalInterestPaid: number;
    totalPaid: number;
    transferTax: number;
    notaryFees: number;
    landRegistryFee: number;
    amortizationSchedule: AmortizationScheduleItem[];
    otherFees: OtherFees;
}
