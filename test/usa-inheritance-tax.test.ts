import { USAInheritanceTaxServiceImpl } from '../src/inheritance-tax/usa/USAInheritanceTaxServiceImpl';
import { Input, Rules } from '../src/inheritance-tax/usa/domain/types';

const usaRules: Rules = {
    exemption: 13610000,
    taxBrackets: [
        { from: 0, to: 10000, rate: 0.18 },
        { from: 10000, to: 20000, rate: 0.20 },
        { from: 20000, to: 40000, rate: 0.22 },
        { from: 40000, to: 60000, rate: 0.24 },
        { from: 60000, to: 80000, rate: 0.26 },
        { from: 80000, to: 100000, rate: 0.28 },
        { from: 100000, to: 150000, rate: 0.30 },
        { from: 150000, to: 250000, rate: 0.32 },
        { from: 250000, to: 500000, rate: 0.34 },
        { from: 500000, to: 750000, rate: 0.36 },
        { from: 750000, to: 1000000, rate: 0.38 },
        { from: 1000000, to: null, rate: 0.40 },
    ],
};

describe('USAInheritanceTaxServiceImpl', () => {
    it('returns zero tax for estate below exemption', () => {
        const input: Input = { estateValue: 10000000 };
        const service = new USAInheritanceTaxServiceImpl(input, usaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('returns zero tax for estate at exactly the exemption', () => {
        const input: Input = { estateValue: 13610000 };
        const service = new USAInheritanceTaxServiceImpl(input, usaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
    });

    it('correctly calculates tax for estate just above exemption', () => {
        const input: Input = { estateValue: 13620000 }; // 10000 above exemption
        const service = new USAInheritanceTaxServiceImpl(input, usaRules);
        const result = service.calculate();

        // 10000 * 0.18 = 1800
        expect(result.taxableEstate).toBe(10000);
        expect(result.inheritanceTax).toBe(1800);
    });

    it('correctly calculates tax with multiple brackets', () => {
        const input: Input = { estateValue: 13660000 }; // 50000 above exemption
        const service = new USAInheritanceTaxServiceImpl(input, usaRules);
        const result = service.calculate();

        // 10000 * 0.18 = 1800
        // 10000 * 0.20 = 2000
        // 20000 * 0.22 = 4400
        // 10000 * 0.24 = 2400
        // Total = 10600
        expect(result.taxableEstate).toBe(50000);
        expect(result.inheritanceTax).toBe(10600);
    });

    it('returns zero for zero estate', () => {
        const input: Input = { estateValue: 0 };
        const service = new USAInheritanceTaxServiceImpl(input, usaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.effectiveRate).toBe(0);
    });

    it('returns zero for negative estate', () => {
        const input: Input = { estateValue: -100000 };
        const service = new USAInheritanceTaxServiceImpl(input, usaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('calculates effective rate correctly', () => {
        const input: Input = { estateValue: 14610000 }; // 1,000,000 above exemption
        const service = new USAInheritanceTaxServiceImpl(input, usaRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBe((result.inheritanceTax / 14610000) * 100);
    });
});
