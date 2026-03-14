import { BrazilCorporateTaxServiceImpl } from '../src/corporate/brazil/BrazilCorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/brazil/domain/types';

const brazilRules: Rules = {
    irpj: { baseRate: 0.15, surchargeRate: 0.10, surchargeThreshold: 240000 },
    csll: { rate: 0.09 },
};

describe('BrazilCorporateTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const input: Input = { taxableIncome: 0 };
        const service = new BrazilCorporateTaxServiceImpl(input, brazilRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly calculates tax for income below the surcharge threshold', () => {
        const input: Input = { taxableIncome: 200000 };
        const service = new BrazilCorporateTaxServiceImpl(input, brazilRules);
        const result = service.calculate();

        // IRPJ base: 200000 * 0.15 = 30000
        // Surcharge: 0 (200000 <= 240000)
        // CSLL: 200000 * 0.09 = 18000
        // Total = 48000
        expect(result.corporateTax).toBeCloseTo(48000, 2);
        expect(result.effectiveTaxRate).toBeCloseTo(24, 2);
    });

    it('correctly calculates tax for income above the surcharge threshold', () => {
        const input: Input = { taxableIncome: 400000 };
        const service = new BrazilCorporateTaxServiceImpl(input, brazilRules);
        const result = service.calculate();

        // IRPJ base: 400000 * 0.15 = 60000
        // Surcharge: (400000 - 240000) * 0.10 = 16000
        // CSLL: 400000 * 0.09 = 36000
        // Total = 112000
        expect(result.corporateTax).toBeCloseTo(112000, 2);
        expect(result.effectiveTaxRate).toBeCloseTo(28, 2);
    });

    it('returns three breakdown entries when surcharge applies', () => {
        const input: Input = { taxableIncome: 400000 };
        const service = new BrazilCorporateTaxServiceImpl(input, brazilRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(3);
    });

    it('effective tax rate is higher when income exceeds surcharge threshold', () => {
        const inputBelow: Input = { taxableIncome: 200000 };
        const inputAbove: Input = { taxableIncome: 400000 };

        const rateBelow = new BrazilCorporateTaxServiceImpl(inputBelow, brazilRules).calculate().effectiveTaxRate;
        const rateAbove = new BrazilCorporateTaxServiceImpl(inputAbove, brazilRules).calculate().effectiveTaxRate;

        expect(rateAbove).toBeGreaterThan(rateBelow);
    });
});
