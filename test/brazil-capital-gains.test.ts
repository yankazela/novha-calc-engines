import { BrazilCapitalGainsServiceImpl } from '../src/capital-gains/brazil/BrazilCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/brazil/domain/types';

const brazilRules: Rules = {
    brackets: [
        { from: 0, to: 5000000, rate: 0.15 },
        { from: 5000000, to: 10000000, rate: 0.175 },
        { from: 10000000, to: 30000000, rate: 0.20 },
        { from: 30000000, to: null, rate: 0.225 },
    ],
};

describe('BrazilCapitalGainsServiceImpl', () => {
    it('returns zero tax for zero gain', () => {
        const input: Input = { capitalGain: 0 };
        const service = new BrazilCapitalGainsServiceImpl(input, brazilRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(0);
        expect(result.capitalGainTax).toBe(0);
        expect(result.totalTax).toBe(0);
        expect(result.effectiveRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly calculates tax for gain in first bracket', () => {
        const input: Input = { capitalGain: 1000000 };
        const service = new BrazilCapitalGainsServiceImpl(input, brazilRules);
        const result = service.calculate();

        // 0-1000000: 1000000 * 0.15 = 150000
        expect(result.capitalGainTax).toBe(150000);
        expect(result.totalTax).toBe(150000);
        expect(result.effectiveRate).toBeCloseTo(15, 2);
    });

    it('correctly calculates tax spanning multiple brackets', () => {
        const input: Input = { capitalGain: 7000000 };
        const service = new BrazilCapitalGainsServiceImpl(input, brazilRules);
        const result = service.calculate();

        // 0-5000000: 5000000 * 0.15 = 750000
        // 5000000-7000000: 2000000 * 0.175 = 350000
        // Total = 1100000
        expect(result.capitalGainTax).toBeCloseTo(1100000, 2);
        expect(result.totalTax).toBeCloseTo(1100000, 2);
        expect(result.effectiveRate).toBeCloseTo((1100000 / 7000000) * 100, 2);
    });

    it('taxable gain equals input capital gain', () => {
        const input: Input = { capitalGain: 3000000 };
        const service = new BrazilCapitalGainsServiceImpl(input, brazilRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(3000000);
    });

    it('returns correct number of breakdown entries', () => {
        const input: Input = { capitalGain: 7000000 };
        const service = new BrazilCapitalGainsServiceImpl(input, brazilRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(2);
    });
});
