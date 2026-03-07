import { CanadaInheritanceTaxServiceImpl } from '../src/inheritance-tax/canada/CanadaInheritanceTaxServiceImpl';
import { Input, Rules } from '../src/inheritance-tax/canada/domain/types';

const canadaRules: Rules = {
    inclusionRate: 0.50,
    taxBrackets: [
        { from: 0, to: 55867, rate: 0.15 },
        { from: 55867, to: 111733, rate: 0.205 },
        { from: 111733, to: 154906, rate: 0.26 },
        { from: 154906, to: 220000, rate: 0.29 },
        { from: 220000, to: null, rate: 0.33 },
    ],
};

describe('CanadaInheritanceTaxServiceImpl', () => {
    it('returns zero tax when no capital gain (estate = cost base)', () => {
        const input: Input = { estateValue: 500000, adjustedCostBase: 500000 };
        const service = new CanadaInheritanceTaxServiceImpl(input, canadaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
    });

    it('returns zero tax when estate is below cost base', () => {
        const input: Input = { estateValue: 300000, adjustedCostBase: 500000 };
        const service = new CanadaInheritanceTaxServiceImpl(input, canadaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('correctly calculates tax on capital gain at death', () => {
        const input: Input = { estateValue: 600000, adjustedCostBase: 400000 };
        const service = new CanadaInheritanceTaxServiceImpl(input, canadaRules);
        const result = service.calculate();

        // Gain = 200000, taxable gain = 200000 * 0.5 = 100000
        // 55867 * 0.15 = 8380.05
        // (100000 - 55867) * 0.205 = 44133 * 0.205 = 9047.265
        // Total ≈ 17427.315
        expect(result.taxableEstate).toBe(100000);
        expect(result.inheritanceTax).toBeCloseTo(17427.315, 2);
    });

    it('returns zero for zero estate', () => {
        const input: Input = { estateValue: 0, adjustedCostBase: 0 };
        const service = new CanadaInheritanceTaxServiceImpl(input, canadaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('calculates effective rate based on total gain', () => {
        const input: Input = { estateValue: 600000, adjustedCostBase: 400000 };
        const service = new CanadaInheritanceTaxServiceImpl(input, canadaRules);
        const result = service.calculate();

        // Effective rate is relative to the gain (200000), not the included portion
        expect(result.effectiveRate).toBeCloseTo((result.inheritanceTax / 200000) * 100, 2);
    });
});
