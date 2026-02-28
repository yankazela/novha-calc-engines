import { UKIncomeTaxServiceImpl } from '../src/income-tax/uk/UKIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/uk/domain/types';

// UK 2024-25 income tax rules
// Tax brackets are in terms of taxable income (after personal allowance deduction)
const ukRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 37700, rate: 0.20 },       // Basic rate
        { from: 37700, to: 125140, rate: 0.40 },   // Higher rate
        { from: 125140, to: null, rate: 0.45 },    // Additional rate
    ],
    personalAllowance: {
        amount: 12570,
        taperThreshold: 100000,
        taperRate: 0.5,
    },
    nationalInsurance: {
        primaryThreshold: 12570,
        upperEarningsLimit: 50270,
        mainRate: 0.08,
        upperRate: 0.02,
    },
};

describe('UKIncomeTaxServiceImpl', () => {
    it('returns zero tax for income at or below the personal allowance', () => {
        const service = new UKIncomeTaxServiceImpl(12570, ukRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.grossIncome).toBe(12570);
        expect(result.netIncome).toBe(result.grossIncome - result.totalDeductions);
    });

    it('correctly calculates income tax for £30,000 income', () => {
        const service = new UKIncomeTaxServiceImpl(30000, ukRules);
        const result = service.calculateNetIncome();

        // Personal allowance = £12,570
        // Taxable income = 30000 - 12570 = 17430
        // Tax = 17430 * 20% = 3486
        expect(result.incomeTax).toBe(3486);
        expect(result.personalAllowance).toBe(12570);
    });

    it('correctly calculates income tax for £50,000 income (basic rate only)', () => {
        const service = new UKIncomeTaxServiceImpl(50000, ukRules);
        const result = service.calculateNetIncome();

        // Taxable income = 50000 - 12570 = 37430
        // Basic rate band: 37430 * 20% = 7486
        expect(result.incomeTax).toBe(7486);
    });

    it('correctly calculates income tax for £60,000 income (higher rate applies)', () => {
        const service = new UKIncomeTaxServiceImpl(60000, ukRules);
        const result = service.calculateNetIncome();

        // Taxable income = 60000 - 12570 = 47430
        // Basic rate: 37700 * 20% = 7540
        // Higher rate: (47430 - 37700) * 40% = 9730 * 0.40 = 3892
        // Total = 11432
        expect(result.incomeTax).toBe(11432);
    });

    it('tapers personal allowance for income above £100,000', () => {
        const service = new UKIncomeTaxServiceImpl(110000, ukRules);
        const result = service.calculateNetIncome();

        // Personal allowance = 12570 - (110000 - 100000) * 0.5 = 12570 - 5000 = 7570
        expect(result.personalAllowance).toBe(7570);
    });

    it('removes personal allowance entirely for income above £125,140', () => {
        const service = new UKIncomeTaxServiceImpl(130000, ukRules);
        const result = service.calculateNetIncome();

        // Personal allowance = max(0, 12570 - (130000 - 100000) * 0.5) = max(0, 12570 - 15000) = 0
        expect(result.personalAllowance).toBe(0);
    });

    it('applies additional rate (45%) for income above £125,140 (after PA deducted)', () => {
        const service = new UKIncomeTaxServiceImpl(150000, ukRules);
        const result = service.calculateNetIncome();

        // No personal allowance (income > £125,140)
        // Taxable income = 150000
        // Basic rate: 37700 * 20% = 7540
        // Higher rate: (125140 - 37700) * 40% = 87440 * 40% = 34976
        // Additional rate: (150000 - 125140) * 45% = 24860 * 45% = 11187
        // Total = 7540 + 34976 + 11187 = 53703
        expect(result.incomeTax).toBe(53703);
    });

    it('calculates National Insurance correctly for basic rate taxpayer', () => {
        const service = new UKIncomeTaxServiceImpl(30000, ukRules);
        const result = service.calculateNetIncome();

        // NI: (30000 - 12570) * 8% = 17430 * 0.08 = 1394.40
        expect(result.nationalInsurance).toBeCloseTo(1394.40, 2);
    });

    it('calculates National Insurance correctly above upper earnings limit', () => {
        const service = new UKIncomeTaxServiceImpl(60000, ukRules);
        const result = service.calculateNetIncome();

        // NI main band: (50270 - 12570) * 8% = 37700 * 0.08 = 3016
        // NI upper band: (60000 - 50270) * 2% = 9730 * 0.02 = 194.60
        // Total NI = 3210.60
        expect(result.nationalInsurance).toBeCloseTo(3210.60, 2);
    });

    it('returns zero National Insurance for income at or below primary threshold', () => {
        const service = new UKIncomeTaxServiceImpl(12570, ukRules);
        const result = service.calculateNetIncome();

        expect(result.nationalInsurance).toBe(0);
    });

    it('net income equals gross income minus total deductions', () => {
        const service = new UKIncomeTaxServiceImpl(50000, ukRules);
        const result = service.calculateNetIncome();

        expect(result.netIncome).toBeCloseTo(
            result.grossIncome - result.totalDeductions,
            2,
        );
    });

    it('effective tax rate is income tax divided by gross income', () => {
        const service = new UKIncomeTaxServiceImpl(80000, ukRules);
        const result = service.calculateNetIncome();

        expect(result.effectiveTaxRate).toBeCloseTo(result.incomeTax / result.grossIncome, 4);
    });

    it('total deductions equals income tax plus National Insurance', () => {
        const service = new UKIncomeTaxServiceImpl(50000, ukRules);
        const result = service.calculateNetIncome();

        expect(result.totalDeductions).toBeCloseTo(
            result.incomeTax + result.nationalInsurance,
            2,
        );
    });
});
