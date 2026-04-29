import { NetherlandsInheritanceTaxServiceImpl } from '../src/inheritance-tax/netherlands/NetherlandsInheritanceTaxServiceImpl';
import { Input, Rules } from '../src/inheritance-tax/netherlands/domain/types';

const netherlandsRules: Rules = {
    taxClasses: {
        Partner: {
            exemption: 795156,
            brackets: [
                { from: 0, to: 138642, rate: 0.10 },
                { from: 138642, to: null, rate: 0.20 },
            ],
        },
        Child: {
            exemption: 25187,
            brackets: [
                { from: 0, to: 138642, rate: 0.10 },
                { from: 138642, to: null, rate: 0.20 },
            ],
        },
        Other: {
            exemption: 2658,
            brackets: [
                { from: 0, to: 138642, rate: 0.30 },
                { from: 138642, to: null, rate: 0.40 },
            ],
        },
    },
};

describe('NetherlandsInheritanceTaxServiceImpl', () => {
    it('returns zero tax for Partner estate below exemption', () => {
        const input: Input = { estateValue: 500000, taxClass: 'Partner' };
        const service = new NetherlandsInheritanceTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
    });

    it('correctly calculates Partner tax for estate above exemption', () => {
        const input: Input = { estateValue: 933798, taxClass: 'Partner' }; // 138642 above exemption
        const service = new NetherlandsInheritanceTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        // 138642 * 0.10 = 13864.2
        expect(result.taxableEstate).toBe(138642);
        expect(result.inheritanceTax).toBeCloseTo(13864.2, 2);
    });

    it('correctly calculates Child tax with lower exemption', () => {
        const input: Input = { estateValue: 125187, taxClass: 'Child' }; // 100000 above exemption
        const service = new NetherlandsInheritanceTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        // 100000 * 0.10 = 10000
        expect(result.taxableEstate).toBe(100000);
        expect(result.inheritanceTax).toBe(10000);
    });

    it('correctly calculates Other class with higher rates', () => {
        const input: Input = { estateValue: 102658, taxClass: 'Other' }; // 100000 above exemption
        const service = new NetherlandsInheritanceTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        // 100000 * 0.30 = 30000
        expect(result.taxableEstate).toBe(100000);
        expect(result.inheritanceTax).toBe(30000);
    });

    it('returns zero for zero estate', () => {
        const input: Input = { estateValue: 0, taxClass: 'Child' };
        const service = new NetherlandsInheritanceTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        expect(result.inheritanceTax).toBe(0);
    });

    it('calculates effective rate correctly', () => {
        const input: Input = { estateValue: 1000000, taxClass: 'Child' };
        const service = new NetherlandsInheritanceTaxServiceImpl(input, netherlandsRules);
        const result = service.calculate();
        expect(result.effectiveRate).toBe((result.inheritanceTax / 1000000) * 100);
    });
});
