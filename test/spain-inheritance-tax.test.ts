import { SpainInheritanceTaxServiceImpl } from '../src/inheritance-tax/spain/SpainInheritanceTaxServiceImpl';
import { Input, Rules } from '../src/inheritance-tax/spain/domain/types';

const spainRules: Rules = {
    exemption: 0,
    taxBrackets: [
        { from: 0, to: 7993.46, rate: 0.0765 },
        { from: 7993.46, to: 31956.34, rate: 0.102 },
        { from: 31956.34, to: 79881.68, rate: 0.153 },
        { from: 79881.68, to: 239389.13, rate: 0.2125 },
        { from: 239389.13, to: 398777.54, rate: 0.255 },
        { from: 398777.54, to: 797555.08, rate: 0.2975 },
        { from: 797555.08, to: null, rate: 0.34 },
    ],
};

describe('SpainInheritanceTaxServiceImpl', () => {
    it('returns zero tax for zero estate', () => {
        const input: Input = { estateValue: 0 };
        const service = new SpainInheritanceTaxServiceImpl(input, spainRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
        expect(result.effectiveRate).toBe(0);
    });

    it('returns zero tax when estate is at or below the exemption', () => {
        const rulesWithExemption: Rules = { ...spainRules, exemption: 100000 };
        const input: Input = { estateValue: 80000 };
        const service = new SpainInheritanceTaxServiceImpl(input, rulesWithExemption);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
    });

    it('correctly calculates tax for estate in first bracket', () => {
        const input: Input = { estateValue: 5000 };
        const service = new SpainInheritanceTaxServiceImpl(input, spainRules);
        const result = service.calculate();

        // 0-5000: 5000 * 0.0765 = 382.5
        expect(result.taxableEstate).toBe(5000);
        expect(result.inheritanceTax).toBeCloseTo(382.5, 2);
    });

    it('correctly calculates tax for estate spanning multiple brackets', () => {
        const input: Input = { estateValue: 100000 };
        const service = new SpainInheritanceTaxServiceImpl(input, spainRules);
        const result = service.calculate();

        // 0-7993.46: 7993.46 * 0.0765 ≈ 611.50
        // 7993.46-31956.34: 23962.88 * 0.102 ≈ 2444.21
        // 31956.34-79881.68: 47925.34 * 0.153 ≈ 7332.58
        // 79881.68-100000: 20118.32 * 0.2125 ≈ 4275.14
        // Total ≈ 14663.43
        expect(result.taxableEstate).toBe(100000);
        expect(result.inheritanceTax).toBeCloseTo(14663.43, 0);
    });

    it('effective rate equals inheritance tax divided by estate times 100', () => {
        const input: Input = { estateValue: 100000 };
        const service = new SpainInheritanceTaxServiceImpl(input, spainRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBeCloseTo((result.inheritanceTax / 100000) * 100, 2);
    });

    it('taxable estate is reduced by the exemption amount', () => {
        const rulesWithExemption: Rules = { ...spainRules, exemption: 20000 };
        const input: Input = { estateValue: 50000 };
        const service = new SpainInheritanceTaxServiceImpl(input, rulesWithExemption);
        const result = service.calculate();

        expect(result.taxableEstate).toBe(30000);
    });
});
