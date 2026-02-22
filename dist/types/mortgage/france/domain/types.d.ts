import { OtherFees } from "../../domain/types";
export interface MortgageRules {
    maxDebtRatio: number;
    maxLoanDurationYears: number;
    maxLoanDurationNewBuildYears: number;
    minDownPaymentRate: number;
    firstTimeBuyer?: FirstTimeBuyerRules;
    insurance: MortgageInsuranceRules;
    fees: MortgageFeesRules;
    stressTest: StressTestRules;
}
export interface FirstTimeBuyerRules {
    enabled: boolean;
    maxDebtRatio: number;
    maxLoanDurationYears: number;
    quotaDisclaimer: string;
    requiresPrimaryResidence: boolean;
}
export interface MortgageInsuranceRules {
    averageRate: number;
    includedInDebtRatio: boolean;
}
export interface MortgageFeesRules {
    notaryRateOldProperty: number;
    notaryRateNewProperty: number;
    bankFeesRate: number;
}
export interface StressTestRules {
    interestRateBuffer: number;
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
    netMonthlyIncome: number;
    loanDurationYears: number;
    annualInterestRate: number;
    isPrimaryResidence: boolean;
    isFirstTimeBuyer: boolean;
    isNewBuild: boolean;
}
export interface MortgageOutput {
    loanAmount: number;
    totalPaid: number;
    monthlyPayment: number;
    totalInterestPaid: number;
    maxMonthlyPayment: number;
    maxLoanAmount: number;
    loanDurationYears: number;
    debtRatio: number;
    totalProjectCost: number;
    requiredLoanAmount: number;
    monthlyInsuranceCost: number;
    isEligible: boolean;
    amortizationSchedule: AmortizationScheduleItem[];
    otherFees: OtherFees;
}
