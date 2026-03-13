import { SpainMortgageServiceImpl } from '../src/mortgage/spain/SpainMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/spain/domain/types';

const spainRules: MortgageRules = {
    loanConstraints: { maxLtvPercent: 0.80, maxAmortizationYears: 30 },
    interest: { compounding: 'MONTHLY' },
    transferTax: { brackets: [{ above: 0, rate: 0.07 }] },
};

const input: MortgageInput = {
    propertyPrice: 300000,
    downPayment: 60000,
    annualInterestRate: 3.5,
    amortizationYears: 25,
    isFirstTimeBuyer: false,
};

describe('SpainMortgageServiceImpl', () => {
    it('correctly calculates the loan amount', () => {
        const service = new SpainMortgageServiceImpl();
        const result = service.calculate(input, spainRules);

        // loanAmount = 300000 - 60000 = 240000
        expect(result.loanAmount).toBe(240000);
    });

    it('correctly calculates transfer tax', () => {
        const service = new SpainMortgageServiceImpl();
        const result = service.calculate(input, spainRules);

        // transferTax = (300000 - 0) * 0.07 = 21000
        expect(result.transferTax).toBeCloseTo(21000, 2);
    });

    it('calculates a positive monthly payment', () => {
        const service = new SpainMortgageServiceImpl();
        const result = service.calculate(input, spainRules);

        expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('total paid is greater than the loan amount', () => {
        const service = new SpainMortgageServiceImpl();
        const result = service.calculate(input, spainRules);

        expect(result.totalPaid).toBeGreaterThan(result.loanAmount);
    });

    it('total paid equals monthly payment multiplied by total payments', () => {
        const service = new SpainMortgageServiceImpl();
        const result = service.calculate(input, spainRules);

        const expectedTotal = result.monthlyPayment * (input.amortizationYears * 12);
        expect(result.totalPaid).toBeCloseTo(expectedTotal, 2);
    });

    it('amortization schedule has the correct number of years', () => {
        const service = new SpainMortgageServiceImpl();
        const result = service.calculate(input, spainRules);

        expect(result.amortizationSchedule).toHaveLength(25);
    });

    it('throws an error when down payment equals or exceeds property price', () => {
        const service = new SpainMortgageServiceImpl();
        const badInput: MortgageInput = { ...input, downPayment: 300000 };

        expect(() => service.calculate(badInput, spainRules)).toThrow();
    });
});
