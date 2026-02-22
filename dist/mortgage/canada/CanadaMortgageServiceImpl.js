"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanadaMortgageServiceImpl = void 0;
class CanadaMortgageServiceImpl {
    calculate(input, rules) {
        const { propertyPrice, downPayment, amortizationYears, paymentFrequency } = input;
        const interestRate = input.interestRate / 100;
        /* -----------------------------
           1. Loan Amount & LTV
        ------------------------------ */
        const loanAmount = propertyPrice - downPayment;
        if (loanAmount <= 0) {
            throw new Error('Invalid loan amount');
        }
        const ltv = loanAmount / propertyPrice;
        /* -----------------------------
           2. CMHC Insurance
        ------------------------------ */
        let insurancePremium = 0;
        if (ltv > rules.mortgageInsurance.requiredBelowLtv) {
            const premiumRule = rules.mortgageInsurance.premiumRates
                .find(r => ltv <= r.maxLtv);
            if (!premiumRule) {
                throw new Error('LTV exceeds maximum insurable limit');
            }
            insurancePremium = loanAmount * premiumRule.rate;
        }
        const totalMortgage = rules.mortgageInsurance.premiumAddedToLoan
            ? loanAmount + insurancePremium
            : loanAmount;
        /* -----------------------------
           3. Interest Rate Conversion
           (Canada semi-annual compounding)
        ------------------------------ */
        const periodicRate = this.convertCanadianRate(interestRate, rules.interest.compounding, rules.paymentFrequencyRules[paymentFrequency].paymentsPerYear);
        /* -----------------------------
           4. Payment Frequency
        ------------------------------ */
        const frequencyRule = rules.paymentFrequencyRules[paymentFrequency];
        const paymentsPerYear = frequencyRule.paymentsPerYear;
        const totalPayments = amortizationYears * paymentsPerYear;
        /* -----------------------------
           5. Mortgage Payment Formula
           P = L × [ r(1+r)^n ] / [ (1+r)^n − 1 ]
        ------------------------------ */
        const paymentAmount = this.calculatePayment(totalMortgage, periodicRate, totalPayments);
        /* -----------------------------
           6. Totals
        ------------------------------ */
        const totalPaid = paymentAmount * totalPayments;
        const totalInterestPaid = totalPaid - totalMortgage;
        const amortizationSchedule = this.calculateAmortizationSchedule(totalMortgage, periodicRate, paymentAmount, totalPayments, amortizationYears, paymentsPerYear);
        return {
            loanAmount: loanAmount,
            insurancePremium: insurancePremium,
            totalMortgage: totalMortgage,
            monthlyPayment: paymentAmount,
            totalInterestPaid: totalInterestPaid,
            totalPaid: totalPaid,
            amortizationSchedule: amortizationSchedule,
            otherFees: {
                notaryFees: {
                    value: 0,
                    label: 'NOTARY_FEES'
                },
                bankFees: {
                    value: 0,
                    label: 'BANK_FEES'
                },
                monthlyInsuranceFees: {
                    value: insurancePremium,
                    label: 'INSURANCE_PREMIUM'
                }
            }
        };
    }
    /* ======================================================
       Helper Methods
    ====================================================== */
    calculateAmortizationSchedule(principal, periodicRate, paymentAmount, totalPayments, amortizationYears, paymentsPerYear) {
        const schedule = [];
        let balance = principal;
        for (let year = 1; year <= amortizationYears; year++) {
            let yearlyPrincipal = 0;
            let yearlyInterest = 0;
            const paymentsInYear = Math.min(paymentsPerYear, totalPayments - (year - 1) * paymentsPerYear);
            for (let payment = 1; payment <= paymentsInYear; payment++) {
                const interestPayment = balance * periodicRate;
                const principalPayment = paymentAmount - interestPayment;
                yearlyInterest += interestPayment;
                yearlyPrincipal += principalPayment;
                balance -= principalPayment;
            }
            schedule.push({
                year,
                principal: yearlyPrincipal,
                interest: yearlyInterest,
                balance: Math.max(0, balance)
            });
            if (balance <= 0)
                break;
        }
        return schedule;
    }
    convertCanadianRate(annualRate, compounding, paymentsPerYear) {
        if (compounding !== 'SEMI_ANNUAL') {
            throw new Error('Only Canadian semi-annual compounding supported');
        }
        // Canadian standard conversion
        const semiAnnualRate = annualRate / 2;
        const effectiveAnnualRate = Math.pow(1 + semiAnnualRate, 2) - 1;
        return Math.pow(1 + effectiveAnnualRate, 1 / paymentsPerYear) - 1;
    }
    calculatePayment(principal, rate, periods) {
        if (rate === 0) {
            return principal / periods;
        }
        return principal *
            (rate * Math.pow(1 + rate, periods)) /
            (Math.pow(1 + rate, periods) - 1);
    }
}
exports.CanadaMortgageServiceImpl = CanadaMortgageServiceImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FuYWRhTW9ydGdhZ2VTZXJ2aWNlSW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb3J0Z2FnZS9jYW5hZGEvQ2FuYWRhTW9ydGdhZ2VTZXJ2aWNlSW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxNQUFhLHlCQUF5QjtJQUU3QixTQUFTLENBQUMsS0FBK0IsRUFBRSxLQUFvQjtRQUVwRSxNQUFNLEVBQ0osYUFBYSxFQUNiLFdBQVcsRUFDWCxpQkFBaUIsRUFDakIsZ0JBQWdCLEVBQ2pCLEdBQUcsS0FBSyxDQUFDO1FBRVYsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7UUFFOUM7O3lDQUVpQztRQUVqQyxNQUFNLFVBQVUsR0FBRyxhQUFhLEdBQUcsV0FBVyxDQUFDO1FBQy9DLElBQUksVUFBVSxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBRUQsTUFBTSxHQUFHLEdBQUcsVUFBVSxHQUFHLGFBQWEsQ0FBQztRQUV2Qzs7eUNBRWlDO1FBRWpDLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBRXpCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ25ELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZO2lCQUNyRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTlCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ3pELENBQUM7WUFFRCxnQkFBZ0IsR0FBRyxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztRQUNuRCxDQUFDO1FB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SUFDdEMsQ0FBQztDQUNGO0FBekxELDhEQXlMQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhbmFkYU1vcnRnYWdlU2VydmljZSB9IGZyb20gJy4vQ2FuYWRhTW9ydGdhZ2VTZXJ2aWNlJztcbmltcG9ydCB7XG4gIE1vcnRnYWdlUnVsZXMsXG4gIE1vcnRnYWdlQ2FsY3VsYXRpb25JbnB1dCxcbiAgTW9ydGdhZ2VDYWxjdWxhdGlvblJlc3VsdCxcbiAgQW1vcnRpemF0aW9uU2NoZWR1bGVJdGVtXG59IGZyb20gJy4vZG9tYWluL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIENhbmFkYU1vcnRnYWdlU2VydmljZUltcGwgaW1wbGVtZW50cyBDYW5hZGFNb3J0Z2FnZVNlcnZpY2Uge1xuXG4gIHB1YmxpYyBjYWxjdWxhdGUoaW5wdXQ6IE1vcnRnYWdlQ2FsY3VsYXRpb25JbnB1dCwgcnVsZXM6IE1vcnRnYWdlUnVsZXMpOiBNb3J0Z2FnZUNhbGN1bGF0aW9uUmVzdWx0IHtcblxuICAgIGNvbnN0IHtcbiAgICAgIHByb3BlcnR5UHJpY2UsXG4gICAgICBkb3duUGF5bWVudCxcbiAgICAgIGFtb3J0aXphdGlvblllYXJzLFxuICAgICAgcGF5bWVudEZyZXF1ZW5jeVxuICAgIH0gPSBpbnB1dDtcblxuICAgIGNvbnN0IGludGVyZXN0UmF0ZSA9IGlucHV0LmludGVyZXN0UmF0ZSAvIDEwMDtcblxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgMS4gTG9hbiBBbW91bnQgJiBMVFZcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgIGNvbnN0IGxvYW5BbW91bnQgPSBwcm9wZXJ0eVByaWNlIC0gZG93blBheW1lbnQ7XG4gICAgaWYgKGxvYW5BbW91bnQgPD0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGxvYW4gYW1vdW50Jyk7XG4gICAgfVxuXG4gICAgY29uc3QgbHR2ID0gbG9hbkFtb3VudCAvIHByb3BlcnR5UHJpY2U7XG5cbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIDIuIENNSEMgSW5zdXJhbmNlXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICBsZXQgaW5zdXJhbmNlUHJlbWl1bSA9IDA7XG5cbiAgICBpZiAobHR2ID4gcnVsZXMubW9ydGdhZ2VJbnN1cmFuY2UucmVxdWlyZWRCZWxvd0x0dikge1xuICAgICAgY29uc3QgcHJlbWl1bVJ1bGUgPSBydWxlcy5tb3J0Z2FnZUluc3VyYW5jZS5wcmVtaXVtUmF0ZXNcbiAgICAgICAgLmZpbmQociA9PiBsdHYgPD0gci5tYXhMdHYpO1xuXG4gICAgICBpZiAoIXByZW1pdW1SdWxlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTFRWIGV4Y2VlZHMgbWF4aW11bSBpbnN1cmFibGUgbGltaXQnKTtcbiAgICAgIH1cblxuICAgICAgaW5zdXJhbmNlUHJlbWl1bSA9IGxvYW5BbW91bnQgKiBwcmVtaXVtUnVsZS5yYXRlO1xuICAgIH1cblxuICAgIGNvbnN0IHRvdGFsTW9ydGdhZ2UgPSBydWxlcy5tb3J0Z2FnZUluc3VyYW5jZS5wcmVtaXVtQWRkZWRUb0xvYW5cbiAgICAgID8gbG9hbkFtb3VudCArIGluc3VyYW5jZVByZW1pdW1cbiAgICAgIDogbG9hbkFtb3VudDtcblxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgMy4gSW50ZXJlc3QgUmF0ZSBDb252ZXJzaW9uXG4gICAgICAgKENhbmFkYSBzZW1pLWFubnVhbCBjb21wb3VuZGluZylcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgIGNvbnN0IHBlcmlvZGljUmF0ZSA9IHRoaXMuY29udmVydENhbmFkaWFuUmF0ZShcbiAgICAgIGludGVyZXN0UmF0ZSxcbiAgICAgIHJ1bGVzLmludGVyZXN0LmNvbXBvdW5kaW5nLFxuICAgICAgcnVsZXMucGF5bWVudEZyZXF1ZW5jeVJ1bGVzW3BheW1lbnRGcmVxdWVuY3ldLnBheW1lbnRzUGVyWWVhclxuICAgICk7XG5cbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIDQuIFBheW1lbnQgRnJlcXVlbmN5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICBjb25zdCBmcmVxdWVuY3lSdWxlID0gcnVsZXMucGF5bWVudEZyZXF1ZW5jeVJ1bGVzW3BheW1lbnRGcmVxdWVuY3ldO1xuICAgIGNvbnN0IHBheW1lbnRzUGVyWWVhciA9IGZyZXF1ZW5jeVJ1bGUucGF5bWVudHNQZXJZZWFyO1xuICAgIGNvbnN0IHRvdGFsUGF5bWVudHMgPSBhbW9ydGl6YXRpb25ZZWFycyAqIHBheW1lbnRzUGVyWWVhcjtcblxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgNS4gTW9ydGdhZ2UgUGF5bWVudCBGb3JtdWxhXG4gICAgICAgUCA9IEwgw5cgWyByKDErcilebiBdIC8gWyAoMStyKV5uIOKIkiAxIF1cbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgIGNvbnN0IHBheW1lbnRBbW91bnQgPSB0aGlzLmNhbGN1bGF0ZVBheW1lbnQoXG4gICAgICB0b3RhbE1vcnRnYWdlLFxuICAgICAgcGVyaW9kaWNSYXRlLFxuICAgICAgdG90YWxQYXltZW50c1xuICAgICk7XG5cbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIDYuIFRvdGFsc1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgY29uc3QgdG90YWxQYWlkID0gcGF5bWVudEFtb3VudCAqIHRvdGFsUGF5bWVudHM7XG4gICAgY29uc3QgdG90YWxJbnRlcmVzdFBhaWQgPSB0b3RhbFBhaWQgLSB0b3RhbE1vcnRnYWdlO1xuXG4gICAgY29uc3QgYW1vcnRpemF0aW9uU2NoZWR1bGUgPSB0aGlzLmNhbGN1bGF0ZUFtb3J0aXphdGlvblNjaGVkdWxlKFxuICAgICAgdG90YWxNb3J0Z2FnZSxcbiAgICAgIHBlcmlvZGljUmF0ZSxcbiAgICAgIHBheW1lbnRBbW91bnQsXG4gICAgICB0b3RhbFBheW1lbnRzLFxuICAgICAgYW1vcnRpemF0aW9uWWVhcnMsXG4gICAgICBwYXltZW50c1BlclllYXJcbiAgICApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxvYW5BbW91bnQ6IGxvYW5BbW91bnQsXG4gICAgICBpbnN1cmFuY2VQcmVtaXVtOiBpbnN1cmFuY2VQcmVtaXVtLFxuICAgICAgdG90YWxNb3J0Z2FnZTogdG90YWxNb3J0Z2FnZSxcbiAgICAgIG1vbnRobHlQYXltZW50OiBwYXltZW50QW1vdW50LFxuICAgICAgdG90YWxJbnRlcmVzdFBhaWQ6IHRvdGFsSW50ZXJlc3RQYWlkLFxuICAgICAgdG90YWxQYWlkOiB0b3RhbFBhaWQsXG4gICAgICBhbW9ydGl6YXRpb25TY2hlZHVsZTogYW1vcnRpemF0aW9uU2NoZWR1bGUsXG4gICAgICBvdGhlckZlZXM6IHtcbiAgICAgICAgbm90YXJ5RmVlczoge1xuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBsYWJlbDogJ05PVEFSWV9GRUVTJ1xuICAgICAgICB9LFxuICAgICAgICBiYW5rRmVlczoge1xuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBsYWJlbDogJ0JBTktfRkVFUydcbiAgICAgICAgfSxcbiAgICAgICAgbW9udGhseUluc3VyYW5jZUZlZXM6IHtcbiAgICAgICAgICAgIHZhbHVlOiBpbnN1cmFuY2VQcmVtaXVtLFxuICAgICAgICAgICAgbGFiZWw6ICdJTlNVUkFOQ0VfUFJFTUlVTSdcbiAgICAgICAgfVxuICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgIEhlbHBlciBNZXRob2RzXG4gID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gIHByaXZhdGUgY2FsY3VsYXRlQW1vcnRpemF0aW9uU2NoZWR1bGUoXG4gICAgcHJpbmNpcGFsOiBudW1iZXIsXG4gICAgcGVyaW9kaWNSYXRlOiBudW1iZXIsXG4gICAgcGF5bWVudEFtb3VudDogbnVtYmVyLFxuICAgIHRvdGFsUGF5bWVudHM6IG51bWJlcixcbiAgICBhbW9ydGl6YXRpb25ZZWFyczogbnVtYmVyLFxuICAgIHBheW1lbnRzUGVyWWVhcjogbnVtYmVyXG4gICk6IEFtb3J0aXphdGlvblNjaGVkdWxlSXRlbVtdIHtcbiAgICBjb25zdCBzY2hlZHVsZTogQW1vcnRpemF0aW9uU2NoZWR1bGVJdGVtW10gPSBbXTtcbiAgICBsZXQgYmFsYW5jZSA9IHByaW5jaXBhbDtcblxuICAgIGZvciAobGV0IHllYXIgPSAxOyB5ZWFyIDw9IGFtb3J0aXphdGlvblllYXJzOyB5ZWFyKyspIHtcbiAgICAgIGxldCB5ZWFybHlQcmluY2lwYWwgPSAwO1xuICAgICAgbGV0IHllYXJseUludGVyZXN0ID0gMDtcblxuICAgICAgY29uc3QgcGF5bWVudHNJblllYXIgPSBNYXRoLm1pbihwYXltZW50c1BlclllYXIsIHRvdGFsUGF5bWVudHMgLSAoeWVhciAtIDEpICogcGF5bWVudHNQZXJZZWFyKTtcblxuICAgICAgZm9yIChsZXQgcGF5bWVudCA9IDE7IHBheW1lbnQgPD0gcGF5bWVudHNJblllYXI7IHBheW1lbnQrKykge1xuICAgICAgICBjb25zdCBpbnRlcmVzdFBheW1lbnQgPSBiYWxhbmNlICogcGVyaW9kaWNSYXRlO1xuICAgICAgICBjb25zdCBwcmluY2lwYWxQYXltZW50ID0gcGF5bWVudEFtb3VudCAtIGludGVyZXN0UGF5bWVudDtcblxuICAgICAgICB5ZWFybHlJbnRlcmVzdCArPSBpbnRlcmVzdFBheW1lbnQ7XG4gICAgICAgIHllYXJseVByaW5jaXBhbCArPSBwcmluY2lwYWxQYXltZW50O1xuICAgICAgICBiYWxhbmNlIC09IHByaW5jaXBhbFBheW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIHNjaGVkdWxlLnB1c2goe1xuICAgICAgICB5ZWFyLFxuICAgICAgICBwcmluY2lwYWw6IHllYXJseVByaW5jaXBhbCxcbiAgICAgICAgaW50ZXJlc3Q6IHllYXJseUludGVyZXN0LFxuICAgICAgICBiYWxhbmNlOiBNYXRoLm1heCgwLCBiYWxhbmNlKVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChiYWxhbmNlIDw9IDApIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBzY2hlZHVsZTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydENhbmFkaWFuUmF0ZShcbiAgICBhbm51YWxSYXRlOiBudW1iZXIsXG4gICAgY29tcG91bmRpbmc6ICdTRU1JX0FOTlVBTCcgfCAnQU5OVUFMJyB8ICdNT05USExZJyxcbiAgICBwYXltZW50c1BlclllYXI6IG51bWJlclxuICApOiBudW1iZXIge1xuXG4gICAgaWYgKGNvbXBvdW5kaW5nICE9PSAnU0VNSV9BTk5VQUwnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgQ2FuYWRpYW4gc2VtaS1hbm51YWwgY29tcG91bmRpbmcgc3VwcG9ydGVkJyk7XG4gICAgfVxuXG4gICAgLy8gQ2FuYWRpYW4gc3RhbmRhcmQgY29udmVyc2lvblxuICAgIGNvbnN0IHNlbWlBbm51YWxSYXRlID0gYW5udWFsUmF0ZSAvIDI7XG4gICAgY29uc3QgZWZmZWN0aXZlQW5udWFsUmF0ZSA9IE1hdGgucG93KDEgKyBzZW1pQW5udWFsUmF0ZSwgMikgLSAxO1xuXG4gICAgcmV0dXJuIE1hdGgucG93KDEgKyBlZmZlY3RpdmVBbm51YWxSYXRlLCAxIC8gcGF5bWVudHNQZXJZZWFyKSAtIDE7XG4gIH1cblxuICBwcml2YXRlIGNhbGN1bGF0ZVBheW1lbnQocHJpbmNpcGFsOiBudW1iZXIsIHJhdGU6IG51bWJlciwgcGVyaW9kczogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAocmF0ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHByaW5jaXBhbCAvIHBlcmlvZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByaW5jaXBhbCAqXG4gICAgICAocmF0ZSAqIE1hdGgucG93KDEgKyByYXRlLCBwZXJpb2RzKSkgL1xuICAgICAgKE1hdGgucG93KDEgKyByYXRlLCBwZXJpb2RzKSAtIDEpO1xuICB9XG59XG4iXX0=