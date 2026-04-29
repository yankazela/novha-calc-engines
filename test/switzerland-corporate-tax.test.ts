import { SwitzerlandCorporateTaxServiceImpl } from '../src/corporate/switzerland/SwitzerlandCorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/switzerland/domain/types';

const switzerlandRules: Rules = {
    regime: { type: 'flat', rate: 0.085 },
};

describe('SwitzerlandCorporateTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const input: Input = { taxableIncome: 0 };
        const service = new SwitzerlandCorporateTaxServiceImpl(input, switzerlandRules);
        const result = service.calculate();
        expect(result.corporateTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly applies the flat 8.5% rate', () => {
        const input: Input = { taxableIncome: 1000000 };
        const service = new SwitzerlandCorporateTaxServiceImpl(input, switzerlandRules);
        const result = service.calculate();
        expect(result.corporateTax).toBe(85000);
    });

    it('calculates effective tax rate as percentage', () => {
        const input: Input = { taxableIncome: 1000000 };
        const service = new SwitzerlandCorporateTaxServiceImpl(input, switzerlandRules);
        const result = service.calculate();
        expect(result.effectiveTaxRate).toBe(8.5);
    });

    it('returns one breakdown entry for flat rate calculation', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new SwitzerlandCorporateTaxServiceImpl(input, switzerlandRules);
        const result = service.calculate();
        expect(result.breakdowns).toHaveLength(1);
        expect(result.breakdowns[0].rate).toBe(0.085);
    });
});
