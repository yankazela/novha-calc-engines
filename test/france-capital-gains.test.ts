import { FranceCapitalGainsServiceImpl } from '../src/capital-gains/france/FranceCapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/france/domain/types';

// France PFU (Prélèvement Forfaitaire Unique) 2024
const franceCapitalGainsRules: Rules = {
    flatTaxRate: 0.128,
    socialContributionsRate: 0.172,
};

describe('FranceCapitalGainsServiceImpl', () => {
    it('applies flat tax rate and social contributions', () => {
        const input: Input = { capitalGain: 100000 };
        const service = new FranceCapitalGainsServiceImpl(input, franceCapitalGainsRules);
        const result = service.calculate();

        expect(result.capitalGainTax).toBe(12800);
        expect(result.socialContributions).toBe(17200);
        expect(result.totalTax).toBe(30000);
    });

    it('effective rate is 30% (12.8% + 17.2%)', () => {
        const input: Input = { capitalGain: 50000 };
        const service = new FranceCapitalGainsServiceImpl(input, franceCapitalGainsRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBeCloseTo(30, 1);
    });

    it('returns two breakdowns (income tax + social)', () => {
        const input: Input = { capitalGain: 100000 };
        const service = new FranceCapitalGainsServiceImpl(input, franceCapitalGainsRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(2);
        expect(result.breakdowns[0].rate).toBe(0.128);
        expect(result.breakdowns[1].rate).toBe(0.172);
    });

    it('returns zero for zero gain', () => {
        const input: Input = { capitalGain: 0 };
        const service = new FranceCapitalGainsServiceImpl(input, franceCapitalGainsRules);
        const result = service.calculate();

        expect(result.totalTax).toBe(0);
        expect(result.effectiveRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('returns zero for negative gain', () => {
        const input: Input = { capitalGain: -10000 };
        const service = new FranceCapitalGainsServiceImpl(input, franceCapitalGainsRules);
        const result = service.calculate();

        expect(result.totalTax).toBe(0);
    });

    it('scales linearly with gain amount', () => {
        const input1: Input = { capitalGain: 100000 };
        const input2: Input = { capitalGain: 200000 };

        const result1 = new FranceCapitalGainsServiceImpl(input1, franceCapitalGainsRules).calculate();
        const result2 = new FranceCapitalGainsServiceImpl(input2, franceCapitalGainsRules).calculate();

        expect(result2.totalTax).toBe(result1.totalTax * 2);
    });
});
