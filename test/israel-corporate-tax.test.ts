import { IsraelCorporateTaxServiceImpl } from '../src/corporate/israel/IsraelCorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/israel/domain/types';

const israelRules: Rules = {
    regime: { type: 'flat', rate: 0.23 },
};

describe('IsraelCorporateTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const input: Input = { taxableIncome: 0 };
        const service = new IsraelCorporateTaxServiceImpl(input, israelRules);
        const result = service.calculate();
        expect(result.corporateTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly applies the flat 23% rate', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new IsraelCorporateTaxServiceImpl(input, israelRules);
        const result = service.calculate();
        // 100000 * 0.23 = 23000
        expect(result.corporateTax).toBe(23000);
    });

    it('calculates effective tax rate as percentage', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new IsraelCorporateTaxServiceImpl(input, israelRules);
        const result = service.calculate();
        expect(result.effectiveTaxRate).toBe(23);
    });

    it('returns one breakdown entry for flat rate calculation', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new IsraelCorporateTaxServiceImpl(input, israelRules);
        const result = service.calculate();
        expect(result.breakdowns).toHaveLength(1);
        expect(result.breakdowns[0].rate).toBe(0.23);
        expect(result.breakdowns[0].amount).toBe(23000);
    });

    it('scales linearly with taxable income', () => {
        const input: Input = { taxableIncome: 500000 };
        const service = new IsraelCorporateTaxServiceImpl(input, israelRules);
        const result = service.calculate();
        expect(result.corporateTax).toBe(115000);
        expect(result.effectiveTaxRate).toBe(23);
    });
});
