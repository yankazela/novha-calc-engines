import { UKInheritanceTaxServiceImpl } from '../src/inheritance-tax/uk/UKInheritanceTaxServiceImpl';
import { Input, Rules } from '../src/inheritance-tax/uk/domain/types';

const ukRules: Rules = {
    nilRateBand: 325000,
    standardRate: 0.40,
    charityRate: 0.36,
    charityThreshold: 10,
};

describe('UKInheritanceTaxServiceImpl', () => {
    it('returns zero tax for estate below nil-rate band', () => {
        const input: Input = { estateValue: 200000, charitableGivingPercent: 0 };
        const service = new UKInheritanceTaxServiceImpl(input, ukRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
    });

    it('returns zero tax for estate at nil-rate band', () => {
        const input: Input = { estateValue: 325000, charitableGivingPercent: 0 };
        const service = new UKInheritanceTaxServiceImpl(input, ukRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('applies 40% rate for estate above nil-rate band', () => {
        const input: Input = { estateValue: 500000, charitableGivingPercent: 0 };
        const service = new UKInheritanceTaxServiceImpl(input, ukRules);
        const result = service.calculate();

        // (500000 - 325000) * 0.40 = 70000
        expect(result.taxableEstate).toBe(175000);
        expect(result.inheritanceTax).toBe(70000);
    });

    it('applies 36% charity rate when charitable giving >= 10%', () => {
        const input: Input = { estateValue: 500000, charitableGivingPercent: 10 };
        const service = new UKInheritanceTaxServiceImpl(input, ukRules);
        const result = service.calculate();

        // (500000 - 325000) * 0.36 = 63000
        expect(result.taxableEstate).toBe(175000);
        expect(result.inheritanceTax).toBe(63000);
    });

    it('applies standard rate when charitable giving < 10%', () => {
        const input: Input = { estateValue: 500000, charitableGivingPercent: 9 };
        const service = new UKInheritanceTaxServiceImpl(input, ukRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(70000);
    });

    it('returns zero for zero estate', () => {
        const input: Input = { estateValue: 0, charitableGivingPercent: 0 };
        const service = new UKInheritanceTaxServiceImpl(input, ukRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('calculates effective rate correctly', () => {
        const input: Input = { estateValue: 1000000, charitableGivingPercent: 0 };
        const service = new UKInheritanceTaxServiceImpl(input, ukRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBe((result.inheritanceTax / 1000000) * 100);
    });
});
