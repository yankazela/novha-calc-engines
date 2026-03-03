import { GermanyIncomeTaxServiceImpl } from '../src/income-tax/germany/GermanyIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/germany/domain/types';

// Germany 2024 income tax rules (simplified bracket approach)
const germanyRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 11604, rate: 0 },
        { from: 11604, to: 17006, rate: 0.14 },
        { from: 17006, to: 62810, rate: 0.24 },
        { from: 62810, to: 277826, rate: 0.42 },
        { from: 277826, to: null, rate: 0.45 },
    ],
    solidaritySurcharge: {
        rate: 0.055,
        exemptionThreshold: 18130,
    },
    socialContributions: {
        rate: 0.197,
    },
};

describe('GermanyIncomeTaxServiceImpl', () => {
    it('returns zero income tax for income at or below the Grundfreibetrag', () => {
        const service = new GermanyIncomeTaxServiceImpl(11604, germanyRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.grossIncome).toBe(11604);
    });

    it('correctly calculates income tax for €30,000 income', () => {
        const service = new GermanyIncomeTaxServiceImpl(30000, germanyRules);
        const result = service.calculateNetIncome();

        // 0%: 11604 * 0 = 0
        // 14%: (17006 - 11604) * 0.14 = 5402 * 0.14 = 756.28
        // 24%: (30000 - 17006) * 0.24 = 12994 * 0.24 = 3118.56
        // Total = 3874.84
        expect(result.incomeTax).toBeCloseTo(3874.84, 2);
    });

    it('correctly calculates income tax for €80,000 income', () => {
        const service = new GermanyIncomeTaxServiceImpl(80000, germanyRules);
        const result = service.calculateNetIncome();

        // 0%: 11604 * 0 = 0
        // 14%: (17006 - 11604) * 0.14 = 5402 * 0.14 = 756.28
        // 24%: (62810 - 17006) * 0.24 = 45804 * 0.24 = 10992.96
        // 42%: (80000 - 62810) * 0.42 = 17190 * 0.42 = 7219.80
        // Total = 18969.04
        expect(result.incomeTax).toBeCloseTo(18969.04, 2);
    });

    it('does not apply solidarity surcharge when income tax is below exemption threshold', () => {
        // €30,000: income tax ≈ 3874.84 < 18130
        const service = new GermanyIncomeTaxServiceImpl(30000, germanyRules);
        const result = service.calculateNetIncome();

        expect(result.solidaritySurcharge).toBe(0);
    });

    it('applies solidarity surcharge when income tax exceeds exemption threshold', () => {
        // €80,000: income tax ≈ 18969.04 > 18130 → soli = 18969.04 * 5.5%
        const service = new GermanyIncomeTaxServiceImpl(80000, germanyRules);
        const result = service.calculateNetIncome();

        expect(result.solidaritySurcharge).toBeCloseTo(18969.04 * 0.055, 2);
    });

    it('calculates social contributions as combined rate on gross income', () => {
        const service = new GermanyIncomeTaxServiceImpl(30000, germanyRules);
        const result = service.calculateNetIncome();

        // 30000 * 19.7% = 5910
        expect(result.socialContributions).toBeCloseTo(5910, 2);
    });

    it('net income equals gross income minus total deductions', () => {
        const service = new GermanyIncomeTaxServiceImpl(50000, germanyRules);
        const result = service.calculateNetIncome();

        expect(result.netIncome).toBeCloseTo(
            result.grossIncome - result.totalDeductions,
            2,
        );
    });

    it('total deductions equals income tax plus solidarity surcharge plus social contributions', () => {
        const service = new GermanyIncomeTaxServiceImpl(80000, germanyRules);
        const result = service.calculateNetIncome();

        expect(result.totalDeductions).toBeCloseTo(
            result.incomeTax + result.solidaritySurcharge + result.socialContributions,
            2,
        );
    });

    it('effective tax rate is income tax divided by gross income', () => {
        const service = new GermanyIncomeTaxServiceImpl(80000, germanyRules);
        const result = service.calculateNetIncome();

        expect(result.effectiveTaxRate).toBeCloseTo(result.incomeTax / result.grossIncome, 4);
    });

    it('returns zero tax for zero income', () => {
        const service = new GermanyIncomeTaxServiceImpl(0, germanyRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.solidaritySurcharge).toBe(0);
        expect(result.socialContributions).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });
});
