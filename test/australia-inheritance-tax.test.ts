import { AustraliaInheritanceTaxServiceImpl } from '../src/inheritance-tax/australia/AustraliaInheritanceTaxServiceImpl';
import { Input, Rules } from '../src/inheritance-tax/australia/domain/types';

const australiaRules: Rules = {
    applicable: false,
};

describe('AustraliaInheritanceTaxServiceImpl', () => {
    it('returns zero tax for any estate value', () => {
        const input: Input = { estateValue: 1000000 };
        const service = new AustraliaInheritanceTaxServiceImpl(input, australiaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
        expect(result.effectiveRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('returns zero tax for very large estate', () => {
        const input: Input = { estateValue: 100000000 };
        const service = new AustraliaInheritanceTaxServiceImpl(input, australiaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('returns zero tax for zero estate', () => {
        const input: Input = { estateValue: 0 };
        const service = new AustraliaInheritanceTaxServiceImpl(input, australiaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });
});
