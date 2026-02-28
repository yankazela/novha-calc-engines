import { AustraliaIncomeTaxServiceImpl } from '../src/income-tax/australia/AustraliaIncomeTaxServiceImpl';
import { IncomeTaxRules } from '../src/income-tax/australia/domain/types';

// Australia 2024-25 tax rules (Stage 3 tax cuts)
const australiaRules: IncomeTaxRules = {
    taxBrackets: [
        { from: 0, to: 18200, rate: 0 },
        { from: 18200, to: 45000, rate: 0.19 },
        { from: 45000, to: 120000, rate: 0.325 },
        { from: 120000, to: 180000, rate: 0.37 },
        { from: 180000, to: null, rate: 0.45 },
    ],
    nonResidentTaxBrackets: [
        { from: 0, to: 120000, rate: 0.325 },
        { from: 120000, to: 180000, rate: 0.37 },
        { from: 180000, to: null, rate: 0.45 },
    ],
    medicareLevy: {
        rate: 0.02,
        shadingInThreshold: 26000,
        fullLevyThreshold: 32500,
        reductionRate: 0.1,
    },
    lowIncomeTaxOffset: {
        maxOffset: 700,
        phaseOutStart: 37500,
        phaseOutEnd: 45000,
        phaseOutRate: 0.05,
    },
};

describe('AustraliaIncomeTaxServiceImpl', () => {
    it('returns zero tax for income below the tax-free threshold', () => {
        const service = new AustraliaIncomeTaxServiceImpl(18200, australiaRules);
        const result = service.calculateNetIncome();

        expect(result.incomeTax).toBe(0);
        expect(result.grossIncome).toBe(18200);
        expect(result.netIncome).toBe(result.grossIncome - result.totalDeductions);
    });

    it('correctly calculates income tax for $60,000 income', () => {
        const service = new AustraliaIncomeTaxServiceImpl(60000, australiaRules);
        const result = service.calculateNetIncome();

        // Bracket 1: 0 → 18200 @ 0% = 0
        // Bracket 2: 18200 → 45000 @ 19% = 5092
        // Bracket 3: 45000 → 60000 @ 32.5% = 4875
        // Gross tax = 9967
        // LITO: income (60000) > phaseOutEnd (45000) → offset = 0
        // Net income tax = 9967
        expect(result.incomeTax).toBe(9967);
        expect(result.grossIncome).toBe(60000);
    });

    it('applies the Low Income Tax Offset for low incomes', () => {
        const service = new AustraliaIncomeTaxServiceImpl(30000, australiaRules);
        const result = service.calculateNetIncome();

        // Bracket 2: 18200 → 30000 @ 19% = 2242
        // LITO: income 30000 <= 37500 → max offset 700
        // Net tax = max(0, 2242 - 700) = 1542
        expect(result.lowIncomeTaxOffset).toBe(700);
        expect(result.incomeTax).toBe(1542);
    });

    it('partially phases out LITO between $37,500 and $45,000', () => {
        const service = new AustraliaIncomeTaxServiceImpl(40000, australiaRules);
        const result = service.calculateNetIncome();

        // Gross tax: 18200→40000 @ 19% = 3382
        // LITO: 700 - (40000 - 37500) * 0.05 = 700 - 125 = 575
        expect(result.lowIncomeTaxOffset).toBe(575);
    });

    it('applies Medicare Levy correctly', () => {
        const service = new AustraliaIncomeTaxServiceImpl(60000, australiaRules);
        const result = service.calculateNetIncome();

        // Medicare Levy: 60000 * 2% = 1200
        expect(result.medicareLevy).toBe(1200);
    });

    it('applies shading-in Medicare Levy for income in the shading-in range', () => {
        const income = 28000;
        const service = new AustraliaIncomeTaxServiceImpl(income, australiaRules);
        const result = service.calculateNetIncome();

        // income (28000) > shadingInThreshold (26000), < fullLevyThreshold (32500)
        // levy = (28000 - 26000) * 0.1 = 200
        expect(result.medicareLevy).toBe(200);
    });

    it('returns zero Medicare Levy below shading-in threshold', () => {
        const service = new AustraliaIncomeTaxServiceImpl(25000, australiaRules);
        const result = service.calculateNetIncome();

        expect(result.medicareLevy).toBe(0);
    });

    it('calculates high income tax correctly', () => {
        const service = new AustraliaIncomeTaxServiceImpl(200000, australiaRules);
        const result = service.calculateNetIncome();

        // Bracket 1: 0→18200 @ 0% = 0
        // Bracket 2: 18200→45000 @ 19% = 5092
        // Bracket 3: 45000→120000 @ 32.5% = 24375
        // Bracket 4: 120000→180000 @ 37% = 22200
        // Bracket 5: 180000→200000 @ 45% = 9000
        // Gross tax = 60667
        // LITO: 0 (income > 45000)
        // Net income tax = 60667
        expect(result.incomeTax).toBe(60667);
        expect(result.medicareLevy).toBe(4000); // 200000 * 2%
    });

    it('net income equals gross income minus total deductions', () => {
        const service = new AustraliaIncomeTaxServiceImpl(80000, australiaRules);
        const result = service.calculateNetIncome();

        expect(result.netIncome).toBeCloseTo(
            result.grossIncome - result.totalDeductions,
            2,
        );
    });

    it('effective tax rate is income tax divided by gross income', () => {
        const service = new AustraliaIncomeTaxServiceImpl(100000, australiaRules);
        const result = service.calculateNetIncome();

        expect(result.effectiveTaxRate).toBeCloseTo(result.incomeTax / result.grossIncome, 4);
    });
});
