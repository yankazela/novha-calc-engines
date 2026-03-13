import { SpainCorporateTaxServiceImpl } from '../src/corporate/spain/SpainCorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/spain/domain/types';

const spainRules: Rules = {
    regime: { type: 'flat', rate: 0.25 },
};

describe('SpainCorporateTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const input: Input = { taxableIncome: 0 };
        const service = new SpainCorporateTaxServiceImpl(input, spainRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly applies the flat 25% rate', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new SpainCorporateTaxServiceImpl(input, spainRules);
        const result = service.calculate();

        // 100000 * 0.25 = 25000
        expect(result.corporateTax).toBe(25000);
    });

    it('calculates effective tax rate as percentage', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new SpainCorporateTaxServiceImpl(input, spainRules);
        const result = service.calculate();

        expect(result.effectiveTaxRate).toBe(25);
    });

    it('returns one breakdown entry for flat rate calculation', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new SpainCorporateTaxServiceImpl(input, spainRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(1);
        expect(result.breakdowns[0].rate).toBe(0.25);
        expect(result.breakdowns[0].amount).toBe(25000);
    });

    it('scales linearly with taxable income', () => {
        const input: Input = { taxableIncome: 500000 };
        const service = new SpainCorporateTaxServiceImpl(input, spainRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(125000);
        expect(result.effectiveTaxRate).toBe(25);
    });
});
