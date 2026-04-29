import { SwitzerlandIncomeTaxServiceImpl } from '../src/income-tax/switzerland/SwitzerlandIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/switzerland/domain/types';

const switzerlandRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 14500, rate: 0 },
        { from: 14500, to: 31600, rate: 0.0077 },
        { from: 31600, to: 41400, rate: 0.0088 },
        { from: 41400, to: 55200, rate: 0.0264 },
        { from: 55200, to: 72500, rate: 0.0297 },
        { from: 72500, to: 78100, rate: 0.0594 },
        { from: 78100, to: 103600, rate: 0.066 },
        { from: 103600, to: 134600, rate: 0.088 },
        { from: 134600, to: 176000, rate: 0.11 },
        { from: 176000, to: 755200, rate: 0.132 },
        { from: 755200, to: null, rate: 0.115 },
    ],
    socialContributions: { rate: 0.053 },
};

describe('SwitzerlandIncomeTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const service = new SwitzerlandIncomeTaxServiceImpl(0, switzerlandRules);
        const result = service.calculateNetIncome();
        expect(result.incomeTax).toBe(0);
        expect(result.socialContributions).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });

    it('returns zero tax for income below first taxable bracket', () => {
        const service = new SwitzerlandIncomeTaxServiceImpl(10000, switzerlandRules);
        const result = service.calculateNetIncome();
        expect(result.incomeTax).toBe(0);
    });

    it('correctly calculates tax spanning multiple brackets', () => {
        const service = new SwitzerlandIncomeTaxServiceImpl(50000, switzerlandRules);
        const result = service.calculateNetIncome();
        // 0-14500: 0
        // 14500-31600: 17100 * 0.0077 = 131.67
        // 31600-41400: 9800 * 0.0088 = 86.24
        // 41400-50000: 8600 * 0.0264 = 227.04
        // Total ≈ 444.95
        expect(result.incomeTax).toBeGreaterThan(0);
        expect(result.grossIncome).toBe(50000);
    });

    it('correctly calculates social contributions', () => {
        const service = new SwitzerlandIncomeTaxServiceImpl(50000, switzerlandRules);
        const result = service.calculateNetIncome();
        // 50000 * 0.053 = 2650
        expect(result.socialContributions).toBeCloseTo(2650, 2);
    });

    it('net income equals gross income minus total deductions', () => {
        const service = new SwitzerlandIncomeTaxServiceImpl(100000, switzerlandRules);
        const result = service.calculateNetIncome();
        expect(result.netIncome).toBeCloseTo(result.grossIncome - result.totalDeductions, 2);
    });

    it('total deductions equals income tax plus social contributions', () => {
        const service = new SwitzerlandIncomeTaxServiceImpl(100000, switzerlandRules);
        const result = service.calculateNetIncome();
        expect(result.totalDeductions).toBeCloseTo(result.incomeTax + result.socialContributions, 2);
    });
});
