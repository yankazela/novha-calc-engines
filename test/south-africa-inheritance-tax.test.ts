import { SouthAfricaInheritanceTaxServiceImpl } from '../src/inheritance-tax/south-africa/SouthAfricaInheritanceTaxServiceImpl';
import { Input, Rules } from '../src/inheritance-tax/south-africa/domain/types';

const southAfricaRules: Rules = {
    primaryAbatement: 3500000,
    taxBrackets: [
        { from: 0, to: 30000000, rate: 0.20 },
        { from: 30000000, to: null, rate: 0.25 },
    ],
};

describe('SouthAfricaInheritanceTaxServiceImpl', () => {
    it('returns zero tax for estate below primary abatement', () => {
        const input: Input = { estateValue: 3000000, deductions: 0 };
        const service = new SouthAfricaInheritanceTaxServiceImpl(input, southAfricaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
        expect(result.taxableEstate).toBe(0);
    });

    it('returns zero tax for estate at primary abatement', () => {
        const input: Input = { estateValue: 3500000, deductions: 0 };
        const service = new SouthAfricaInheritanceTaxServiceImpl(input, southAfricaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('applies 20% rate for estate above abatement within first bracket', () => {
        const input: Input = { estateValue: 13500000, deductions: 0 };
        const service = new SouthAfricaInheritanceTaxServiceImpl(input, southAfricaRules);
        const result = service.calculate();

        // Taxable = 13500000 - 3500000 = 10000000
        // 10000000 * 0.20 = 2000000
        expect(result.taxableEstate).toBe(10000000);
        expect(result.inheritanceTax).toBe(2000000);
    });

    it('applies 25% rate for amounts above R30M bracket', () => {
        const input: Input = { estateValue: 43500000, deductions: 0 };
        const service = new SouthAfricaInheritanceTaxServiceImpl(input, southAfricaRules);
        const result = service.calculate();

        // Taxable = 43500000 - 3500000 = 40000000
        // 30000000 * 0.20 = 6000000
        // 10000000 * 0.25 = 2500000
        // Total = 8500000
        expect(result.taxableEstate).toBe(40000000);
        expect(result.inheritanceTax).toBe(8500000);
    });

    it('deductions reduce taxable estate', () => {
        const input: Input = { estateValue: 13500000, deductions: 5000000 };
        const service = new SouthAfricaInheritanceTaxServiceImpl(input, southAfricaRules);
        const result = service.calculate();

        // Net estate = 13500000 - 5000000 = 8500000
        // Taxable = 8500000 - 3500000 = 5000000
        // 5000000 * 0.20 = 1000000
        expect(result.taxableEstate).toBe(5000000);
        expect(result.inheritanceTax).toBe(1000000);
    });

    it('returns zero for zero estate', () => {
        const input: Input = { estateValue: 0, deductions: 0 };
        const service = new SouthAfricaInheritanceTaxServiceImpl(input, southAfricaRules);
        const result = service.calculate();

        expect(result.inheritanceTax).toBe(0);
    });

    it('calculates effective rate correctly', () => {
        const input: Input = { estateValue: 13500000, deductions: 0 };
        const service = new SouthAfricaInheritanceTaxServiceImpl(input, southAfricaRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBe((result.inheritanceTax / 13500000) * 100);
    });
});
