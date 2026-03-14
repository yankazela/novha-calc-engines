import { SpainIncomeTaxServiceImpl } from '../src/income-tax/spain/SpainIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/spain/domain/types';

const spainRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 12450, rate: 0.19 },
        { from: 12450, to: 20200, rate: 0.24 },
        { from: 20200, to: 35200, rate: 0.30 },
        { from: 35200, to: 60000, rate: 0.37 },
        { from: 60000, to: 300000, rate: 0.45 },
        { from: 300000, to: null, rate: 0.47 },
    ],
    socialContributions: { rate: 0.0635 },
};

describe('SpainIncomeTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const service = new SpainIncomeTaxServiceImpl(0, spainRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.socialContributions).toBe(0);
        expect(result.totalDeductions).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });

    it('correctly calculates income tax for income in first bracket', () => {
        const service = new SpainIncomeTaxServiceImpl(10000, spainRules);
        const result = service.calculateNetIncome();

        // 0-10000: 10000 * 0.19 = 1900
        expect(result.incomeTax).toBeCloseTo(1900, 2);
        expect(result.grossIncome).toBe(10000);
    });

    it('correctly calculates social contributions', () => {
        const service = new SpainIncomeTaxServiceImpl(10000, spainRules);
        const result = service.calculateNetIncome();

        // 10000 * 0.0635 = 635
        expect(result.socialContributions).toBeCloseTo(635, 2);
    });

    it('correctly calculates income tax spanning multiple brackets', () => {
        const service = new SpainIncomeTaxServiceImpl(25000, spainRules);
        const result = service.calculateNetIncome();

        // 0-12450: 12450 * 0.19 = 2365.5
        // 12450-20200: 7750 * 0.24 = 1860
        // 20200-25000: 4800 * 0.30 = 1440
        // Total = 5665.5
        expect(result.incomeTax).toBeCloseTo(5665.5, 1);
    });

    it('calculates effective tax rate as income tax divided by gross income', () => {
        const service = new SpainIncomeTaxServiceImpl(25000, spainRules);
        const result = service.calculateNetIncome();

        expect(result.effectiveTaxRate).toBeCloseTo(result.incomeTax / result.grossIncome, 4);
    });

    it('net income equals gross income minus total deductions', () => {
        const service = new SpainIncomeTaxServiceImpl(25000, spainRules);
        const result = service.calculateNetIncome();

        expect(result.netIncome).toBeCloseTo(result.grossIncome - result.totalDeductions, 2);
    });

    it('total deductions equals income tax plus social contributions', () => {
        const service = new SpainIncomeTaxServiceImpl(25000, spainRules);
        const result = service.calculateNetIncome();

        expect(result.totalDeductions).toBeCloseTo(result.incomeTax + result.socialContributions, 2);
    });

    it('applies highest bracket rate to income above 300000', () => {
        const service = new SpainIncomeTaxServiceImpl(350000, spainRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBeGreaterThan(0);
        const lastBreakdown = result.taxBracketBreakdown[result.taxBracketBreakdown.length - 1];
        expect(lastBreakdown.rate).toBe(0.47);
    });
});
