import { IsraelIncomeTaxServiceImpl } from '../src/income-tax/israel/IsraelIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/israel/domain/types';

const israelRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 81480, rate: 0.10 },
        { from: 81480, to: 116760, rate: 0.14 },
        { from: 116760, to: 187440, rate: 0.20 },
        { from: 187440, to: 260520, rate: 0.31 },
        { from: 260520, to: 542160, rate: 0.35 },
        { from: 542160, to: null, rate: 0.47 },
    ],
    socialContributions: { rate: 0.12 },
};

describe('IsraelIncomeTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const service = new IsraelIncomeTaxServiceImpl(0, israelRules);
        const result = service.calculateNetIncome();
        expect(result.incomeTax).toBe(0);
        expect(result.socialContributions).toBe(0);
        expect(result.totalDeductions).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });

    it('correctly calculates income tax for income in first bracket', () => {
        const service = new IsraelIncomeTaxServiceImpl(50000, israelRules);
        const result = service.calculateNetIncome();
        // 50000 * 0.10 = 5000
        expect(result.incomeTax).toBeCloseTo(5000, 2);
        expect(result.grossIncome).toBe(50000);
    });

    it('correctly calculates social contributions', () => {
        const service = new IsraelIncomeTaxServiceImpl(50000, israelRules);
        const result = service.calculateNetIncome();
        // 50000 * 0.12 = 6000
        expect(result.socialContributions).toBeCloseTo(6000, 2);
    });

    it('correctly calculates income tax spanning multiple brackets', () => {
        const service = new IsraelIncomeTaxServiceImpl(120000, israelRules);
        const result = service.calculateNetIncome();
        // 0-81480: 81480 * 0.10 = 8148
        // 81480-116760: 35280 * 0.14 = 4939.2
        // 116760-120000: 3240 * 0.20 = 648
        // Total = 13735.2
        expect(result.incomeTax).toBeCloseTo(13735.2, 1);
    });

    it('calculates effective tax rate as income tax divided by gross income', () => {
        const service = new IsraelIncomeTaxServiceImpl(120000, israelRules);
        const result = service.calculateNetIncome();
        expect(result.effectiveTaxRate).toBeCloseTo(result.incomeTax / result.grossIncome, 4);
    });

    it('net income equals gross income minus total deductions', () => {
        const service = new IsraelIncomeTaxServiceImpl(120000, israelRules);
        const result = service.calculateNetIncome();
        expect(result.netIncome).toBeCloseTo(result.grossIncome - result.totalDeductions, 2);
    });

    it('total deductions equals income tax plus social contributions', () => {
        const service = new IsraelIncomeTaxServiceImpl(120000, israelRules);
        const result = service.calculateNetIncome();
        expect(result.totalDeductions).toBeCloseTo(result.incomeTax + result.socialContributions, 2);
    });

    it('applies highest bracket rate to income above 542160', () => {
        const service = new IsraelIncomeTaxServiceImpl(600000, israelRules);
        const result = service.calculateNetIncome();
        expect(result.incomeTax).toBeGreaterThan(0);
        const lastBreakdown = result.taxBracketBreakdown[result.taxBracketBreakdown.length - 1];
        expect(lastBreakdown.rate).toBe(0.47);
    });
});
