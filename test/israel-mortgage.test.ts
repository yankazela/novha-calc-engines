import { IsraelMortgageServiceImpl } from '../src/mortgage/israel/IsraelMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/israel/domain/types';

const israelRules: MortgageRules = {
    loanConstraints: { maxLtvPercent: 0.75, maxAmortizationYears: 30 },
    interest: { compounding: 'MONTHLY' },
    purchaseTax: {
        brackets: [
            { upTo: 1978745, rate: 0 },
            { upTo: 5872725, rate: 0.035 },
            { upTo: 16140600, rate: 0.05 },
            { upTo: 21520800, rate: 0.08 },
            { above: 21520800, rate: 0.10 },
        ],
    },
    landRegistrationFeeRate: 0.0025,
};

const input: MortgageInput = {
    propertyPrice: 2000000,
    downPayment: 500000,
    annualInterestRate: 4.5,
    amortizationYears: 25,
    isFirstTimeBuyer: true,
};

describe('IsraelMortgageServiceImpl', () => {
    it('correctly calculates the loan amount', () => {
        const service = new IsraelMortgageServiceImpl();
        const result = service.calculate(input, israelRules);
        expect(result.loanAmount).toBe(1500000);
    });

    it('correctly calculates purchase tax for first-time buyer', () => {
        const service = new IsraelMortgageServiceImpl();
        const result = service.calculate(input, israelRules);
        // 0-1978745: 0% tax = 0
        // 1978745-2000000: 21255 * 0.035 = 743.925
        expect(result.purchaseTax).toBeCloseTo(743.93, 1);
    });

    it('correctly calculates land registration fee', () => {
        const service = new IsraelMortgageServiceImpl();
        const result = service.calculate(input, israelRules);
        // 2000000 * 0.0025 = 5000
        expect(result.landRegistrationFee).toBeCloseTo(5000, 2);
    });

    it('calculates a positive monthly payment', () => {
        const service = new IsraelMortgageServiceImpl();
        const result = service.calculate(input, israelRules);
        expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('total paid is greater than the loan amount', () => {
        const service = new IsraelMortgageServiceImpl();
        const result = service.calculate(input, israelRules);
        expect(result.totalPaid).toBeGreaterThan(result.loanAmount);
    });

    it('amortization schedule has the correct number of years', () => {
        const service = new IsraelMortgageServiceImpl();
        const result = service.calculate(input, israelRules);
        expect(result.amortizationSchedule).toHaveLength(25);
    });

    it('throws an error when down payment equals or exceeds property price', () => {
        const service = new IsraelMortgageServiceImpl();
        const badInput: MortgageInput = { ...input, downPayment: 2000000 };
        expect(() => service.calculate(badInput, israelRules)).toThrow();
    });

    it('non-first-time buyer pays flat 8% purchase tax', () => {
        const service = new IsraelMortgageServiceImpl();
        const nonFtbInput: MortgageInput = { ...input, isFirstTimeBuyer: false };
        const result = service.calculate(nonFtbInput, israelRules);
        // 2000000 * 0.08 = 160000
        expect(result.purchaseTax).toBeCloseTo(160000, 2);
    });
});
