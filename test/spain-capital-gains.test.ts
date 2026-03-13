import { SpainCapitalGainsServiceImpl } from '../src/capital-gains/spain/SpainCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/spain/domain/types';

const spainRules: Rules = {
    brackets: [
        { from: 0, to: 6000, rate: 0.19 },
        { from: 6000, to: 50000, rate: 0.21 },
        { from: 50000, to: 200000, rate: 0.23 },
        { from: 200000, to: 300000, rate: 0.27 },
        { from: 300000, to: null, rate: 0.30 },
    ],
};

describe('SpainCapitalGainsServiceImpl', () => {
    it('returns zero tax for zero gain', () => {
        const input: Input = { capitalGain: 0 };
        const service = new SpainCapitalGainsServiceImpl(input, spainRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(0);
        expect(result.capitalGainTax).toBe(0);
        expect(result.totalTax).toBe(0);
        expect(result.effectiveRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly calculates tax for gain in first bracket', () => {
        const input: Input = { capitalGain: 3000 };
        const service = new SpainCapitalGainsServiceImpl(input, spainRules);
        const result = service.calculate();

        // 0-3000: 3000 * 0.19 = 570
        expect(result.capitalGainTax).toBe(570);
        expect(result.totalTax).toBe(570);
        expect(result.effectiveRate).toBeCloseTo(19, 2);
    });

    it('correctly calculates tax spanning multiple brackets', () => {
        const input: Input = { capitalGain: 100000 };
        const service = new SpainCapitalGainsServiceImpl(input, spainRules);
        const result = service.calculate();

        // 0-6000: 6000 * 0.19 = 1140
        // 6000-50000: 44000 * 0.21 = 9240
        // 50000-100000: 50000 * 0.23 = 11500
        // Total = 21880
        expect(result.capitalGainTax).toBeCloseTo(21880, 2);
        expect(result.totalTax).toBeCloseTo(21880, 2);
    });

    it('taxable gain equals input capital gain', () => {
        const input: Input = { capitalGain: 50000 };
        const service = new SpainCapitalGainsServiceImpl(input, spainRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(50000);
    });

    it('effective rate equals total tax divided by gain times 100', () => {
        const input: Input = { capitalGain: 100000 };
        const service = new SpainCapitalGainsServiceImpl(input, spainRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBeCloseTo((result.capitalGainTax / 100000) * 100, 2);
    });
});
