import { IsraelCapitalGainsServiceImpl } from '../src/capital-gains/israel/IsraelCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/israel/domain/types';

const israelRules: Rules = {
    brackets: [
        { from: 0, to: null, rate: 0.25 },
    ],
};

describe('IsraelCapitalGainsServiceImpl', () => {
    it('returns zero tax for zero gain', () => {
        const input: Input = { capitalGain: 0 };
        const service = new IsraelCapitalGainsServiceImpl(input, israelRules);
        const result = service.calculate();
        expect(result.taxableGain).toBe(0);
        expect(result.capitalGainTax).toBe(0);
        expect(result.totalTax).toBe(0);
        expect(result.effectiveRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly calculates flat 25% tax', () => {
        const input: Input = { capitalGain: 100000 };
        const service = new IsraelCapitalGainsServiceImpl(input, israelRules);
        const result = service.calculate();
        // 100000 * 0.25 = 25000
        expect(result.capitalGainTax).toBe(25000);
        expect(result.totalTax).toBe(25000);
        expect(result.effectiveRate).toBe(25);
    });

    it('taxable gain equals input capital gain', () => {
        const input: Input = { capitalGain: 50000 };
        const service = new IsraelCapitalGainsServiceImpl(input, israelRules);
        const result = service.calculate();
        expect(result.taxableGain).toBe(50000);
    });

    it('effective rate equals total tax divided by gain times 100', () => {
        const input: Input = { capitalGain: 200000 };
        const service = new IsraelCapitalGainsServiceImpl(input, israelRules);
        const result = service.calculate();
        expect(result.effectiveRate).toBeCloseTo((result.capitalGainTax / 200000) * 100, 2);
    });
});
