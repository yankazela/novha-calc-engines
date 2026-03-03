import { GermanyMortgageServiceImpl } from '../src/mortgage/germany/GermanyMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/germany/domain/types';

// Germany mortgage rules
const germanyMortgageRules: MortgageRules = {
    loanConstraints: {
        maxLtvPercent: 80,
        maxAmortizationYears: 30,
    },
    interest: {
        compounding: 'MONTHLY',
    },
    landTransferTax: {
        rate: 0.035,
    },
    notaryFeeRate: 0.015,
    registrationFeeRate: 0.005,
};

const defaultInput: MortgageInput = {
    propertyPrice: 300000,
    downPayment: 60000, // 20% down
    annualInterestRate: 3.5,
    amortizationYears: 25,
};

describe('GermanyMortgageServiceImpl', () => {
    const service = new GermanyMortgageServiceImpl();

    it('calculates loan amount correctly', () => {
        const result = service.calculate(defaultInput, germanyMortgageRules);

        expect(result.loanAmount).toBe(240000);
    });

    it('calculates monthly payment using standard amortization formula', () => {
        const result = service.calculate(defaultInput, germanyMortgageRules);

        const r = 0.035 / 12;
        const n = 25 * 12;
        const expected = 240000 * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        expect(result.monthlyPayment).toBeCloseTo(expected, 2);
    });

    it('calculates Grunderwerbsteuer (land transfer tax) as flat rate on property price', () => {
        const result = service.calculate(defaultInput, germanyMortgageRules);

        // 300000 * 3.5% = 10500
        expect(result.landTransferTax).toBeCloseTo(10500, 2);
    });

    it('calculates notary fees as flat rate on property price', () => {
        const result = service.calculate(defaultInput, germanyMortgageRules);

        // 300000 * 1.5% = 4500
        expect(result.notaryFees).toBe(4500);
    });

    it('calculates registration fees as flat rate on property price', () => {
        const result = service.calculate(defaultInput, germanyMortgageRules);

        // 300000 * 0.5% = 1500
        expect(result.registrationFees).toBe(1500);
    });

    it('generates amortization schedule with correct length', () => {
        const result = service.calculate(defaultInput, germanyMortgageRules);

        expect(result.amortizationSchedule.length).toBe(25);
        expect(result.amortizationSchedule[0].year).toBe(1);
        expect(result.amortizationSchedule[24].balance).toBeCloseTo(0, 0);
    });

    it('amortization schedule balance decreases over time', () => {
        const result = service.calculate(defaultInput, germanyMortgageRules);
        const schedule = result.amortizationSchedule;

        for (let i = 1; i < schedule.length; i++) {
            expect(schedule[i].balance).toBeLessThan(schedule[i - 1].balance);
        }
    });

    it('totalPaid equals monthlyPayment * totalPayments', () => {
        const result = service.calculate(defaultInput, germanyMortgageRules);
        const totalPayments = 25 * 12;

        expect(result.totalPaid).toBeCloseTo(result.monthlyPayment * totalPayments, 0);
    });

    it('throws error when loan amount is zero or negative', () => {
        const input: MortgageInput = {
            ...defaultInput,
            downPayment: 300000,
        };

        expect(() => service.calculate(input, germanyMortgageRules)).toThrow('Invalid loan amount');
    });

    it('otherFees includes notary fees label', () => {
        const result = service.calculate(defaultInput, germanyMortgageRules);

        expect(result.otherFees.notaryFees.label).toBe('NOTARY_FEES');
        expect(result.otherFees.notaryFees.value).toBe(result.notaryFees);
    });
});
