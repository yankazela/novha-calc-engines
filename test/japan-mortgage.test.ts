import { JapanMortgageServiceImpl } from '../src/mortgage/japan/JapanMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/japan/domain/types';

const japanRules: MortgageRules = {
    loanConstraints: { maxLtvPercent: 0.80, maxAmortizationYears: 35 },
    interest: { compounding: 'MONTHLY' },
    acquisitionTax: { rate: 0.03 },
};

const input: MortgageInput = {
    propertyPrice: 50000000,
    downPayment: 10000000,
    annualInterestRate: 1.5,
    amortizationYears: 30,
    isFirstTimeBuyer: false,
};

describe('JapanMortgageServiceImpl', () => {
    it('correctly calculates the loan amount', () => {
        const service = new JapanMortgageServiceImpl();
        const result = service.calculate(input, japanRules);

        // loanAmount = 50000000 - 10000000 = 40000000
        expect(result.loanAmount).toBe(40000000);
    });

    it('correctly calculates acquisition tax', () => {
        const service = new JapanMortgageServiceImpl();
        const result = service.calculate(input, japanRules);

        // acquisitionTax = 50000000 * 0.03 = 1500000
        expect(result.acquisitionTax).toBe(1500000);
    });

    it('calculates a positive monthly payment', () => {
        const service = new JapanMortgageServiceImpl();
        const result = service.calculate(input, japanRules);

        expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('total paid is greater than the loan amount', () => {
        const service = new JapanMortgageServiceImpl();
        const result = service.calculate(input, japanRules);

        expect(result.totalPaid).toBeGreaterThan(result.loanAmount);
    });

    it('total interest paid equals total paid minus loan amount', () => {
        const service = new JapanMortgageServiceImpl();
        const result = service.calculate(input, japanRules);

        expect(result.totalInterestPaid).toBeCloseTo(result.totalPaid - result.loanAmount, 2);
    });

    it('amortization schedule has the correct number of years', () => {
        const service = new JapanMortgageServiceImpl();
        const result = service.calculate(input, japanRules);

        expect(result.amortizationSchedule).toHaveLength(30);
    });

    it('throws an error when down payment equals or exceeds property price', () => {
        const service = new JapanMortgageServiceImpl();
        const badInput: MortgageInput = { ...input, downPayment: 50000000 };

        expect(() => service.calculate(badInput, japanRules)).toThrow();
    });
});
