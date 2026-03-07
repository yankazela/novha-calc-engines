import { GermanyInheritanceTaxServiceImpl } from '../src/inheritance-tax/germany/GermanyInheritanceTaxServiceImpl';
import { Input, Rules } from '../src/inheritance-tax/germany/domain/types';

const germanyRules: Rules = {
    taxClasses: {
        I: {
            exemption: 500000,
            brackets: [
                { from: 0, to: 75000, rate: 0.07 },
                { from: 75000, to: 300000, rate: 0.11 },
                { from: 300000, to: 600000, rate: 0.15 },
                { from: 600000, to: 6000000, rate: 0.19 },
                { from: 6000000, to: 13000000, rate: 0.23 },
                { from: 13000000, to: 26000000, rate: 0.27 },
                { from: 26000000, to: null, rate: 0.30 },
            ],
        },
        II: {
            exemption: 20000,
            brackets: [
                { from: 0, to: 75000, rate: 0.15 },
                { from: 75000, to: 300000, rate: 0.20 },
                { from: 300000, to: 600000, rate: 0.25 },
                { from: 600000, to: 6000000, rate: 0.30 },
                { from: 6000000, to: 13000000, rate: 0.35 },
                { from: 13000000, to: 26000000, rate: 0.40 },
                { from: 26000000, to: null, rate: 0.43 },
            ],
        },
        III: {
            exemption: 20000,
            brackets: [
                { from: 0, to: 75000, rate: 0.30 },
                { from: 75000, to: 300000, rate: 0.30 },
                { from: 300000, to: 600000, rate: 0.30 },
                { from: 600000, to: 6000000, rate: 0.30 },
                { from: 6000000, to: 13000000, rate: 0.50 },
                { from: 13000000, to: 26000000, rate: 0.50 },
                { from: 26000000, to: null, rate: 0.50 },
            ],
        },
    },
};

describe('GermanyInheritanceTaxServiceImpl', () => {
    it('returns zero tax for Class I estate below exemption', () => {
        const input: Input = { estateValue: 400000, taxClass: 'I' };
        const service = new GermanyInheritanceTaxServiceImpl(input, germanyRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
    });

    it('correctly calculates Class I tax for estate above exemption', () => {
        const input: Input = { estateValue: 575000, taxClass: 'I' }; // 75000 above exemption
        const service = new GermanyInheritanceTaxServiceImpl(input, germanyRules);
        const result = service.calculate();

        // 75000 * 0.07 = 5250
        expect(result.taxableEstate).toBe(75000);
        expect(result.inheritanceTax).toBeCloseTo(5250, 2);
    });

    it('correctly calculates Class II tax with lower exemption', () => {
        const input: Input = { estateValue: 95000, taxClass: 'II' }; // 75000 above exemption
        const service = new GermanyInheritanceTaxServiceImpl(input, germanyRules);
        const result = service.calculate();

        // 75000 * 0.15 = 11250
        expect(result.taxableEstate).toBe(75000);
        expect(result.inheritanceTax).toBe(11250);
    });

    it('correctly calculates Class III tax with higher rates', () => {
        const input: Input = { estateValue: 95000, taxClass: 'III' }; // 75000 above exemption
        const service = new GermanyInheritanceTaxServiceImpl(input, germanyRules);
        const result = service.calculate();

        // 75000 * 0.30 = 22500
        expect(result.taxableEstate).toBe(75000);
        expect(result.inheritanceTax).toBe(22500);
    });

    it('returns zero for zero estate', () => {
        const input: Input = { estateValue: 0, taxClass: 'I' };
        const service = new GermanyInheritanceTaxServiceImpl(input, germanyRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('calculates effective rate correctly', () => {
        const input: Input = { estateValue: 1000000, taxClass: 'I' };
        const service = new GermanyInheritanceTaxServiceImpl(input, germanyRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBe((result.inheritanceTax / 1000000) * 100);
    });
});
