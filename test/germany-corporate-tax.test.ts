import { GermanyCorporateTaxServiceImpl } from '../src/corporate/germany/GermanyCorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/germany/domain/types';

// Germany corporate tax rules
const germanyCorporateRules: Rules = {
    corporateIncomeTax: { rate: 0.15 },
    solidaritySurcharge: { rate: 0.055 },
    tradeTax: { multiplier: 0.035, assessmentRate: 4.0 },
};

describe('GermanyCorporateTaxServiceImpl', () => {
    it('correctly calculates all components for €100,000 taxable income', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new GermanyCorporateTaxServiceImpl(input, germanyCorporateRules);
        const result = service.calculate();

        // Corp tax = 100000 * 15% = 15000
        // Solidarity = 15000 * 5.5% = 825
        // Trade tax = 100000 * 3.5% * 4.0 = 14000
        // Total = 29825
        expect(result.corporateTax).toBe(15000);
        expect(result.solidaritySurcharge).toBe(825);
        expect(result.tradeTax).toBeCloseTo(14000, 2);
        expect(result.totalTax).toBeCloseTo(29825, 2);
    });

    it('calculates effective tax rate correctly', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new GermanyCorporateTaxServiceImpl(input, germanyCorporateRules);
        const result = service.calculate();

        // Effective rate = 29825 / 100000 * 100 = 29.825%
        expect(result.effectiveTaxRate).toBeCloseTo(29.825, 3);
    });

    it('returns zero for all components when taxable income is zero', () => {
        const input: Input = { taxableIncome: 0 };
        const service = new GermanyCorporateTaxServiceImpl(input, germanyCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(0);
        expect(result.solidaritySurcharge).toBe(0);
        expect(result.tradeTax).toBe(0);
        expect(result.totalTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('returns three breakdown entries for positive income', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new GermanyCorporateTaxServiceImpl(input, germanyCorporateRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(3);
    });

    it('breakdown amounts match computed values', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new GermanyCorporateTaxServiceImpl(input, germanyCorporateRules);
        const result = service.calculate();

        expect(result.breakdowns[0].amount).toBe(15000);
        expect(result.breakdowns[1].amount).toBe(825);
        expect(result.breakdowns[2].amount).toBeCloseTo(14000, 2);
    });

    it('scales proportionally for different income levels', () => {
        const input: Input = { taxableIncome: 200000 };
        const service = new GermanyCorporateTaxServiceImpl(input, germanyCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(30000);
        expect(result.solidaritySurcharge).toBe(1650);
        expect(result.tradeTax).toBeCloseTo(28000, 2);
        expect(result.totalTax).toBeCloseTo(59650, 2);
    });
});
