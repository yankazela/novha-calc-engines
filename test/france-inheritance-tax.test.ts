import { FranceInheritanceTaxServiceImpl } from '../src/inheritance-tax/france/FranceInheritanceTaxServiceImpl';
import { Input, Rules } from '../src/inheritance-tax/france/domain/types';

const franceRules: Rules = {
    relationships: {
        spouse: {
            exemption: Infinity,
            brackets: [],
        },
        child: {
            exemption: 100000,
            brackets: [
                { from: 0, to: 8072, rate: 0.05 },
                { from: 8072, to: 12109, rate: 0.10 },
                { from: 12109, to: 15932, rate: 0.15 },
                { from: 15932, to: 552324, rate: 0.20 },
                { from: 552324, to: 902838, rate: 0.30 },
                { from: 902838, to: 1805677, rate: 0.40 },
                { from: 1805677, to: null, rate: 0.45 },
            ],
        },
        sibling: {
            exemption: 15932,
            brackets: [
                { from: 0, to: 24430, rate: 0.35 },
                { from: 24430, to: null, rate: 0.45 },
            ],
        },
        other: {
            exemption: 1594,
            brackets: [
                { from: 0, to: null, rate: 0.60 },
            ],
        },
    },
};

describe('FranceInheritanceTaxServiceImpl', () => {
    it('returns zero tax for spouse inheritance', () => {
        const input: Input = { estateValue: 5000000, relationship: 'spouse' };
        const service = new FranceInheritanceTaxServiceImpl(input, franceRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
    });

    it('returns zero tax for child inheritance below exemption', () => {
        const input: Input = { estateValue: 80000, relationship: 'child' };
        const service = new FranceInheritanceTaxServiceImpl(input, franceRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('correctly calculates child inheritance tax above exemption', () => {
        const input: Input = { estateValue: 108072, relationship: 'child' }; // 8072 above exemption
        const service = new FranceInheritanceTaxServiceImpl(input, franceRules);
        const result = service.calculate();

        // 8072 * 0.05 = 403.60
        expect(result.taxableEstate).toBe(8072);
        expect(result.inheritanceTax).toBeCloseTo(403.60, 2);
    });

    it('applies higher rates for sibling inheritance', () => {
        const input: Input = { estateValue: 40362, relationship: 'sibling' }; // 24430 above exemption
        const service = new FranceInheritanceTaxServiceImpl(input, franceRules);
        const result = service.calculate();

        // 24430 * 0.35 = 8550.50
        expect(result.taxableEstate).toBe(24430);
        expect(result.inheritanceTax).toBeCloseTo(8550.50, 2);
    });

    it('applies 60% flat rate for unrelated persons', () => {
        const input: Input = { estateValue: 101594, relationship: 'other' }; // 100000 above exemption
        const service = new FranceInheritanceTaxServiceImpl(input, franceRules);
        const result = service.calculate();

        // 100000 * 0.60 = 60000
        expect(result.taxableEstate).toBe(100000);
        expect(result.inheritanceTax).toBe(60000);
    });

    it('returns zero for zero estate', () => {
        const input: Input = { estateValue: 0, relationship: 'child' };
        const service = new FranceInheritanceTaxServiceImpl(input, franceRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('calculates effective rate correctly', () => {
        const input: Input = { estateValue: 200000, relationship: 'child' };
        const service = new FranceInheritanceTaxServiceImpl(input, franceRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBe((result.inheritanceTax / 200000) * 100);
    });
});
