import { CanadaCapitalGainsServiceImpl } from '../src/capital-gains/canada/CanadaCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/canada/domain/types';

// Canada 2024 federal tax brackets with 50% inclusion rate
const canadaCapitalGainsRules: Rules = {
    inclusionRate: 0.50,
    taxBrackets: [
        { from: 0, to: 55867, rate: 0.15 },
        { from: 55867, to: 111733, rate: 0.205 },
        { from: 111733, to: 154906, rate: 0.26 },
        { from: 154906, to: 220000, rate: 0.29 },
        { from: 220000, to: null, rate: 0.33 },
    ],
};

describe('CanadaCapitalGainsServiceImpl', () => {
    it('applies 50% inclusion rate', () => {
        const input: Input = { capitalGain: 100000, totalTaxableIncome: 100000 };
        const service = new CanadaCapitalGainsServiceImpl(input, canadaCapitalGainsRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(50000);
    });

    it('taxes included gain at marginal rate for low income', () => {
        const input: Input = { capitalGain: 40000, totalTaxableIncome: 40000 };
        const service = new CanadaCapitalGainsServiceImpl(input, canadaCapitalGainsRules);
        const result = service.calculate();

        // Taxable gain = 20000, all in first bracket (15%)
        expect(result.taxableGain).toBe(20000);
        expect(result.capitalGainsTax).toBe(20000 * 0.15);
    });

    it('returns zero for zero gain', () => {
        const input: Input = { capitalGain: 0, totalTaxableIncome: 50000 };
        const service = new CanadaCapitalGainsServiceImpl(input, canadaCapitalGainsRules);
        const result = service.calculate();

        expect(result.capitalGainsTax).toBe(0);
        expect(result.taxableGain).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('returns zero for negative gain', () => {
        const input: Input = { capitalGain: -10000, totalTaxableIncome: 50000 };
        const service = new CanadaCapitalGainsServiceImpl(input, canadaCapitalGainsRules);
        const result = service.calculate();

        expect(result.capitalGainsTax).toBe(0);
    });

    it('calculates effective rate based on full gain', () => {
        const input: Input = { capitalGain: 100000, totalTaxableIncome: 100000 };
        const service = new CanadaCapitalGainsServiceImpl(input, canadaCapitalGainsRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBe((result.capitalGainsTax / 100000) * 100);
    });

    it('stacks gain on top of other income', () => {
        const input: Input = { capitalGain: 20000, totalTaxableIncome: 70000 };
        const service = new CanadaCapitalGainsServiceImpl(input, canadaCapitalGainsRules);
        const result = service.calculate();

        // Other income = 50000, taxable gain = 10000
        // 10000 falls in first bracket (50000-55867 = 5867 at 15%, rest at 20.5%)
        expect(result.taxableGain).toBe(10000);
        expect(result.capitalGainsTax).toBeGreaterThan(0);
    });
});
