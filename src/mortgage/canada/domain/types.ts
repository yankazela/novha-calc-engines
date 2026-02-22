import { RuleMeta } from "../../../shared/domain/types";
import { OtherFees } from "../../domain/types";

export interface RuleInputDefinition {
    type: 'number' | 'string';
    min?: number;
    max?: number;
    enum?: string[];
}

export interface RuleInputs {
    propertyPrice: RuleInputDefinition;
    downPayment: RuleInputDefinition;
    interestRate: RuleInputDefinition;
    amortizationYears: RuleInputDefinition;
    paymentFrequency: RuleInputDefinition;
}

export interface RuleOutputs {
    loanAmount: 'number';
    insurancePremium: 'number';
    totalMortgage: 'number';
    paymentAmount: 'number';
    totalInterestPaid: 'number';
    totalPaid: 'number';
}

export interface LoanConstraints {
    maxAmortizationYears: number;
    insuredMaxAmortizationYears: number;
    minDownPayment: {
        upTo500k: number;
        above500k: number;
    };
}

export interface MortgageInsuranceRate {
    maxLtv: number;
    rate: number;
}

export interface MortgageInsuranceRules {
    requiredBelowLtv: number;
    premiumRates: MortgageInsuranceRate[];
    premiumAddedToLoan: boolean;
}


export interface MortgageRules {
    loanConstraints: LoanConstraints;
    mortgageInsurance: MortgageInsuranceRules;
    interest: InterestRules;
    paymentFrequencyRules: PaymentFrequencyRules;
    stressTest: StressTestRules;
}

export interface InterestRules {
    compounding: 'SEMI_ANNUAL' | 'ANNUAL' | 'MONTHLY';
    conversionFormula: 'CANADA_STANDARD' | string;
}

export interface PaymentFrequencyRule {
    paymentsPerYear: number;
    acceleration?: boolean;
}

export interface PaymentFrequencyRules {
    MONTHLY: PaymentFrequencyRule;
    BI_WEEKLY: PaymentFrequencyRule;
    ACCELERATED_BI_WEEKLY: PaymentFrequencyRule;
}

export interface StressTestRules {
    apply: boolean;
    minimumRateBuffer: number;
    minimumQualifyingRate: number;
}

export interface MortgageRuleSet {
    meta: RuleMeta;
    inputs: RuleInputs;
    rules: MortgageRules;
    outputs: RuleOutputs;
}

export interface MortgageCalculationInput {
  propertyPrice: number;
  downPayment: number;
  interestRate: number; // Annual nominal rate (e.g. 0.052)
  amortizationYears: number;
  paymentFrequency: 'MONTHLY' | 'BI_WEEKLY' | 'ACCELERATED_BI_WEEKLY';
}

export interface AmortizationScheduleItem {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface MortgageCalculationResult {
  loanAmount: number;
  insurancePremium: number;
  totalMortgage: number;
  monthlyPayment: number;
  totalInterestPaid: number;
  totalPaid: number;
  amortizationSchedule: AmortizationScheduleItem[];
  otherFees: OtherFees;
}
