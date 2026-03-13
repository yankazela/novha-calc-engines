import { BrazilMortgageServiceImpl } from '../src/mortgage/brazil/BrazilMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/brazil/domain/types';

const brazilRules: MortgageRules = {
    loanConstraints: { maxLtvPercent: 0.80, maxAmortizationYears: 35 },
    interest: { compounding: 'MONTHLY' },
    itbi: { rate: 0.02 },
};

const input: MortgageInput = {
    propertyPrice: 500000,
    downPayment: 100000,
    annualInterestRate: 10,
    amortizationYears: 30,
    isFirstTimeBuyer: false,
};

describe('BrazilMortgageServiceImpl', () => {
    it('correctly calculates the loan amount', () => {
        const service = new BrazilMortgageServiceImpl();
        const result = service.calculate(input, brazilRules);

        // loanAmount = 500000 - 100000 = 400000
        expect(result.loanAmount).toBe(400000);
    });

    it('correctly calculates ITBI', () => {
        const service = new BrazilMortgageServiceImpl();
        const result = service.calculate(input, brazilRules);

        // ITBI = 500000 * 0.02 = 10000
        expect(result.itbi).toBe(10000);
    });

    it('calculates a positive monthly payment', () => {
        const service = new BrazilMortgageServiceImpl();
        const result = service.calculate(input, brazilRules);

        expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('total paid is greater than the loan amount', () => {
        const service = new BrazilMortgageServiceImpl();
        const result = service.calculate(input, brazilRules);

        expect(result.totalPaid).toBeGreaterThan(result.loanAmount);
    });

    it('amortization schedule has the correct number of years', () => {
        const service = new BrazilMortgageServiceImpl();
        const result = service.calculate(input, brazilRules);

        expect(result.amortizationSchedule).toHaveLength(30);
    });

    it('total paid equals monthly payment multiplied by total payments', () => {
        const service = new BrazilMortgageServiceImpl();
        const result = service.calculate(input, brazilRules);

        const expectedTotal = result.monthlyPayment * (input.amortizationYears * 12);
        expect(result.totalPaid).toBeCloseTo(expectedTotal, 2);
    });

    it('throws an error when down payment equals or exceeds property price', () => {
        const service = new BrazilMortgageServiceImpl();
        const badInput: MortgageInput = { ...input, downPayment: 500000 };

        expect(() => service.calculate(badInput, brazilRules)).toThrow();
    });
});
