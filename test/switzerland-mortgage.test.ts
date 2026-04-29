import { SwitzerlandMortgageServiceImpl } from '../src/mortgage/switzerland/SwitzerlandMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/switzerland/domain/types';

const switzerlandRules: MortgageRules = {
    loanConstraints: { maxLtvPercent: 0.80, maxAmortizationYears: 25 },
    interest: { compounding: 'MONTHLY' },
    transferTaxRate: 0.0015,
    notaryFeeRate: 0.005,
    landRegistryFeeRate: 0.001,
};

const input: MortgageInput = {
    propertyPrice: 800000,
    downPayment: 160000,
    annualInterestRate: 2.5,
    amortizationYears: 20,
};

describe('SwitzerlandMortgageServiceImpl', () => {
    it('correctly calculates the loan amount', () => {
        const service = new SwitzerlandMortgageServiceImpl();
        const result = service.calculate(input, switzerlandRules);
        expect(result.loanAmount).toBe(640000);
    });

    it('correctly calculates transfer tax', () => {
        const service = new SwitzerlandMortgageServiceImpl();
        const result = service.calculate(input, switzerlandRules);
        // 800000 * 0.0015 = 1200
        expect(result.transferTax).toBeCloseTo(1200, 2);
    });

    it('correctly calculates notary fees', () => {
        const service = new SwitzerlandMortgageServiceImpl();
        const result = service.calculate(input, switzerlandRules);
        // 800000 * 0.005 = 4000
        expect(result.notaryFees).toBeCloseTo(4000, 2);
    });

    it('correctly calculates land registry fee', () => {
        const service = new SwitzerlandMortgageServiceImpl();
        const result = service.calculate(input, switzerlandRules);
        // 800000 * 0.001 = 800
        expect(result.landRegistryFee).toBeCloseTo(800, 2);
    });

    it('calculates a positive monthly payment', () => {
        const service = new SwitzerlandMortgageServiceImpl();
        const result = service.calculate(input, switzerlandRules);
        expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('total paid is greater than the loan amount', () => {
        const service = new SwitzerlandMortgageServiceImpl();
        const result = service.calculate(input, switzerlandRules);
        expect(result.totalPaid).toBeGreaterThan(result.loanAmount);
    });

    it('amortization schedule has the correct number of years', () => {
        const service = new SwitzerlandMortgageServiceImpl();
        const result = service.calculate(input, switzerlandRules);
        expect(result.amortizationSchedule).toHaveLength(20);
    });

    it('throws an error when down payment equals or exceeds property price', () => {
        const service = new SwitzerlandMortgageServiceImpl();
        const badInput: MortgageInput = { ...input, downPayment: 800000 };
        expect(() => service.calculate(badInput, switzerlandRules)).toThrow();
    });
});
