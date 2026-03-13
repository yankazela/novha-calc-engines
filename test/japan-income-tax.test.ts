import { JapanIncomeTaxServiceImpl } from '../src/income-tax/japan/JapanIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/japan/domain/types';

const japanRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 1950000, rate: 0.05 },
        { from: 1950000, to: 3300000, rate: 0.10 },
        { from: 3300000, to: 6950000, rate: 0.20 },
        { from: 6950000, to: 9000000, rate: 0.23 },
        { from: 9000000, to: 18000000, rate: 0.33 },
        { from: 18000000, to: 40000000, rate: 0.40 },
        { from: 40000000, to: null, rate: 0.45 },
    ],
    inhabitantTax: { rate: 0.10 },
};

describe('JapanIncomeTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const service = new JapanIncomeTaxServiceImpl(0, japanRules);
        const result = service.calculateNetIncome();

        expect(result.nationalIncomeTax).toBe(0);
        expect(result.inhabitantTax).toBe(0);
        expect(result.totalDeductions).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });

    it('correctly calculates national income tax for income in first bracket', () => {
        const service = new JapanIncomeTaxServiceImpl(1000000, japanRules);
        const result = service.calculateNetIncome();

        // 0-1000000: 1000000 * 0.05 = 50000
        expect(result.nationalIncomeTax).toBeCloseTo(50000, 2);
        expect(result.grossIncome).toBe(1000000);
    });

    it('correctly calculates inhabitant tax as a flat rate on gross income', () => {
        const service = new JapanIncomeTaxServiceImpl(1000000, japanRules);
        const result = service.calculateNetIncome();

        // inhabitantTax = 1000000 * 0.10 = 100000
        expect(result.inhabitantTax).toBeCloseTo(100000, 2);
    });

    it('correctly calculates income spanning multiple brackets', () => {
        const service = new JapanIncomeTaxServiceImpl(5000000, japanRules);
        const result = service.calculateNetIncome();

        // 0-1950000: 1950000 * 0.05 = 97500
        // 1950000-3300000: 1350000 * 0.10 = 135000
        // 3300000-5000000: 1700000 * 0.20 = 340000
        // Total = 572500
        expect(result.nationalIncomeTax).toBeCloseTo(572500, 2);
    });

    it('net income equals gross income minus total deductions', () => {
        const service = new JapanIncomeTaxServiceImpl(5000000, japanRules);
        const result = service.calculateNetIncome();

        expect(result.netIncome).toBeCloseTo(result.grossIncome - result.totalDeductions, 2);
    });

    it('total deductions equals national income tax plus inhabitant tax', () => {
        const service = new JapanIncomeTaxServiceImpl(5000000, japanRules);
        const result = service.calculateNetIncome();

        expect(result.totalDeductions).toBeCloseTo(result.nationalIncomeTax + result.inhabitantTax, 2);
    });

    it('calculates effective tax rate as national income tax divided by gross income', () => {
        const service = new JapanIncomeTaxServiceImpl(5000000, japanRules);
        const result = service.calculateNetIncome();

        expect(result.effectiveTaxRate).toBeCloseTo(result.nationalIncomeTax / result.grossIncome, 4);
    });
});
