import { NetherlandsIncomeTaxServiceImpl } from '../src/income-tax/netherlands/NetherlandsIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/netherlands/domain/types';

const netherlandsRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 75624, rate: 0.3697 },
        { from: 75624, to: null, rate: 0.495 },
    ],
    socialContributions: { rate: 0 },
};

describe('NetherlandsIncomeTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const service = new NetherlandsIncomeTaxServiceImpl(0, netherlandsRules);
        const result = service.calculateNetIncome();
        expect(result.incomeTax).toBe(0);
        expect(result.socialContributions).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });

    it('correctly calculates income tax in first bracket', () => {
        const service = new NetherlandsIncomeTaxServiceImpl(50000, netherlandsRules);
        const result = service.calculateNetIncome();
        // 50000 * 0.3697 = 18485
        expect(result.incomeTax).toBeCloseTo(18485, 2);
    });

    it('correctly calculates income tax spanning both brackets', () => {
        const service = new NetherlandsIncomeTaxServiceImpl(100000, netherlandsRules);
        const result = service.calculateNetIncome();
        // 0-75624: 75624 * 0.3697 = 27958.19
        // 75624-100000: 24376 * 0.495 = 12066.12
        // Total ≈ 40024.31
        expect(result.incomeTax).toBeCloseTo(40024.31, 1);
    });

    it('social contributions are zero (included in brackets)', () => {
        const service = new NetherlandsIncomeTaxServiceImpl(50000, netherlandsRules);
        const result = service.calculateNetIncome();
        expect(result.socialContributions).toBe(0);
    });

    it('net income equals gross income minus income tax', () => {
        const service = new NetherlandsIncomeTaxServiceImpl(50000, netherlandsRules);
        const result = service.calculateNetIncome();
        expect(result.netIncome).toBeCloseTo(result.grossIncome - result.totalDeductions, 2);
    });

    it('effective tax rate calculation is correct', () => {
        const service = new NetherlandsIncomeTaxServiceImpl(50000, netherlandsRules);
        const result = service.calculateNetIncome();
        expect(result.effectiveTaxRate).toBeCloseTo(result.incomeTax / result.grossIncome, 4);
    });
});
