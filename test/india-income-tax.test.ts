import { IndiaIncomeTaxServiceImpl } from '../src/income-tax/india/IndiaIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/india/domain/types';

const indiaRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 300000, rate: 0 },
        { from: 300000, to: 700000, rate: 0.05 },
        { from: 700000, to: 1000000, rate: 0.10 },
        { from: 1000000, to: 1200000, rate: 0.15 },
        { from: 1200000, to: 1500000, rate: 0.20 },
        { from: 1500000, to: null, rate: 0.30 },
    ],
    cess: { rate: 0.04 },
};

describe('IndiaIncomeTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const service = new IndiaIncomeTaxServiceImpl(0, indiaRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.cess).toBe(0);
        expect(result.totalDeductions).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });

    it('returns zero income tax for income below the basic exemption (300000)', () => {
        const service = new IndiaIncomeTaxServiceImpl(200000, indiaRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.cess).toBe(0);
        expect(result.grossIncome).toBe(200000);
    });

    it('correctly calculates tax and cess for income spanning multiple brackets', () => {
        const service = new IndiaIncomeTaxServiceImpl(800000, indiaRules);
        const result = service.calculateNetIncome();

        // 0-300000: 0 tax
        // 300000-700000: 400000 * 0.05 = 20000
        // 700000-800000: 100000 * 0.10 = 10000
        // grossTax = 30000
        // cess = 30000 * 0.04 = 1200
        expect(result.incomeTax).toBeCloseTo(30000, 2);
        expect(result.cess).toBeCloseTo(1200, 2);
    });

    it('correctly calculates total deductions as income tax plus cess', () => {
        const service = new IndiaIncomeTaxServiceImpl(800000, indiaRules);
        const result = service.calculateNetIncome();

        expect(result.totalDeductions).toBeCloseTo(result.incomeTax + result.cess, 2);
    });

    it('net income equals gross income minus total deductions', () => {
        const service = new IndiaIncomeTaxServiceImpl(800000, indiaRules);
        const result = service.calculateNetIncome();

        expect(result.netIncome).toBeCloseTo(result.grossIncome - result.totalDeductions, 2);
    });

    it('calculates effective tax rate as income tax divided by gross income', () => {
        const service = new IndiaIncomeTaxServiceImpl(1000000, indiaRules);
        const result = service.calculateNetIncome();

        expect(result.effectiveTaxRate).toBeCloseTo(result.incomeTax / result.grossIncome, 4);
    });

    it('correctly applies the top bracket for high income', () => {
        const service = new IndiaIncomeTaxServiceImpl(2000000, indiaRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBeGreaterThan(0);
        const lastBreakdown = result.taxBracketBreakdown[result.taxBracketBreakdown.length - 1];
        expect(lastBreakdown.rate).toBe(0.30);
    });
});
