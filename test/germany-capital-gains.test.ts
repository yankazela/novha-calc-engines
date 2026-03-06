import { GermanyCapitalGainsServiceImpl } from '../src/capital-gains/germany/GermanyCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/germany/domain/types';

// Germany 2024 Abgeltungsteuer rules
const germanyCapitalGainsRules: Rules = {
    flatTaxRate: 0.25,
    solidaritySurchargeRate: 0.055,
    annualExemption: 1000,
};

describe('GermanyCapitalGainsServiceImpl', () => {
    it('applies annual exemption of €1,000', () => {
        const input: Input = { capitalGain: 800 };
        const service = new GermanyCapitalGainsServiceImpl(input, germanyCapitalGainsRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(0);
        expect(result.totalTax).toBe(0);
    });

    it('taxes gains above exemption at 25% + solidarity', () => {
        const input: Input = { capitalGain: 11000 };
        const service = new GermanyCapitalGainsServiceImpl(input, germanyCapitalGainsRules);
        const result = service.calculate();

        // Taxable = 11000 - 1000 = 10000
        // Tax = 10000 * 25% = 2500
        // Solidarity = 2500 * 5.5% = 137.5
        // Total = 2637.5
        expect(result.taxableGain).toBe(10000);
        expect(result.capitalGainsTax).toBe(2500);
        expect(result.solidaritySurcharge).toBe(137.5);
        expect(result.totalTax).toBe(2637.5);
    });

    it('effective rate accounts for exemption', () => {
        const input: Input = { capitalGain: 11000 };
        const service = new GermanyCapitalGainsServiceImpl(input, germanyCapitalGainsRules);
        const result = service.calculate();

        // Effective rate = 2637.5 / 11000 * 100
        expect(result.effectiveRate).toBeCloseTo((2637.5 / 11000) * 100, 2);
    });

    it('returns two breakdowns for taxable gains', () => {
        const input: Input = { capitalGain: 5000 };
        const service = new GermanyCapitalGainsServiceImpl(input, germanyCapitalGainsRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(2);
        expect(result.breakdowns[0].rate).toBe(0.25);
        expect(result.breakdowns[1].rate).toBe(0.055);
    });

    it('returns zero for zero gain', () => {
        const input: Input = { capitalGain: 0 };
        const service = new GermanyCapitalGainsServiceImpl(input, germanyCapitalGainsRules);
        const result = service.calculate();

        expect(result.totalTax).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('returns zero for negative gain', () => {
        const input: Input = { capitalGain: -5000 };
        const service = new GermanyCapitalGainsServiceImpl(input, germanyCapitalGainsRules);
        const result = service.calculate();

        expect(result.totalTax).toBe(0);
    });

    it('calculates correctly for large gains', () => {
        const input: Input = { capitalGain: 100000 };
        const service = new GermanyCapitalGainsServiceImpl(input, germanyCapitalGainsRules);
        const result = service.calculate();

        const taxable = 99000;
        const cgt = taxable * 0.25;
        const soli = cgt * 0.055;
        expect(result.taxableGain).toBe(taxable);
        expect(result.capitalGainsTax).toBe(cgt);
        expect(result.solidaritySurcharge).toBeCloseTo(soli, 2);
        expect(result.totalTax).toBeCloseTo(cgt + soli, 2);
    });
});
