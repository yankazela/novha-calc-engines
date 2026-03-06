import { UKCapitalGainsServiceImpl } from '../src/capital-gains/uk/UKCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/uk/domain/types';

// UK 2024-25 CGT rules (non-residential assets)
const ukCapitalGainsRules: Rules = {
    annualExemption: 3000,
    basicRate: 0.10,
    higherRate: 0.20,
    basicRateLimit: 37700,
};

describe('UKCapitalGainsServiceImpl', () => {
    it('applies annual exemption', () => {
        const input: Input = { capitalGain: 2000, totalTaxableIncome: 20000 };
        const service = new UKCapitalGainsServiceImpl(input, ukCapitalGainsRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(0);
        expect(result.capitalGainsTax).toBe(0);
    });

    it('applies basic rate for basic-rate taxpayer', () => {
        const input: Input = { capitalGain: 13000, totalTaxableIncome: 20000 };
        const service = new UKCapitalGainsServiceImpl(input, ukCapitalGainsRules);
        const result = service.calculate();

        // Taxable gain = 13000 - 3000 = 10000
        // Basic rate remaining = 37700 - 20000 = 17700 (enough for all)
        expect(result.taxableGain).toBe(10000);
        expect(result.capitalGainsTax).toBe(10000 * 0.10);
    });

    it('applies higher rate for higher-rate taxpayer', () => {
        const input: Input = { capitalGain: 53000, totalTaxableIncome: 50000 };
        const service = new UKCapitalGainsServiceImpl(input, ukCapitalGainsRules);
        const result = service.calculate();

        // Taxable gain = 53000 - 3000 = 50000, all at higher rate (income > basic rate limit)
        expect(result.taxableGain).toBe(50000);
        expect(result.capitalGainsTax).toBe(50000 * 0.20);
    });

    it('splits between basic and higher rate', () => {
        const input: Input = { capitalGain: 23000, totalTaxableIncome: 30000 };
        const service = new UKCapitalGainsServiceImpl(input, ukCapitalGainsRules);
        const result = service.calculate();

        // Taxable gain = 23000 - 3000 = 20000
        // Basic rate remaining = 37700 - 30000 = 7700
        // 7700 at 10% = 770, 12300 at 20% = 2460
        expect(result.taxableGain).toBe(20000);
        expect(result.capitalGainsTax).toBe(7700 * 0.10 + 12300 * 0.20);
    });

    it('returns zero for zero gain', () => {
        const input: Input = { capitalGain: 0, totalTaxableIncome: 50000 };
        const service = new UKCapitalGainsServiceImpl(input, ukCapitalGainsRules);
        const result = service.calculate();

        expect(result.capitalGainsTax).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('returns zero for negative gain', () => {
        const input: Input = { capitalGain: -5000, totalTaxableIncome: 50000 };
        const service = new UKCapitalGainsServiceImpl(input, ukCapitalGainsRules);
        const result = service.calculate();

        expect(result.capitalGainsTax).toBe(0);
    });

    it('calculates effective rate based on full gain', () => {
        const input: Input = { capitalGain: 53000, totalTaxableIncome: 50000 };
        const service = new UKCapitalGainsServiceImpl(input, ukCapitalGainsRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBe((result.capitalGainsTax / 53000) * 100);
    });
});
