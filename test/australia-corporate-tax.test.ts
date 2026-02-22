import { AustraliaCorporateTaxServiceImpl } from '../src/corporate/australia/AustraliaCorporateTaxServiceImpl';
import { Input, Rules } from '../src/corporate/australia/domain/types';

// Australia 2024-25 corporate tax rules
const australiaCorporateRules: Rules = {
    regimes: {
        general: {
            type: 'flat',
            rate: 0.30,
        },
        smallBusiness: {
            type: 'flat',
            rate: 0.25,
            conditions: {
                maxTurnover: 50_000_000,
            },
        },
    },
};

describe('AustraliaCorporateTaxServiceImpl', () => {
    it('applies general (30%) rate for large businesses', () => {
        const input: Input = {
            taxableIncome: 1_000_000,
            annualTurnover: 200_000_000,
            isSmallBusiness: false,
        };
        const service = new AustraliaCorporateTaxServiceImpl(input, australiaCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(300_000);
        expect(result.effectiveTaxRate).toBe(30);
    });

    it('applies small business (25%) rate', () => {
        const input: Input = {
            taxableIncome: 500_000,
            annualTurnover: 10_000_000,
            isSmallBusiness: true,
        };
        const service = new AustraliaCorporateTaxServiceImpl(input, australiaCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(125_000);
        expect(result.effectiveTaxRate).toBe(25);
    });

    it('throws error when small business turnover limit is exceeded', () => {
        const input: Input = {
            taxableIncome: 500_000,
            annualTurnover: 60_000_000,
            isSmallBusiness: true,
        };
        const service = new AustraliaCorporateTaxServiceImpl(input, australiaCorporateRules);

        expect(() => service.calculate()).toThrow('Small business regime not applicable: turnover exceeded');
    });

    it('returns zero tax for zero taxable income', () => {
        const input: Input = {
            taxableIncome: 0,
            annualTurnover: 5_000_000,
            isSmallBusiness: false,
        };
        const service = new AustraliaCorporateTaxServiceImpl(input, australiaCorporateRules);
        const result = service.calculate();

        expect(result.corporateTax).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });

    it('returns correct breakdowns for flat rate', () => {
        const input: Input = {
            taxableIncome: 100_000,
            annualTurnover: 1_000_000,
            isSmallBusiness: false,
        };
        const service = new AustraliaCorporateTaxServiceImpl(input, australiaCorporateRules);
        const result = service.calculate();

        expect(result.breakdowns).toHaveLength(1);
        expect(result.breakdowns[0].rate).toBe(0.30);
        expect(result.breakdowns[0].amount).toBe(30_000);
    });

    it('calculates effective tax rate correctly', () => {
        const input: Input = {
            taxableIncome: 1_000_000,
            annualTurnover: 200_000_000,
            isSmallBusiness: false,
        };
        const service = new AustraliaCorporateTaxServiceImpl(input, australiaCorporateRules);
        const result = service.calculate();

        expect(result.effectiveTaxRate).toBe(30);
    });
});
