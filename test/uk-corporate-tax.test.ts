import { UKCorporateTaxServiceImpl } from '../src/corporate/uk/UKCorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/uk/domain/types';

// UK 2024-25 corporate tax rules
const ukCorporateRules: Rules = {
    regimes: {
        smallProfits: {
            type: 'flat',
            rate: 0.19,
        },
        main: {
            type: 'flat',
            rate: 0.25,
        },
        marginalRelief: {
            type: 'marginal_relief',
            mainRate: 0.25,
            smallProfitsRate: 0.19,
            upperLimit: 250000,
            lowerLimit: 50000,
            standardFraction: 3 / 200,
        },
    },
};

describe('UKCorporateTaxServiceImpl', () => {
    it('applies small profits rate (19%) for profits up to £50,000', () => {
        const input: Input = { taxableIncome: 50000 };
        const service = new UKCorporateTaxServiceImpl(input, ukCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(9500);
        expect(result.effectiveTaxRate).toBe(19);
    });

    it('applies main rate (25%) for profits above £250,000', () => {
        const input: Input = { taxableIncome: 300000 };
        const service = new UKCorporateTaxServiceImpl(input, ukCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(75000);
        expect(result.effectiveTaxRate).toBe(25);
    });

    it('applies marginal relief for profits between £50,000 and £250,000', () => {
        // At £150,000:
        // Gross tax = 150000 * 25% = 37500
        // Relief = (3/200) * (250000 - 150000) = 0.015 * 100000 = 1500
        // Net tax = 37500 - 1500 = 36000
        const input: Input = { taxableIncome: 150000 };
        const service = new UKCorporateTaxServiceImpl(input, ukCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(36000);
    });

    it('marginal relief at lower limit boundary produces 19% effective rate', () => {
        // At £50,001 (just above lower limit):
        // Gross tax = 50001 * 25% = 12500.25
        // Relief = (3/200) * (250000 - 50001) = 0.015 * 199999 = 2999.985
        // Net tax ≈ 9500.265
        // Effective rate ≈ 19.00%
        const input: Input = { taxableIncome: 50001 };
        const service = new UKCorporateTaxServiceImpl(input, ukCorporateRules);
        const result = service.calculate();

        expect(result.effectiveTaxRate).toBeCloseTo(19, 0);
    });

    it('marginal relief at upper limit boundary produces 25% effective rate', () => {
        // At £249,999:
        // Gross tax = 249999 * 25% = 62499.75
        // Relief = (3/200) * (250000 - 249999) = 0.015 * 1 = 0.015
        // Net tax ≈ 62499.735
        // Effective rate ≈ 25%
        const input: Input = { taxableIncome: 249999 };
        const service = new UKCorporateTaxServiceImpl(input, ukCorporateRules);
        const result = service.calculate();

        expect(result.effectiveTaxRate).toBeCloseTo(25, 0);
    });

    it('returns zero tax for zero taxable income', () => {
        const input: Input = { taxableIncome: 0 };
        const service = new UKCorporateTaxServiceImpl(input, ukCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });

    it('returns breakdowns for small profits rate', () => {
        const input: Input = { taxableIncome: 30000 };
        const service = new UKCorporateTaxServiceImpl(input, ukCorporateRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(1);
        expect(result.breakdowns[0].rate).toBe(0.19);
        expect(result.breakdowns[0].amount).toBe(5700);
    });

    it('returns breakdowns for main rate', () => {
        const input: Input = { taxableIncome: 500000 };
        const service = new UKCorporateTaxServiceImpl(input, ukCorporateRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(1);
        expect(result.breakdowns[0].rate).toBe(0.25);
        expect(result.breakdowns[0].amount).toBe(125000);
    });

    it('returns two breakdowns for marginal relief (main tax + relief)', () => {
        const input: Input = { taxableIncome: 100000 };
        const service = new UKCorporateTaxServiceImpl(input, ukCorporateRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(2);
    });
});
