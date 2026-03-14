import { BrazilIncomeTaxServiceImpl } from '../src/income-tax/brazil/BrazilIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/brazil/domain/types';

const brazilRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 27110.40, rate: 0 },
        { from: 27110.40, to: 33919.80, rate: 0.075 },
        { from: 33919.80, to: 45012.60, rate: 0.15 },
        { from: 45012.60, to: 55976.16, rate: 0.225 },
        { from: 55976.16, to: null, rate: 0.275 },
    ],
    inss: { rate: 0.11, cap: 87600 },
};

describe('BrazilIncomeTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const service = new BrazilIncomeTaxServiceImpl(0, brazilRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.inss).toBe(0);
        expect(result.totalDeductions).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });

    it('returns zero income tax for income in first bracket (below 27110.40)', () => {
        const service = new BrazilIncomeTaxServiceImpl(20000, brazilRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.grossIncome).toBe(20000);
        // INSS = 20000 * 0.11 = 2200
        expect(result.inss).toBeCloseTo(2200, 2);
        expect(result.effectiveTaxRate).toBe(0);
    });

    it('correctly calculates income tax for income spanning multiple brackets', () => {
        const service = new BrazilIncomeTaxServiceImpl(50000, brazilRules);
        const result = service.calculateNetIncome();

        // 0-27110.40: 0 tax
        // 27110.40-33919.80: 6809.40 * 0.075 = 510.705
        // 33919.80-45012.60: 11092.80 * 0.15 = 1663.92
        // 45012.60-50000: 4987.40 * 0.225 = 1122.165
        // Total ≈ 3296.79
        expect(result.incomeTax).toBeCloseTo(3296.79, 1);
        expect(result.grossIncome).toBe(50000);
    });

    it('correctly computes INSS and caps it at the cap amount', () => {
        const service = new BrazilIncomeTaxServiceImpl(100000, brazilRules);
        const result = service.calculateNetIncome();

        // INSS is capped at 87600: 87600 * 0.11 = 9636
        expect(result.inss).toBeCloseTo(9636, 2);
    });

    it('calculates effective tax rate as income tax divided by gross income', () => {
        const service = new BrazilIncomeTaxServiceImpl(50000, brazilRules);
        const result = service.calculateNetIncome();

        expect(result.effectiveTaxRate).toBeCloseTo(result.incomeTax / result.grossIncome, 4);
    });

    it('net income equals gross income minus total deductions', () => {
        const service = new BrazilIncomeTaxServiceImpl(50000, brazilRules);
        const result = service.calculateNetIncome();

        expect(result.netIncome).toBeCloseTo(result.grossIncome - result.totalDeductions, 2);
    });

    it('total deductions equals income tax plus INSS', () => {
        const service = new BrazilIncomeTaxServiceImpl(50000, brazilRules);
        const result = service.calculateNetIncome();

        expect(result.totalDeductions).toBeCloseTo(result.incomeTax + result.inss, 2);
    });

    it('returns bracket breakdown entries for multi-bracket income', () => {
        const service = new BrazilIncomeTaxServiceImpl(60000, brazilRules);
        const result = service.calculateNetIncome();

        expect(result.taxBracketBreakdown.length).toBeGreaterThan(0);
    });
});
