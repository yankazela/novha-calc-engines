import { SouthAfricaCapitalGainsServiceImpl } from '../src/capital-gains/south-africa/SouthAfricaCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/south-africa/domain/types';

// South Africa 2024-25 CGT rules (individuals)
const southAfricaCapitalGainsRules: Rules = {
    inclusionRate: 0.40,
    annualExclusion: 40000,
    taxBrackets: [
        { from: 0, to: 237100, rate: 0.18 },
        { from: 237100, to: 370500, rate: 0.26 },
        { from: 370500, to: 512800, rate: 0.31 },
        { from: 512800, to: 673000, rate: 0.36 },
        { from: 673000, to: 857900, rate: 0.39 },
        { from: 857900, to: 1817000, rate: 0.41 },
        { from: 1817000, to: null, rate: 0.45 },
    ],
};

describe('SouthAfricaCapitalGainsServiceImpl', () => {
    it('applies annual exclusion of R40,000', () => {
        const input: Input = { capitalGain: 30000, totalTaxableIncome: 30000 };
        const service = new SouthAfricaCapitalGainsServiceImpl(input, southAfricaCapitalGainsRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(0);
        expect(result.capitalGainsTax).toBe(0);
    });

    it('applies 40% inclusion rate after exclusion', () => {
        const input: Input = { capitalGain: 140000, totalTaxableIncome: 140000 };
        const service = new SouthAfricaCapitalGainsServiceImpl(input, southAfricaCapitalGainsRules);
        const result = service.calculate();

        // Net gain = 140000 - 40000 = 100000
        // Taxable gain = 100000 * 0.40 = 40000
        expect(result.taxableGain).toBe(40000);
    });

    it('taxes included gain at marginal rates', () => {
        const input: Input = { capitalGain: 140000, totalTaxableIncome: 140000 };
        const service = new SouthAfricaCapitalGainsServiceImpl(input, southAfricaCapitalGainsRules);
        const result = service.calculate();

        // Taxable gain = 40000, first bracket rate 18%
        expect(result.capitalGainsTax).toBe(40000 * 0.18);
    });

    it('returns zero for zero gain', () => {
        const input: Input = { capitalGain: 0, totalTaxableIncome: 300000 };
        const service = new SouthAfricaCapitalGainsServiceImpl(input, southAfricaCapitalGainsRules);
        const result = service.calculate();

        expect(result.capitalGainsTax).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('returns zero for negative gain', () => {
        const input: Input = { capitalGain: -50000, totalTaxableIncome: 300000 };
        const service = new SouthAfricaCapitalGainsServiceImpl(input, southAfricaCapitalGainsRules);
        const result = service.calculate();

        expect(result.capitalGainsTax).toBe(0);
    });

    it('calculates effective rate based on full gain', () => {
        const input: Input = { capitalGain: 140000, totalTaxableIncome: 140000 };
        const service = new SouthAfricaCapitalGainsServiceImpl(input, southAfricaCapitalGainsRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBe((result.capitalGainsTax / 140000) * 100);
    });

    it('stacks included gain on other income', () => {
        const input: Input = { capitalGain: 540000, totalTaxableIncome: 840000 };
        const service = new SouthAfricaCapitalGainsServiceImpl(input, southAfricaCapitalGainsRules);
        const result = service.calculate();

        // Net gain = 540000 - 40000 = 500000
        // Taxable gain = 500000 * 0.40 = 200000
        // Other income = 300000
        expect(result.taxableGain).toBe(200000);
        expect(result.capitalGainsTax).toBeGreaterThan(0);
    });
});
