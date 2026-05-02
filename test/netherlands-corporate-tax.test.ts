import { NetherlandsCorporateTaxServiceImpl } from '../src/corporate/netherlands/NetherlandsCorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/netherlands/domain/types';

const netherlandsRules: Rules = {
    tiers: [
        { from: 0, to: 200000, rate: 0.19 },
        { from: 200000, to: null, rate: 0.258 },
    ],
};

describe('NetherlandsCorporateTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const input: Input = { taxableIncome: 0 };
        const service = new NetherlandsCorporateTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        expect(result.corporateTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly calculates tax for income within first tier (19%)', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new NetherlandsCorporateTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        // 100000 * 0.19 = 19000
        expect(result.corporateTax).toBe(19000);
        expect(result.effectiveTaxRate).toBe(19);
    });

    it('correctly calculates tax spanning both tiers', () => {
        const input: Input = { taxableIncome: 300000 };
        const service = new NetherlandsCorporateTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        // 0-200000: 200000 * 0.19 = 38000
        // 200000-300000: 100000 * 0.258 = 25800
        // Total = 63800
        expect(result.corporateTax).toBe(63800);
    });

    it('returns two breakdown entries when spanning both tiers', () => {
        const input: Input = { taxableIncome: 300000 };
        const service = new NetherlandsCorporateTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        expect(result.breakdowns).toHaveLength(2);
    });

    it('effective tax rate is less than top rate for income spanning tiers', () => {
        const input: Input = { taxableIncome: 300000 };
        const service = new NetherlandsCorporateTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        expect(result.effectiveTaxRate).toBeLessThan(25.8);
        expect(result.effectiveTaxRate).toBeGreaterThan(19);
    });
});
