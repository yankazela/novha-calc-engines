import { USACapitalGainsServiceImpl } from '../src/capital-gains/usa/USACapitalGainsServiceImpl';
import { Input, Rules } from '../src/capital-gains/usa/domain/types';

// USA 2024 long-term capital gains brackets (single filer)
const usaCapitalGainsRules: Rules = {
    longTermBrackets: [
        { from: 0, to: 47025, rate: 0.00 },
        { from: 47025, to: 518900, rate: 0.15 },
        { from: 518900, to: null, rate: 0.20 },
    ],
    shortTermBrackets: [
        { from: 0, to: 11600, rate: 0.10 },
        { from: 11600, to: 47150, rate: 0.12 },
        { from: 47150, to: 100525, rate: 0.22 },
        { from: 100525, to: 191950, rate: 0.24 },
        { from: 191950, to: 243725, rate: 0.32 },
        { from: 243725, to: 609350, rate: 0.35 },
        { from: 609350, to: null, rate: 0.37 },
    ],
    netInvestmentIncomeTax: { rate: 0.038, threshold: 200000 },
};

describe('USACapitalGainsServiceImpl', () => {
    it('applies 0% long-term rate for low income', () => {
        const input: Input = { capitalGain: 30000, totalTaxableIncome: 30000, holdingPeriodMonths: 24 };
        const service = new USACapitalGainsServiceImpl(input, usaCapitalGainsRules);
        const result = service.calculate();

        expect(result.capitalGainTax).toBe(0);
        expect(result.netInvestmentIncomeTax).toBe(0);
        expect(result.totalTax).toBe(0);
    });

    it('applies 15% long-term rate for mid income', () => {
        const input: Input = { capitalGain: 50000, totalTaxableIncome: 100000, holdingPeriodMonths: 13 };
        const service = new USACapitalGainsServiceImpl(input, usaCapitalGainsRules);
        const result = service.calculate();

        // Other income = 50000, gain falls in 50000-100000 range, all at 15%
        expect(result.capitalGainTax).toBe(50000 * 0.15);
        expect(result.netInvestmentIncomeTax).toBe(0);
    });

    it('applies NIIT for high-income earners', () => {
        const input: Input = { capitalGain: 100000, totalTaxableIncome: 300000, holdingPeriodMonths: 24 };
        const service = new USACapitalGainsServiceImpl(input, usaCapitalGainsRules);
        const result = service.calculate();

        expect(result.netInvestmentIncomeTax).toBe(100000 * 0.038);
        expect(result.totalTax).toBe(result.capitalGainTax + result.netInvestmentIncomeTax);
    });

    it('applies short-term rates for gains held <= 12 months', () => {
        const input: Input = { capitalGain: 50000, totalTaxableIncome: 50000, holdingPeriodMonths: 6 };
        const service = new USACapitalGainsServiceImpl(input, usaCapitalGainsRules);
        const result = service.calculate();

        // Short-term gain taxed as ordinary income from 0-50000
        expect(result.capitalGainTax).toBeGreaterThan(0);
        expect(result.breakdowns.length).toBeGreaterThan(0);
    });

    it('returns zero for zero gain', () => {
        const input: Input = { capitalGain: 0, totalTaxableIncome: 50000, holdingPeriodMonths: 24 };
        const service = new USACapitalGainsServiceImpl(input, usaCapitalGainsRules);
        const result = service.calculate();

        expect(result.totalTax).toBe(0);
        expect(result.effectiveRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('returns zero for negative gain', () => {
        const input: Input = { capitalGain: -5000, totalTaxableIncome: 50000, holdingPeriodMonths: 24 };
        const service = new USACapitalGainsServiceImpl(input, usaCapitalGainsRules);
        const result = service.calculate();

        expect(result.totalTax).toBe(0);
    });

    it('calculates effective rate correctly', () => {
        const input: Input = { capitalGain: 100000, totalTaxableIncome: 100000, holdingPeriodMonths: 24 };
        const service = new USACapitalGainsServiceImpl(input, usaCapitalGainsRules);
        const result = service.calculate();

        expect(result.effectiveRate).toBe((result.totalTax / 100000) * 100);
    });
});
