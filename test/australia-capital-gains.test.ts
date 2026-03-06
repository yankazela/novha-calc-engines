import { AustraliaCapitalGainsServiceImpl } from '../src/capital-gains/australia/AustraliaCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/australia/domain/types';

// Australia 2024-25 individual marginal tax rates + 50% CGT discount
const australiaCapitalGainsRules: Rules = {
    cgtDiscount: 0.50,
    cgtDiscountMinMonths: 12,
    taxBrackets: [
        { from: 0, to: 18200, rate: 0.00 },
        { from: 18200, to: 45000, rate: 0.16 },
        { from: 45000, to: 135000, rate: 0.30 },
        { from: 135000, to: 190000, rate: 0.37 },
        { from: 190000, to: null, rate: 0.45 },
    ],
};

describe('AustraliaCapitalGainsServiceImpl', () => {
    it('applies 50% CGT discount for assets held >= 12 months', () => {
        const input: Input = { capitalGain: 100000, totalTaxableIncome: 100000, holdingPeriodMonths: 24 };
        const service = new AustraliaCapitalGainsServiceImpl(input, australiaCapitalGainsRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(50000);
    });

    it('no discount for assets held < 12 months', () => {
        const input: Input = { capitalGain: 100000, totalTaxableIncome: 100000, holdingPeriodMonths: 6 };
        const service = new AustraliaCapitalGainsServiceImpl(input, australiaCapitalGainsRules);
        const result = service.calculate();

        expect(result.taxableGain).toBe(100000);
    });

    it('taxes discounted gain at marginal rates', () => {
        const input: Input = { capitalGain: 40000, totalTaxableIncome: 40000, holdingPeriodMonths: 18 };
        const service = new AustraliaCapitalGainsServiceImpl(input, australiaCapitalGainsRules);
        const result = service.calculate();

        // Taxable gain = 20000, no other income
        // 18200 at 0% = 0, 1800 at 16% = 288
        expect(result.taxableGain).toBe(20000);
        expect(result.capitalGainsTax).toBeCloseTo(288, 2);
    });

    it('returns zero for zero gain', () => {
        const input: Input = { capitalGain: 0, totalTaxableIncome: 50000, holdingPeriodMonths: 24 };
        const service = new AustraliaCapitalGainsServiceImpl(input, australiaCapitalGainsRules);
        const result = service.calculate();

        expect(result.capitalGainsTax).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('returns zero for negative gain', () => {
        const input: Input = { capitalGain: -5000, totalTaxableIncome: 50000, holdingPeriodMonths: 24 };
        const service = new AustraliaCapitalGainsServiceImpl(input, australiaCapitalGainsRules);
        const result = service.calculate();

        expect(result.capitalGainsTax).toBe(0);
    });

    it('stacks gain on top of other income', () => {
        const input: Input = { capitalGain: 20000, totalTaxableIncome: 70000, holdingPeriodMonths: 24 };
        const service = new AustraliaCapitalGainsServiceImpl(input, australiaCapitalGainsRules);
        const result = service.calculate();

        // Other income = 50000, taxable gain = 10000 (50% discount)
        // Gain falls in 50000-60000 range, all at 30%
        expect(result.taxableGain).toBe(10000);
        expect(result.capitalGainsTax).toBe(10000 * 0.30);
    });

    it('calculates effective rate based on full gain', () => {
        const input: Input = { capitalGain: 20000, totalTaxableIncome: 70000, holdingPeriodMonths: 24 };
        const service = new AustraliaCapitalGainsServiceImpl(input, australiaCapitalGainsRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBe((result.capitalGainsTax / 20000) * 100);
    });
});
