import { IndiaCapitalGainsServiceImpl } from '../src/capital-gains/india/IndiaCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/india/domain/types';

const indiaRules: Rules = {
    shortTermRate: 0.20,
    longTermRate: 0.125,
    longTermExemption: 125000,
};

describe('IndiaCapitalGainsServiceImpl', () => {
    it('returns zero tax for zero gain', () => {
        const input: Input = { capitalGain: 0, holdingPeriodMonths: 6 };
        const service = new IndiaCapitalGainsServiceImpl(input, indiaRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(0);
        expect(result.capitalGainTax).toBe(0);
        expect(result.totalTax).toBe(0);
        expect(result.effectiveRate).toBe(0);
    });

    it('correctly calculates short-term capital gains tax', () => {
        const input: Input = { capitalGain: 500000, holdingPeriodMonths: 6 };
        const service = new IndiaCapitalGainsServiceImpl(input, indiaRules);
        const result = service.calculate();

        // Short-term: 500000 * 0.20 = 100000
        expect(result.capitalGainTax).toBe(100000);
        expect(result.totalTax).toBe(100000);
        expect(result.effectiveRate).toBeCloseTo(20, 2);
    });

    it('returns zero tax for long-term gain fully within the exemption', () => {
        const input: Input = { capitalGain: 100000, holdingPeriodMonths: 24 };
        const service = new IndiaCapitalGainsServiceImpl(input, indiaRules);
        const result = service.calculate();

        // Long-term: max(0, 100000 - 125000) = 0 taxable
        expect(result.capitalGainTax).toBe(0);
        expect(result.totalTax).toBe(0);
    });

    it('correctly calculates long-term capital gains above the exemption', () => {
        const input: Input = { capitalGain: 500000, holdingPeriodMonths: 24 };
        const service = new IndiaCapitalGainsServiceImpl(input, indiaRules);
        const result = service.calculate();

        // Long-term: max(0, 500000 - 125000) = 375000 * 0.125 = 46875
        expect(result.capitalGainTax).toBe(46875);
        expect(result.totalTax).toBe(46875);
    });

    it('long-term rate is lower than short-term rate for the same gain', () => {
        const longTermInput: Input = { capitalGain: 500000, holdingPeriodMonths: 24 };
        const shortTermInput: Input = { capitalGain: 500000, holdingPeriodMonths: 6 };

        const longTermTax = new IndiaCapitalGainsServiceImpl(longTermInput, indiaRules).calculate().capitalGainTax;
        const shortTermTax = new IndiaCapitalGainsServiceImpl(shortTermInput, indiaRules).calculate().capitalGainTax;

        expect(longTermTax).toBeLessThan(shortTermTax);
    });

    it('holding period of exactly 12 months is treated as long-term', () => {
        const input: Input = { capitalGain: 500000, holdingPeriodMonths: 12 };
        const service = new IndiaCapitalGainsServiceImpl(input, indiaRules);
        const result = service.calculate();

        // Long-term: max(0, 500000 - 125000) = 375000 * 0.125 = 46875
        expect(result.capitalGainTax).toBe(46875);
    });
});
