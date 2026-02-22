import { AustraliaMortgageServiceImpl } from '../src/mortgage/australia/AustraliaMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/australia/domain/types';

const australiaMortgageRules: MortgageRules = {
    loanConstraints: {
        maxLvr: 0.95,
        maxAmortizationYears: 30,
    },
    lendersMortgageInsurance: {
        requiredAboveLvr: 0.8,
        premiumRates: [
            { maxLvr: 0.85, rate: 0.006 },
            { maxLvr: 0.90, rate: 0.012 },
            { maxLvr: 0.95, rate: 0.022 },
        ],
        premiumAddedToLoan: true,
    },
    interest: {
        compounding: 'MONTHLY',
    },
    stampDuty: {
        brackets: [
            { upTo: 14000, rate: 0.014 },
            { upTo: 32000, rate: 0.035 },
            { upTo: 85000, rate: 0.045 },
            { upTo: 319000, rate: 0.0475 },
            { upTo: 1000000, rate: 0.05 },
            { above: 1000000, rate: 0.055 },
        ],
    },
};

const defaultInput: MortgageInput = {
    propertyPrice: 600000,
    downPayment: 120000, // 20% down, LVR = 80%
    annualInterestRate: 6.0,
    amortizationYears: 30,
    paymentFrequency: 'MONTHLY',
};

describe('AustraliaMortgageServiceImpl', () => {
    const service = new AustraliaMortgageServiceImpl();

    it('calculates loan amount correctly', () => {
        const result = service.calculate(defaultInput, australiaMortgageRules);

        expect(result.loanAmount).toBe(480000);
    });

    it('does not apply LMI when LVR is exactly 80%', () => {
        const result = service.calculate(defaultInput, australiaMortgageRules);

        expect(result.lmiPremium).toBe(0);
        expect(result.totalMortgage).toBe(480000);
    });

    it('applies LMI when LVR exceeds 80%', () => {
        const input: MortgageInput = {
            ...defaultInput,
            downPayment: 60000, // 10% down, LVR = 90%
        };
        const result = service.calculate(input, australiaMortgageRules);

        // LVR = 540000 / 600000 = 90%, rate = 1.2%
        expect(result.lmiPremium).toBe(540000 * 0.012);
        expect(result.totalMortgage).toBe(540000 + 540000 * 0.012);
    });

    it('calculates monthly payment for standard mortgage', () => {
        const result = service.calculate(defaultInput, australiaMortgageRules);

        // Standard amortization formula
        const r = 0.06 / 12;
        const n = 30 * 12;
        const expected = 480000 * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        expect(result.monthlyPayment).toBeCloseTo(expected, 2);
    });

    it('totalPaid = monthlyPayment * totalPayments', () => {
        const result = service.calculate(defaultInput, australiaMortgageRules);
        const totalPayments = 30 * 12;

        expect(result.totalPaid).toBeCloseTo(result.monthlyPayment * totalPayments, 0);
    });

    it('calculates stamp duty', () => {
        const result = service.calculate(defaultInput, australiaMortgageRules);

        // stamp duty for 600000: falls in upTo: 1000000 bracket
        expect(result.stampDuty).toBeGreaterThan(0);
    });

    it('throws error when loan amount is zero or negative', () => {
        const input: MortgageInput = {
            ...defaultInput,
            downPayment: 600000,
        };

        expect(() => service.calculate(input, australiaMortgageRules)).toThrow('Invalid loan amount');
    });

    it('generates amortization schedule', () => {
        const result = service.calculate(defaultInput, australiaMortgageRules);

        expect(result.amortizationSchedule.length).toBe(30);
        expect(result.amortizationSchedule[0].year).toBe(1);
        expect(result.amortizationSchedule[29].balance).toBeCloseTo(0, 0);
    });

    it('amortization schedule balance decreases over time', () => {
        const result = service.calculate(defaultInput, australiaMortgageRules);
        const schedule = result.amortizationSchedule;

        for (let i = 1; i < schedule.length; i++) {
            expect(schedule[i].balance).toBeLessThan(schedule[i - 1].balance);
        }
    });

    it('otherFees includes stamp duty and LMI', () => {
        const result = service.calculate(defaultInput, australiaMortgageRules);

        expect(result.otherFees.notaryFees.label).toBe('STAMP_DUTY');
        expect(result.otherFees.monthlyInsuranceFees.label).toBe('LMI_PREMIUM');
    });
});
