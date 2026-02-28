import { UKMortgageServiceImpl } from '../src/mortgage/uk/UKMortgageServiceImpl';
import { MortgageInput, MortgageRules } from '../src/mortgage/uk/domain/types';

// UK 2024-25 mortgage rules
const ukMortgageRules: MortgageRules = {
    loanConstraints: {
        maxLtvPercent: 95,
        maxAmortizationYears: 35,
    },
    interest: {
        compounding: 'MONTHLY',
    },
    stampDuty: {
        standardBrackets: [
            { upTo: 250000, rate: 0 },
            { upTo: 925000, rate: 0.05 },
            { upTo: 1500000, rate: 0.10 },
            { above: 1500000, rate: 0.12 },
        ],
        firstTimeBuyer: {
            brackets: [
                { upTo: 425000, rate: 0 },
                { upTo: 625000, rate: 0.05 },
            ],
            maxEligiblePropertyPrice: 625000,
        },
    },
};

const defaultInput: MortgageInput = {
    propertyPrice: 400000,
    downPayment: 80000, // 20% down
    annualInterestRate: 5.0,
    amortizationYears: 25,
    isFirstTimeBuyer: false,
};

describe('UKMortgageServiceImpl', () => {
    const service = new UKMortgageServiceImpl();

    it('calculates loan amount correctly', () => {
        const result = service.calculate(defaultInput, ukMortgageRules);

        expect(result.loanAmount).toBe(320000);
    });

    it('calculates monthly payment using standard amortization formula', () => {
        const result = service.calculate(defaultInput, ukMortgageRules);

        const r = 0.05 / 12;
        const n = 25 * 12;
        const expected = 320000 * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        expect(result.monthlyPayment).toBeCloseTo(expected, 2);
    });

    it('totalPaid equals monthlyPayment * totalPayments', () => {
        const result = service.calculate(defaultInput, ukMortgageRules);
        const totalPayments = 25 * 12;

        expect(result.totalPaid).toBeCloseTo(result.monthlyPayment * totalPayments, 0);
    });

    it('calculates standard SDLT at 0% for property at or below £250,000', () => {
        const input: MortgageInput = {
            ...defaultInput,
            propertyPrice: 200000,
            downPayment: 40000,
        };
        const result = service.calculate(input, ukMortgageRules);

        expect(result.stampDuty).toBe(0);
    });

    it('calculates standard SDLT for property above £250,000', () => {
        // 400000: 0% on 250000 = 0, 5% on (400000 - 250000) = 7500
        const result = service.calculate(defaultInput, ukMortgageRules);

        expect(result.stampDuty).toBe(7500);
    });

    it('calculates standard SDLT for property above £925,000', () => {
        // 1000000: 0% on 250000 + 5% on 675000 + 10% on 75000
        // = 0 + 33750 + 7500 = 41250
        const input: MortgageInput = {
            ...defaultInput,
            propertyPrice: 1000000,
            downPayment: 200000,
        };
        const result = service.calculate(input, ukMortgageRules);

        expect(result.stampDuty).toBe(41250);
    });

    it('applies first-time buyer SDLT relief for eligible property', () => {
        // First-time buyer, property = 500000
        // 0% on first 425000 = 0, 5% on (500000 - 425000) = 3750
        const input: MortgageInput = {
            ...defaultInput,
            propertyPrice: 500000,
            downPayment: 100000,
            isFirstTimeBuyer: true,
        };
        const result = service.calculate(input, ukMortgageRules);

        expect(result.stampDuty).toBe(3750);
    });

    it('applies standard SDLT for first-time buyer on property above £625,000', () => {
        // First-time buyer but property > 625000 → standard rates apply
        const input: MortgageInput = {
            ...defaultInput,
            propertyPrice: 700000,
            downPayment: 140000,
            isFirstTimeBuyer: true,
        };
        const result = service.calculate(input, ukMortgageRules);

        // Standard: 0% on 250000 = 0, 5% on 450000 = 22500
        expect(result.stampDuty).toBe(22500);
    });

    it('throws error when loan amount is zero or negative', () => {
        const input: MortgageInput = {
            ...defaultInput,
            downPayment: 400000,
        };

        expect(() => service.calculate(input, ukMortgageRules)).toThrow('Invalid loan amount');
    });

    it('generates amortization schedule with correct length', () => {
        const result = service.calculate(defaultInput, ukMortgageRules);

        expect(result.amortizationSchedule.length).toBe(25);
        expect(result.amortizationSchedule[0].year).toBe(1);
        expect(result.amortizationSchedule[24].balance).toBeCloseTo(0, 0);
    });

    it('amortization schedule balance decreases over time', () => {
        const result = service.calculate(defaultInput, ukMortgageRules);
        const schedule = result.amortizationSchedule;

        for (let i = 1; i < schedule.length; i++) {
            expect(schedule[i].balance).toBeLessThan(schedule[i - 1].balance);
        }
    });

    it('otherFees includes stamp duty label', () => {
        const result = service.calculate(defaultInput, ukMortgageRules);

        expect(result.otherFees.notaryFees.label).toBe('STAMP_DUTY');
        expect(result.otherFees.notaryFees.value).toBe(result.stampDuty);
    });
});
