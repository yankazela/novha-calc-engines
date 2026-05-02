import { NetherlandsMortgageServiceImpl } from '../src/mortgage/netherlands/NetherlandsMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/netherlands/domain/types';

const netherlandsRules: MortgageRules = {
    loanConstraints: { maxLtvPercent: 1.0, maxAmortizationYears: 30 },
    interest: { compounding: 'MONTHLY' },
    transferTax: { primaryResidenceRate: 0.02, otherRate: 0.104 },
    notaryFeeRate: 0.004,
    landRegistryFeeRate: 0.001,
};

const input: MortgageInput = {
    propertyPrice: 400000,
    downPayment: 40000,
    annualInterestRate: 3.0,
    amortizationYears: 30,
    isPrimaryResidence: true,
};

describe('NetherlandsMortgageServiceImpl', () => {
    it('correctly calculates the loan amount', () => {
        const service = new NetherlandsMortgageServiceImpl();
        const result = service.calculate(input, netherlandsRules);
        expect(result.loanAmount).toBe(360000);
    });

    it('correctly calculates transfer tax for primary residence', () => {
        const service = new NetherlandsMortgageServiceImpl();
        const result = service.calculate(input, netherlandsRules);
        // 400000 * 0.02 = 8000
        expect(result.transferTax).toBeCloseTo(8000, 2);
    });

    it('correctly calculates transfer tax for non-primary residence', () => {
        const service = new NetherlandsMortgageServiceImpl();
        const nonPrimaryInput: MortgageInput = { ...input, isPrimaryResidence: false };
        const result = service.calculate(nonPrimaryInput, netherlandsRules);
        // 400000 * 0.104 = 41600
        expect(result.transferTax).toBeCloseTo(41600, 2);
    });

    it('correctly calculates notary fees', () => {
        const service = new NetherlandsMortgageServiceImpl();
        const result = service.calculate(input, netherlandsRules);
        // 400000 * 0.004 = 1600
        expect(result.notaryFees).toBeCloseTo(1600, 2);
    });

    it('correctly calculates land registry fee', () => {
        const service = new NetherlandsMortgageServiceImpl();
        const result = service.calculate(input, netherlandsRules);
        // 400000 * 0.001 = 400
        expect(result.landRegistryFee).toBeCloseTo(400, 2);
    });

    it('calculates a positive monthly payment', () => {
        const service = new NetherlandsMortgageServiceImpl();
        const result = service.calculate(input, netherlandsRules);
        expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('total paid is greater than the loan amount', () => {
        const service = new NetherlandsMortgageServiceImpl();
        const result = service.calculate(input, netherlandsRules);
        expect(result.totalPaid).toBeGreaterThan(result.loanAmount);
    });

    it('amortization schedule has the correct number of years', () => {
        const service = new NetherlandsMortgageServiceImpl();
        const result = service.calculate(input, netherlandsRules);
        expect(result.amortizationSchedule).toHaveLength(30);
    });

    it('throws an error when down payment equals or exceeds property price', () => {
        const service = new NetherlandsMortgageServiceImpl();
        const badInput: MortgageInput = { ...input, downPayment: 400000 };
        expect(() => service.calculate(badInput, netherlandsRules)).toThrow();
    });
});
