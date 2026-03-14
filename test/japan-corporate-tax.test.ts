import { JapanCorporateTaxServiceImpl } from '../src/corporate/japan/JapanCorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/japan/domain/types';

const japanRules: Rules = {
    regime: { type: 'flat', rate: 0.335 },
};

describe('JapanCorporateTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const input: Input = { taxableIncome: 0 };
        const service = new JapanCorporateTaxServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly applies the flat 33.5% rate', () => {
        const input: Input = { taxableIncome: 10000000 };
        const service = new JapanCorporateTaxServiceImpl(input, japanRules);
        const result = service.calculate();

        // 10000000 * 0.335 = 3350000
        expect(result.corporateTax).toBe(3350000);
    });

    it('calculates effective tax rate as percentage', () => {
        const input: Input = { taxableIncome: 10000000 };
        const service = new JapanCorporateTaxServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.effectiveTaxRate).toBe(33.5);
    });

    it('returns one breakdown entry for flat rate calculation', () => {
        const input: Input = { taxableIncome: 10000000 };
        const service = new JapanCorporateTaxServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(1);
        expect(result.breakdowns[0].rate).toBe(0.335);
        expect(result.breakdowns[0].amount).toBe(3350000);
    });

    it('scales linearly with taxable income', () => {
        const input: Input = { taxableIncome: 1000000 };
        const service = new JapanCorporateTaxServiceImpl(input, japanRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(335000);
        expect(result.effectiveTaxRate).toBe(33.5);
    });
});
