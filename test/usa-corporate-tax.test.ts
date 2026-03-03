import { USACorporateTaxServiceImpl } from '../src/corporate/usa/USACorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/usa/domain/types';

// USA federal corporate tax rules (TCJA 2017, flat 21%)
const usaCorporateRules: Rules = {
    regime: {
        type: 'flat',
        rate: 0.21,
    },
};

describe('USACorporateTaxServiceImpl', () => {
    it('applies flat 21% rate for $100,000 taxable income', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new USACorporateTaxServiceImpl(input, usaCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(21000);
        expect(result.effectiveTaxRate).toBe(21);
    });

    it('returns zero tax for zero taxable income', () => {
        const input: Input = { taxableIncome: 0 };
        const service = new USACorporateTaxServiceImpl(input, usaCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('effective tax rate is always 21% for positive income', () => {
        const input: Input = { taxableIncome: 500000 };
        const service = new USACorporateTaxServiceImpl(input, usaCorporateRules);
        const result = service.calculate();

        expect(result.effectiveTaxRate).toBe(21);
        expect(result.corporateTax).toBe(105000);
    });

    it('returns one breakdown entry for flat rate', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new USACorporateTaxServiceImpl(input, usaCorporateRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(1);
        expect(result.breakdowns[0].rate).toBe(0.21);
        expect(result.breakdowns[0].amount).toBe(21000);
    });

    it('scales linearly for large income', () => {
        const input: Input = { taxableIncome: 1000000 };
        const service = new USACorporateTaxServiceImpl(input, usaCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(210000);
        expect(result.effectiveTaxRate).toBe(21);
    });
});
