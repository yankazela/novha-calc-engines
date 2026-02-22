import { CanadaMortgageService } from './CanadaMortgageService';
import {
  MortgageRules,
  MortgageCalculationInput,
  MortgageCalculationResult,
  AmortizationScheduleItem
} from './domain/types';

export class CanadaMortgageServiceImpl implements CanadaMortgageService {

  public calculate(input: MortgageCalculationInput, rules: MortgageRules): MortgageCalculationResult {

    const {
      propertyPrice,
      downPayment,
      amortizationYears,
      paymentFrequency
    } = input;

    const interestRate = input.interestRate / 100;

    /* -----------------------------
       1. Loan Amount & LTV
    ------------------------------ */

    const loanAmount = propertyPrice - downPayment;
    if (loanAmount <= 0) {
      throw new Error('Invalid loan amount');
    }

    const ltv = loanAmount / propertyPrice;

    /* -----------------------------
       2. CMHC Insurance
    ------------------------------ */

    let insurancePremium = 0;

    if (ltv > rules.mortgageInsurance.requiredBelowLtv) {
      const premiumRule = rules.mortgageInsurance.premiumRates
        .find(r => ltv <= r.maxLtv);

      if (!premiumRule) {
        throw new Error('LTV exceeds maximum insurable limit');
      }

      insurancePremium = loanAmount * premiumRule.rate;
    }

    const totalMortgage = rules.mortgageInsurance.premiumAddedToLoan
      ? loanAmount + insurancePremium
      : loanAmount;

    /* -----------------------------
       3. Interest Rate Conversion
       (Canada semi-annual compounding)
    ------------------------------ */

    const periodicRate = this.convertCanadianRate(
      interestRate,
      rules.interest.compounding,
      rules.paymentFrequencyRules[paymentFrequency].paymentsPerYear
    );

    /* -----------------------------
       4. Payment Frequency
    ------------------------------ */

    const frequencyRule = rules.paymentFrequencyRules[paymentFrequency];
    const paymentsPerYear = frequencyRule.paymentsPerYear;
    const totalPayments = amortizationYears * paymentsPerYear;

    /* -----------------------------
       5. Mortgage Payment Formula
       P = L × [ r(1+r)^n ] / [ (1+r)^n − 1 ]
    ------------------------------ */

    const paymentAmount = this.calculatePayment(
      totalMortgage,
      periodicRate,
      totalPayments
    );

    /* -----------------------------
       6. Totals
    ------------------------------ */

    const totalPaid = paymentAmount * totalPayments;
    const totalInterestPaid = totalPaid - totalMortgage;

    const amortizationSchedule = this.calculateAmortizationSchedule(
      totalMortgage,
      periodicRate,
      paymentAmount,
      totalPayments,
      amortizationYears,
      paymentsPerYear
    );

    return {
      loanAmount: loanAmount,
      insurancePremium: insurancePremium,
      totalMortgage: totalMortgage,
      monthlyPayment: paymentAmount,
      totalInterestPaid: totalInterestPaid,
      totalPaid: totalPaid,
      amortizationSchedule: amortizationSchedule,
      otherFees: {
        notaryFees: {
            value: 0,
            label: 'NOTARY_FEES'
        },
        bankFees: {
            value: 0,
            label: 'BANK_FEES'
        },
        monthlyInsuranceFees: {
            value: insurancePremium,
            label: 'INSURANCE_PREMIUM'
        }
    }
    };
  }

  /* ======================================================
     Helper Methods
  ====================================================== */

  private calculateAmortizationSchedule(
    principal: number,
    periodicRate: number,
    paymentAmount: number,
    totalPayments: number,
    amortizationYears: number,
    paymentsPerYear: number
  ): AmortizationScheduleItem[] {
    const schedule: AmortizationScheduleItem[] = [];
    let balance = principal;

    for (let year = 1; year <= amortizationYears; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      const paymentsInYear = Math.min(paymentsPerYear, totalPayments - (year - 1) * paymentsPerYear);

      for (let payment = 1; payment <= paymentsInYear; payment++) {
        const interestPayment = balance * periodicRate;
        const principalPayment = paymentAmount - interestPayment;

        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        balance -= principalPayment;
      }

      schedule.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: Math.max(0, balance)
      });

      if (balance <= 0) break;
    }

    return schedule;
  }

  private convertCanadianRate(
    annualRate: number,
    compounding: 'SEMI_ANNUAL' | 'ANNUAL' | 'MONTHLY',
    paymentsPerYear: number
  ): number {

    if (compounding !== 'SEMI_ANNUAL') {
      throw new Error('Only Canadian semi-annual compounding supported');
    }

    // Canadian standard conversion
    const semiAnnualRate = annualRate / 2;
    const effectiveAnnualRate = Math.pow(1 + semiAnnualRate, 2) - 1;

    return Math.pow(1 + effectiveAnnualRate, 1 / paymentsPerYear) - 1;
  }

  private calculatePayment(principal: number, rate: number, periods: number): number {
    if (rate === 0) {
      return principal / periods;
    }

    return principal *
      (rate * Math.pow(1 + rate, periods)) /
      (Math.pow(1 + rate, periods) - 1);
  }
}
