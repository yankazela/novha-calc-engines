import { USAIncomeTaxServiceImpl } from '../src/income-tax/usa/USAIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/usa/domain/types';

// USA 2024 federal income tax rules (single filer)
const usaRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 11600, rate: 0.10 },
        { from: 11600, to: 47150, rate: 0.12 },
        { from: 47150, to: 100525, rate: 0.22 },
        { from: 100525, to: 191950, rate: 0.24 },
        { from: 191950, to: 243725, rate: 0.32 },
        { from: 243725, to: 609350, rate: 0.35 },
        { from: 609350, to: null, rate: 0.37 },
    ],
    standardDeduction: { amount: 14600 },
    fica: {
        socialSecurity: { rate: 0.062, wageBase: 168600 },
        medicare: { rate: 0.0145, additionalRate: 0.009, additionalThreshold: 200000 },
    },
};

describe('USAIncomeTaxServiceImpl', () => {
    it('returns zero income tax for income at or below the standard deduction', () => {
        const service = new USAIncomeTaxServiceImpl(14600, usaRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.grossIncome).toBe(14600);
        expect(result.standardDeduction).toBe(14600);
    });

    it('correctly calculates income tax for $50,000 income', () => {
        const service = new USAIncomeTaxServiceImpl(50000, usaRules);
        const result = service.calculateNetIncome();

        // Standard deduction = $14,600
        // Taxable income = 50000 - 14600 = 35400
        // 10%: 11600 * 0.10 = 1160
        // 12%: (35400 - 11600) * 0.12 = 23800 * 0.12 = 2856
        // Total = 4016
        expect(result.incomeTax).toBe(4016);
        expect(result.standardDeduction).toBe(14600);
    });

    it('correctly calculates income tax for $100,000 income', () => {
        const service = new USAIncomeTaxServiceImpl(100000, usaRules);
        const result = service.calculateNetIncome();

        // Taxable income = 100000 - 14600 = 85400
        // 10%: 11600 * 0.10 = 1160
        // 12%: (47150 - 11600) * 0.12 = 35550 * 0.12 = 4266
        // 22%: (85400 - 47150) * 0.22 = 38250 * 0.22 = 8415
        // Total = 13841
        expect(result.incomeTax).toBe(13841);
    });

    it('correctly calculates income tax for $200,000 income', () => {
        const service = new USAIncomeTaxServiceImpl(200000, usaRules);
        const result = service.calculateNetIncome();

        // Taxable income = 200000 - 14600 = 185400
        // 10%: 11600 * 0.10 = 1160
        // 12%: (47150 - 11600) * 0.12 = 4266
        // 22%: (100525 - 47150) * 0.22 = 11742.50
        // 24%: (185400 - 100525) * 0.24 = 84875 * 0.24 = 20370
        // Total = 37538.50
        expect(result.incomeTax).toBe(37538.50);
    });

    it('calculates Social Security correctly up to wage base', () => {
        const service = new USAIncomeTaxServiceImpl(50000, usaRules);
        const result = service.calculateNetIncome();

        // Social Security: 50000 * 6.2% = 3100
        expect(result.socialSecurity).toBeCloseTo(3100, 2);
    });

    it('caps Social Security at the wage base', () => {
        const service = new USAIncomeTaxServiceImpl(200000, usaRules);
        const result = service.calculateNetIncome();

        // Social Security: 168600 * 6.2% = 10453.20
        expect(result.socialSecurity).toBeCloseTo(10453.20, 2);
    });

    it('calculates Medicare without additional tax below $200,000 threshold', () => {
        const service = new USAIncomeTaxServiceImpl(100000, usaRules);
        const result = service.calculateNetIncome();

        // Medicare: 100000 * 1.45% = 1450
        expect(result.medicare).toBeCloseTo(1450, 2);
    });

    it('applies additional Medicare tax above $200,000 threshold', () => {
        const service = new USAIncomeTaxServiceImpl(250000, usaRules);
        const result = service.calculateNetIncome();

        // Medicare: 250000 * 1.45% + (250000 - 200000) * 0.9% = 3625 + 450 = 4075
        expect(result.medicare).toBeCloseTo(4075, 2);
    });

    it('net income equals gross income minus total deductions', () => {
        const service = new USAIncomeTaxServiceImpl(100000, usaRules);
        const result = service.calculateNetIncome();

        expect(result.netIncome).toBeCloseTo(
            result.grossIncome - result.totalDeductions,
            2,
        );
    });

    it('total deductions equals income tax plus FICA', () => {
        const service = new USAIncomeTaxServiceImpl(100000, usaRules);
        const result = service.calculateNetIncome();

        expect(result.totalDeductions).toBeCloseTo(
            result.incomeTax + result.socialSecurity + result.medicare,
            2,
        );
    });

    it('effective tax rate is income tax divided by gross income', () => {
        const service = new USAIncomeTaxServiceImpl(100000, usaRules);
        const result = service.calculateNetIncome();

        expect(result.effectiveTaxRate).toBeCloseTo(result.incomeTax / result.grossIncome, 4);
    });

    it('returns zero tax for zero income', () => {
        const service = new USAIncomeTaxServiceImpl(0, usaRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.socialSecurity).toBe(0);
        expect(result.medicare).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });
});
