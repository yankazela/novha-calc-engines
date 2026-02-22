"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SouthAfricaMortgageServiceImpl = void 0;
class SouthAfricaMortgageServiceImpl {
    constructor(input, rules) {
        this.input = input;
        this.rules = rules;
    }
    calculate() {
        const loanAmount = this.input.propertyPrice - this.input.downPayment;
        // Monthly interest rate
        const monthlyRate = this.input.annualInterestRate / 100 / 12;
        const totalPayments = this.input.amortizationYears * 12;
        // Standard amortized monthly payment formula
        const monthlyPayment = (loanAmount * monthlyRate) /
            (1 - Math.pow(1 + monthlyRate, -totalPayments));
        const totalPaid = monthlyPayment * totalPayments;
        const totalInterestPaid = totalPaid - loanAmount;
        // Debt-to-income ratio
        const debtToIncomeRatio = (monthlyPayment / this.input.grossMonthlyIncome) * 100;
        const isAffordable = debtToIncomeRatio <= this.rules.loanConstraints.maxDebtToIncomePercent;
        // Fees
        const bondRegistrationFee = loanAmount * (this.rules.fees.bondRegistrationPercent / 100);
        const transferDuty = this.calculateTransferDuty(this.input.propertyPrice);
        const amortizationSchedule = this.calculateAmortizationSchedule(loanAmount, monthlyRate, monthlyPayment, totalPayments);
        return {
            loanAmount,
            monthlyPayment,
            totalInterestPaid,
            totalPaid,
            debtToIncomeRatio,
            isAffordable,
            transferDuty,
            bondRegistrationFee,
            amortizationSchedule,
            otherFees: {
                notaryFees: {
                    value: bondRegistrationFee,
                    label: 'BOND_REGISTRATION_FEES'
                },
                bankFees: {
                    value: transferDuty,
                    label: 'TRANSFER_DUTY'
                },
                monthlyInsuranceFees: {
                    value: 0,
                    label: 'MONTHLY_INSURANCE_FEES'
                }
            }
        };
    }
    calculateAmortizationSchedule(loanAmount, monthlyRate, monthlyPayment, totalPayments) {
        const schedule = [];
        let balance = loanAmount;
        for (let year = 1; year <= this.input.amortizationYears; year++) {
            let yearlyPrincipal = 0;
            let yearlyInterest = 0;
            // Calculate for 12 months or remaining payments
            const paymentsInYear = Math.min(12, totalPayments - (year - 1) * 12);
            for (let month = 1; month <= paymentsInYear; month++) {
                const interestPayment = balance * monthlyRate;
                const principalPayment = monthlyPayment - interestPayment;
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
    calculateTransferDuty(propertyPrice) {
        let duty = 0;
        let previousLimit = 0;
        for (const bracket of this.rules.fees.transferDuty.brackets) {
            if (bracket.upTo && propertyPrice > previousLimit) {
                const taxable = Math.min(propertyPrice, bracket.upTo) - previousLimit;
                duty += taxable * bracket.rate;
                previousLimit = bracket.upTo;
            }
            if (bracket.above && propertyPrice > bracket.above) {
                duty += (propertyPrice - bracket.above) * bracket.rate;
                break;
            }
        }
        return duty;
    }
}
exports.SouthAfricaMortgageServiceImpl = SouthAfricaMortgageServiceImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291dGhBZnJpY2FNb3J0Z2FnZVNlcnZpY2VJbXBsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vcnRnYWdlL3NvdXRoLWFmcmljYS9Tb3V0aEFmcmljYU1vcnRnYWdlU2VydmljZUltcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsTUFBYSw4QkFBOEI7SUFDekMsWUFDbUIsS0FBb0IsRUFDcEIsS0FBb0I7UUFEcEIsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUNwQixVQUFLLEdBQUwsS0FBSyxDQUFlO0lBQ3RDLENBQUM7SUFFSCxTQUFTO1FBQ1IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFFckUsd0JBQXdCO1FBQ3hCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUM3RCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztRQUV4RCw2Q0FBNkM7UUFDN0MsTUFBTSxjQUFjLEdBQ3BCLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQztZQUMxQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBRWhELE1BQU0sU0FBUyxHQUFHLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDakQsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO1FBRWpELHVCQUF1QjtRQUN2QixNQUFNLGlCQUFpQixHQUN2QixDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRXZELE1BQU0sWUFBWSxHQUNsQixpQkFBaUIsSUFBSSxJQUFJLENB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LElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUM7Z0JBQ3RFLElBQUksSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDL0IsYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDOUIsQ0FBQztZQUVELElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNwRCxJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZELE1BQU07WUFDUCxDQUFDO1FBQ0YsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztDQUNEO0FBNUhELHdFQTRIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vcnRnYWdlUnVsZXMsIE1vcnRnYWdlSW5wdXQsIE1vcnRnYWdlT3V0cHV0LCBBbW9ydGl6YXRpb25TY2hlZHVsZUl0ZW0gfSBmcm9tICcuL2RvbWFpbi90eXBlcyc7XG5pbXBvcnQgeyBTb3V0aEFmcmljYU1vcnRnYWdlU2VydmljZSB9IGZyb20gJy4vU291dGhBZnJpY2FNb3J0Z2FnZVNlcnZpY2UnO1xuXG5leHBvcnQgY2xhc3MgU291dGhBZnJpY2FNb3J0Z2FnZVNlcnZpY2VJbXBsIGltcGxlbWVudHMgU291dGhBZnJpY2FNb3J0Z2FnZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGlucHV0OiBNb3J0Z2FnZUlucHV0LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcnVsZXM6IE1vcnRnYWdlUnVsZXNcbikge31cblxuXHRjYWxjdWxhdGUoKTogTW9ydGdhZ2VPdXRwdXQge1xuXHRcdGNvbnN0IGxvYW5BbW91bnQgPSB0aGlzLmlucHV0LnByb3BlcnR5UHJpY2UgLSB0aGlzLmlucHV0LmRvd25QYXltZW50O1xuXG5cdFx0Ly8gTW9udGhseSBpbnRlcmVzdCByYXRlXG5cdFx0Y29uc3QgbW9udGhseVJhdGUgPSB0aGlzLmlucHV0LmFubnVhbEludGVyZXN0UmF0ZSAvIDEwMCAvIDEyO1xuXHRcdGNvbnN0IHRvdGFsUGF5bWVudHMgPSB0aGlzLmlucHV0LmFtb3J0aXphdGlvblllYXJzICogMTI7XG5cblx0XHQvLyBTdGFuZGFyZCBhbW9ydGl6ZWQgbW9udGhseSBwYXltZW50IGZvcm11bGFcblx0XHRjb25zdCBtb250aGx5UGF5bWVudCA9XG5cdFx0KGxvYW5BbW91bnQgKiBtb250aGx5UmF0ZSkgL1xuXHRcdCgxIC0gTWF0aC5wb3coMSArIG1vbnRobHlSYXRlLCAtdG90YWxQYXltZW50cykpO1xuXG5cdFx0Y29uc3QgdG90YWxQYWlkID0gbW9udGhseVBheW1lbnQgKiB0b3RhbFBheW1lbnRzO1xuXHRcdGNvbnN0IHRvdGFsSW50ZXJlc3RQYWlkID0gdG90YWxQYWlkIC0gbG9hbkFtb3VudDtcblxuXHRcdC8vIERlYnQtdG8taW5jb21lIHJhdGlvXG5cdFx0Y29uc3QgZGVidFRvSW5jb21lUmF0aW8gPVxuXHRcdChtb250aGx5UGF5bWVudCAvIHRoaXMuaW5wdXQuZ3Jvc3NNb250aGx5SW5jb21lKSAqIDEwMDtcblxuXHRcdGNvbnN0IGlzQWZmb3JkYWJsZSA9XG5cdFx0ZGVidFRvSW5jb21lUmF0aW8gPD0gdGhpcy5ydWxlcy5sb2FuQ29uc3RyYWludHMubWF4RGVidFRvSW5jb21lUGVyY2VudDtcblxuXHRcdC8vIEZlZXNcblx0XHRjb25zdCBib25kUmVnaXN0cmF0aW9uRmVlID1cblx0XHRsb2FuQW1vdW50ICogKHRoaXMucnVsZXMuZmVlcy5ib25kUmVnaXN0cmF0aW9uUGVyY2VudCAvIDEwMCk7XG5cblx0XHRjb25zdCB0cmFuc2ZlckR1dHkgPSB0aGlzLmNhbGN1bGF0ZVRyYW5zZmVyRHV0eSh0aGlzLmlucHV0LnByb3BlcnR5UHJpY2UpO1xuXHRcdGNvbnN0IGFtb3J0aXphdGlvblNjaGVkdWxlID0gdGhpcy5jYWxjdWxhdGVBbW9ydGl6YXRpb25TY2hlZHVsZShcblx0XHRcdGxvYW5BbW91bnQsXG5cdFx0XHRtb250aGx5UmF0ZSxcblx0XHRcdG1vbnRobHlQYXltZW50LFxuXHRcdFx0dG90YWxQYXltZW50c1xuXHRcdCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bG9hbkFtb3VudCxcblx0XHRcdG1vbnRobHlQYXltZW50LFxuXHRcdFx0dG90YWxJbnRlcmVzdFBhaWQsXG5cdFx0XHR0b3RhbFBhaWQsXG5cdFx0XHRkZWJ0VG9JbmNvbWVSYXRpbyxcblx0XHRcdGlzQWZmb3JkYWJsZSxcblx0XHRcdHRyYW5zZmVyRHV0eSxcblx0XHRcdGJvbmRSZWdpc3RyYXRpb25GZWUsXG5cdFx0XHRhbW9ydGl6YXRpb25TY2hlZHVsZSxcblx0XHRcdG90aGVyRmVlczoge1xuICAgICAgICAgICAgICAgIG5vdGFyeUZlZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGJvbmRSZWdpc3RyYXRpb25GZWUsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQk9ORF9SRUdJU1RSQVRJT05fRkVFUydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJhbmtGZWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cmFuc2ZlckR1dHksXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnVFJBTlNGRVJfRFVUWSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1vbnRobHlJbnN1cmFuY2VGZWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ01PTlRITFlfSU5TVVJBTkNFX0ZFRVMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXHRcdH07XG5cdH1cblxuXHRwcml2YXRlIGNhbGN1bGF0ZUFtb3J0aXphdGlvblNjaGVkdWxlKFxuXHRcdGxvYW5BbW91bnQ6IG51bWJlcixcblx0XHRtb250aGx5UmF0ZTogbnVtYmVyLFxuXHRcdG1vbnRobHlQYXltZW50OiBudW1iZXIsXG5cdFx0dG90YWxQYXltZW50czogbnVtYmVyXG5cdCk6IEFtb3J0aXphdGlvblNjaGVkdWxlSXRlbVtdIHtcblx0XHRjb25zdCBzY2hlZHVsZTogQW1vcnRpemF0aW9uU2NoZWR1bGVJdGVtW10gPSBbXTtcblx0XHRsZXQgYmFsYW5jZSA9IGxvYW5BbW91bnQ7XG5cblx0XHRmb3IgKGxldCB5ZWFyID0gMTsgeWVhciA8PSB0aGlzLmlucHV0LmFtb3J0aXphdGlvblllYXJzOyB5ZWFyKyspIHtcblx0XHRcdGxldCB5ZWFybHlQcmluY2lwYWwgPSAwO1xuXHRcdFx0bGV0IHllYXJseUludGVyZXN0ID0gMDtcblxuXHRcdFx0Ly8gQ2FsY3VsYXRlIGZvciAxMiBtb250aHMgb3IgcmVtYWluaW5nIHBheW1lbnRzXG5cdFx0XHRjb25zdCBwYXltZW50c0luWWVhciA9IE1hdGgubWluKDEyLCB0b3RhbFBheW1lbnRzIC0gKHllYXIgLSAxKSAqIDEyKTtcblxuXHRcdFx0Zm9yIChsZXQgbW9udGggPSAxOyBtb250aCA8PSBwYXltZW50c0luWWVhcjsgbW9udGgrKykge1xuXHRcdFx0XHRjb25zdCBpbnRlcmVzdFBheW1lbnQgPSBiYWxhbmNlICogbW9udGhseVJhdGU7XG5cdFx0XHRcdGNvbnN0IHByaW5jaXBhbFBheW1lbnQgPSBtb250aGx5UGF5bWVudCAtIGludGVyZXN0UGF5bWVudDtcblxuXHRcdFx0XHR5ZWFybHlJbnRlcmVzdCArPSBpbnRlcmVzdFBheW1lbnQ7XG5cdFx0XHRcdHllYXJseVByaW5jaXBhbCArPSBwcmluY2lwYWxQYXltZW50O1xuXHRcdFx0XHRiYWxhbmNlIC09IHByaW5jaXBhbFBheW1lbnQ7XG5cdFx0XHR9XG5cblx0XHRcdHNjaGVkdWxlLnB1c2goe1xuXHRcdFx0XHR5ZWFyLFxuXHRcdFx0XHRwcmluY2lwYWw6IHllYXJseVByaW5jaXBhbCxcblx0XHRcdFx0aW50ZXJlc3Q6IHllYXJseUludGVyZXN0LFxuXHRcdFx0XHRiYWxhbmNlOiBNYXRoLm1heCgwLCBiYWxhbmNlKVxuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChiYWxhbmNlIDw9IDApIGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBzY2hlZHVsZTtcblx0fVxuXG5cdHByaXZhdGUgY2FsY3VsYXRlVHJhbnNmZXJEdXR5KHByb3BlcnR5UHJpY2U6IG51bWJlcik6IG51bWJlciB7XG5cdFx0bGV0IGR1dHkgPSAwO1xuXHRcdGxldCBwcmV2aW91c0xpbWl0ID0gMDtcblxuXHRcdGZvciAoY29uc3QgYnJhY2tldCBvZiB0aGlzLnJ1bGVzLmZlZXMudHJhbnNmZXJEdXR5LmJyYWNrZXRzKSB7XG5cdFx0XHRpZiAoYnJhY2tldC51cFRvICYmIHByb3BlcnR5UHJpY2UgPiBwcmV2aW91c0xpbWl0KSB7XG5cdFx0XHRcdGNvbnN0IHRheGFibGUgPSBNYXRoLm1pbihwcm9wZXJ0eVByaWNlLCBicmFja2V0LnVwVG8pIC0gcHJldmlvdXNMaW1pdDtcblx0XHRcdFx0ZHV0eSArPSB0YXhhYmxlICogYnJhY2tldC5yYXRlO1xuXHRcdFx0XHRwcmV2aW91c0xpbWl0ID0gYnJhY2tldC51cFRvO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYnJhY2tldC5hYm92ZSAmJiBwcm9wZXJ0eVByaWNlID4gYnJhY2tldC5hYm92ZSkge1xuXHRcdFx0XHRkdXR5ICs9IChwcm9wZXJ0eVByaWNlIC0gYnJhY2tldC5hYm92ZSkgKiBicmFja2V0LnJhdGU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBkdXR5O1xuXHR9XG59XG4iXX0=