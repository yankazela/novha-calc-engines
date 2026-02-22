import { RuleMeta } from "../../../shared/domain/types";
import { OtherFees } from "../../domain/types";

export interface RuleInputDefinition {
  type: "number" | "string";
  min?: number;
  max?: number;
  enum?: string[];
}

export interface RuleInputs {
  propertyPrice: RuleInputDefinition;
  downPayment: RuleInputDefinition;
  interestRate: RuleInputDefinition;
  amortizationYears: RuleInputDefinition;
  grossMonthlyIncome: RuleInputDefinition;
}

export interface LoanConstraints {
  maxLtv: number;
  minDownPaymentPercent: number;
  maxAmortizationYears: number;
  maxDebtToIncomePercent: number;
}

export interface InterestRules {
  type: "fixed" | "variable";
  rateRangePercent: { min: number; max: number };
  stressTestBufferPercent: number;
}

export interface InsuranceRules {
  required: boolean;
}

export interface TransferDutyBracket {
  upTo?: number;
  above?: number;
  rate: number;
}

export interface FeesRules {
  bondRegistrationPercent: number;
  transferDuty: {
    brackets: TransferDutyBracket[];
  };
}

export interface MortgageRules {
  loanConstraints: LoanConstraints;
  interest: InterestRules;
  insurance: InsuranceRules;
  fees: FeesRules;
}

export interface RuleOutputs {
  loanAmount: "number";
  monthlyPayment: "number";
  totalInterestPaid: "number";
  totalPaid: "number";
  debtToIncomeRatio: "number";
  isAffordable: "boolean";
  transferDuty: "number";
  bondRegistrationFee: "number";
}

export interface MortgageRuleSet {
  meta: RuleMeta;
  inputs: RuleInputs;
  rules: MortgageRules;
  outputs: RuleOutputs;
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
  annualInterestRate: number; // e.g., 11.75%
  amortizationYears: number;
  grossMonthlyIncome: number;
}

export interface MortgageOutput {
  loanAmount: number;
  monthlyPayment: number;
  totalInterestPaid: number;
  totalPaid: number;
  debtToIncomeRatio: number;
  isAffordable: boolean;
  transferDuty: number;
  bondRegistrationFee: number;
  amortizationSchedule: AmortizationScheduleItem[];
  otherFees: OtherFees;
}
