import { OtherFees } from "../../domain/types";

export interface PurchaseTaxBracket {
    upTo?: number;
    above?: number;
    rate: number;
}

export interface MortgageRules {
    loanConstraints: { maxLtvPercent: number; maxAmortizationYears: number };
    interest: { compounding: 'MONTHLY' };
    purchaseTax: { brackets: PurchaseTaxBracket[] };
    landRegistrationFeeRate: number;
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
    purchaseTax: number;
    landRegistrationFee: number;
    amortizationSchedule: AmortizationScheduleItem[];
    otherFees: OtherFees;
}
