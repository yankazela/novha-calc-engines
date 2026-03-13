import { JapanInheritanceTaxServiceImpl } from '../src/inheritance-tax/japan/JapanInheritanceTaxServiceImpl';
import { Input, Rules } from '../src/inheritance-tax/japan/domain/types';

const japanRules: Rules = {
    baseExemption: 30000000,
    perHeirExemption: 6000000,
    taxBrackets: [
        { from: 0, to: 10000000, rate: 0.10 },
        { from: 10000000, to: 30000000, rate: 0.15 },
        { from: 30000000, to: 50000000, rate: 0.20 },
        { from: 50000000, to: 100000000, rate: 0.30 },
        { from: 100000000, to: 200000000, rate: 0.40 },
        { from: 200000000, to: 300000000, rate: 0.45 },
        { from: 300000000, to: 600000000, rate: 0.50 },
        { from: 600000000, to: null, rate: 0.55 },
    ],
};

describe('JapanInheritanceTaxServiceImpl', () => {
    it('returns zero tax for zero estate', () => {
        const input: Input = { estateValue: 0, numberOfStatutoryHeirs: 1 };
        const service = new JapanInheritanceTaxServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
        expect(result.effectiveRate).toBe(0);
    });

    it('returns zero tax when estate is below the total exemption (1 heir)', () => {
        // 1 heir: exemption = 30000000 + 6000000 * 1 = 36000000
        // estate = 35000000 < 36000000 → no tax
        const input: Input = { estateValue: 35000000, numberOfStatutoryHeirs: 1 };
        const service = new JapanInheritanceTaxServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
    });

    it('correctly calculates tax for estate above the exemption (2 heirs)', () => {
        // 2 heirs: exemption = 30000000 + 6000000 * 2 = 42000000
        // taxable = 100000000 - 42000000 = 58000000
        // 0-10000000: 10000000 * 0.10 = 1000000
        // 10000000-30000000: 20000000 * 0.15 = 3000000
        // 30000000-50000000: 20000000 * 0.20 = 4000000
        // 50000000-58000000: 8000000 * 0.30 = 2400000
        // Total = 10400000
        const input: Input = { estateValue: 100000000, numberOfStatutoryHeirs: 2 };
        const service = new JapanInheritanceTaxServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.taxableEstate).toBe(58000000);
        expect(result.inheritanceTax).toBeCloseTo(10400000, 2);
    });

    it('effective rate equals inheritance tax divided by estate times 100', () => {
        const input: Input = { estateValue: 100000000, numberOfStatutoryHeirs: 2 };
        const service = new JapanInheritanceTaxServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBeCloseTo((result.inheritanceTax / 100000000) * 100, 2);
    });

    it('more heirs increases the exemption and reduces taxable estate', () => {
        const input1: Input = { estateValue: 100000000, numberOfStatutoryHeirs: 1 };
        const input3: Input = { estateValue: 100000000, numberOfStatutoryHeirs: 3 };

        const tax1 = new JapanInheritanceTaxServiceImpl(input1, japanRules).calculate().inheritanceTax;
        const tax3 = new JapanInheritanceTaxServiceImpl(input3, japanRules).calculate().inheritanceTax;

        expect(tax3).toBeLessThan(tax1);
    });
});
