import { JapanCapitalGainsServiceImpl } from '../src/capital-gains/japan/JapanCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/japan/domain/types';

const japanRules: Rules = {
    flatRate: 0.20315,
};

describe('JapanCapitalGainsServiceImpl', () => {
    it('returns zero tax for zero gain', () => {
        const input: Input = { capitalGain: 0 };
        const service = new JapanCapitalGainsServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(0);
        expect(result.capitalGainTax).toBe(0);
        expect(result.totalTax).toBe(0);
        expect(result.effectiveRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly applies the flat 20.315% rate', () => {
        const input: Input = { capitalGain: 1000000 };
        const service = new JapanCapitalGainsServiceImpl(input, japanRules);
        const result = service.calculate();

        // 1000000 * 0.20315 = 203150
        expect(result.capitalGainTax).toBeCloseTo(203150, 2);
        expect(result.totalTax).toBeCloseTo(203150, 2);
    });

    it('effective rate equals the flat rate as a percentage', () => {
        const input: Input = { capitalGain: 1000000 };
        const service = new JapanCapitalGainsServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBeCloseTo(20.315, 3);
    });

    it('returns one breakdown entry for flat rate calculation', () => {
        const input: Input = { capitalGain: 1000000 };
        const service = new JapanCapitalGainsServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(1);
        expect(result.breakdowns[0].rate).toBe(0.20315);
    });

    it('scales linearly with capital gain', () => {
        const input: Input = { capitalGain: 5000000 };
        const service = new JapanCapitalGainsServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.capitalGainTax).toBeCloseTo(5000000 * 0.20315, 2);
    });
});
