import { USAMortgageServiceImpl } from '../src/mortgage/usa/USAMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/usa/domain/types';

// USA federal mortgage rules (no federal transfer tax)
const usaMortgageRules: MortgageRules = {
    loanConstraints: {
        maxLtvPercent: 97,
        maxAmortizationYears: 30,
    },
    interest: {
        compounding: 'MONTHLY',
    },
    transferTax: {
        brackets: [
            { above: 0, rate: 0 },
        ],
    },
};

const defaultInput: MortgageInput = {
    propertyPrice: 400000,
    downPayment: 80000, // 20% down
    annualInterestRate: 5.0,
    amortizationYears: 30,
    isFirstTimeBuyer: false,
};

describe('USAMortgageServiceImpl', () => {
    const service = new USAMortgageServiceImpl();

    it('calculates loan amount correctly', () => {
        const result = service.calculate(defaultInput, usaMortgageRules);

        expect(result.loanAmount).toBe(320000);
    });

    it('calculates monthly payment using standard amortization formula', () => {
        const result = service.calculate(defaultInput, usaMortgageRules);

        const r = 0.05 / 12;
        const n = 30 * 12;
        const expected = 320000 * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        expect(result.monthlyPayment).toBeCloseTo(expected, 2);
    });

    it('totalPaid equals monthlyPayment * totalPayments', () => {
        const result = service.calculate(defaultInput, usaMortgageRules);
        const totalPayments = 30 * 12;

        expect(result.totalPaid).toBeCloseTo(result.monthlyPayment * totalPayments, 0);
    });

    it('calculates zero federal transfer tax', () => {
        const result = service.calculate(defaultInput, usaMortgageRules);

        expect(result.transferTax).toBe(0);
    });

    it('generates amortization schedule with correct length', () => {
        const result = service.calculate(defaultInput, usaMortgageRules);

        expect(result.amortizationSchedule.length).toBe(30);
        expect(result.amortizationSchedule[0].year).toBe(1);
        expect(result.amortizationSchedule[29].balance).toBeCloseTo(0, 0);
    });

    it('amortization schedule balance decreases over time', () => {
        const result = service.calculate(defaultInput, usaMortgageRules);
        const schedule = result.amortizationSchedule;

        for (let i = 1; i < schedule.length; i++) {
            expect(schedule[i].balance).toBeLessThan(schedule[i - 1].balance);
        }
    });

    it('throws error when loan amount is zero or negative', () => {
        const input: MortgageInput = {
            ...defaultInput,
            downPayment: 400000,
        };

        expect(() => service.calculate(input, usaMortgageRules)).toThrow('Invalid loan amount');
    });

    it('otherFees includes transfer tax label', () => {
        const result = service.calculate(defaultInput, usaMortgageRules);

        expect(result.otherFees.notaryFees.label).toBe('TRANSFER_TAX');
        expect(result.otherFees.notaryFees.value).toBe(result.transferTax);
    });

    it('totalInterestPaid equals totalPaid minus loanAmount', () => {
        const result = service.calculate(defaultInput, usaMortgageRules);

        expect(result.totalInterestPaid).toBeCloseTo(result.totalPaid - result.loanAmount, 2);
    });
});
