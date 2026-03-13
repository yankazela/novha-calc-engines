import { IndiaCorporateTaxServiceImpl } from '../src/corporate/india/IndiaCorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/india/domain/types';

const indiaRules: Rules = {
    regime: { type: 'flat', rate: 0.22 },
};

describe('IndiaCorporateTaxServiceImpl', () => {
    it('returns zero tax for zero income', () => {
        const input: Input = { taxableIncome: 0 };
        const service = new IndiaCorporateTaxServiceImpl(input, indiaRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
        expect(result.breakdowns).toHaveLength(0);
    });

    it('correctly applies the flat 22% rate', () => {
        const input: Input = { taxableIncome: 1000000 };
        const service = new IndiaCorporateTaxServiceImpl(input, indiaRules);
        const result = service.calculate();

        // 1000000 * 0.22 = 220000
        expect(result.corporateTax).toBe(220000);
    });

    it('calculates effective tax rate as percentage', () => {
        const input: Input = { taxableIncome: 1000000 };
        const service = new IndiaCorporateTaxServiceImpl(input, indiaRules);
        const result = service.calculate();

        expect(result.effectiveTaxRate).toBe(22);
    });

    it('returns one breakdown entry for flat rate calculation', () => {
        const input: Input = { taxableIncome: 1000000 };
        const service = new IndiaCorporateTaxServiceImpl(input, indiaRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(1);
        expect(result.breakdowns[0].rate).toBe(0.22);
        expect(result.breakdowns[0].amount).toBe(220000);
    });

    it('scales linearly with taxable income', () => {
        const input: Input = { taxableIncome: 5000000 };
        const service = new IndiaCorporateTaxServiceImpl(input, indiaRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(1100000);
        expect(result.effectiveTaxRate).toBe(22);
    });
});
