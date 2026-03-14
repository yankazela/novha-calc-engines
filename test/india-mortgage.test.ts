import { IndiaMortgageServiceImpl } from '../src/mortgage/india/IndiaMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/india/domain/types';

const indiaRules: MortgageRules = {
    loanConstraints: { maxLtvPercent: 0.75, maxAmortizationYears: 30 },
    interest: { compounding: 'MONTHLY' },
    stampDuty: { rate: 0.05 },
};

const input: MortgageInput = {
    propertyPrice: 10000000,
    downPayment: 2000000,
    annualInterestRate: 8.5,
    amortizationYears: 20,
    isFirstTimeBuyer: false,
};

describe('IndiaMortgageServiceImpl', () => {
    it('correctly calculates the loan amount', () => {
        const service = new IndiaMortgageServiceImpl();
        const result = service.calculate(input, indiaRules);

        // loanAmount = 10000000 - 2000000 = 8000000
        expect(result.loanAmount).toBe(8000000);
    });

    it('correctly calculates stamp duty', () => {
        const service = new IndiaMortgageServiceImpl();
        const result = service.calculate(input, indiaRules);

        // stampDuty = 10000000 * 0.05 = 500000
        expect(result.stampDuty).toBe(500000);
    });

    it('calculates a positive monthly payment', () => {
        const service = new IndiaMortgageServiceImpl();
        const result = service.calculate(input, indiaRules);

        expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('total paid is greater than the loan amount', () => {
        const service = new IndiaMortgageServiceImpl();
        const result = service.calculate(input, indiaRules);

        expect(result.totalPaid).toBeGreaterThan(result.loanAmount);
    });

    it('amortization schedule has the correct number of years', () => {
        const service = new IndiaMortgageServiceImpl();
        const result = service.calculate(input, indiaRules);

        expect(result.amortizationSchedule).toHaveLength(20);
    });

    it('total paid equals monthly payment multiplied by total payments', () => {
        const service = new IndiaMortgageServiceImpl();
        const result = service.calculate(input, indiaRules);

        const expectedTotal = result.monthlyPayment * (input.amortizationYears * 12);
        expect(result.totalPaid).toBeCloseTo(expectedTotal, 2);
    });

    it('throws an error when down payment equals or exceeds property price', () => {
        const service = new IndiaMortgageServiceImpl();
        const badInput: MortgageInput = { ...input, downPayment: 10000000 };

        expect(() => service.calculate(badInput, indiaRules)).toThrow();
    });
});
