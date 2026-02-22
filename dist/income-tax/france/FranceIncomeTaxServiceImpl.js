"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FranceIncomeTaxServiceImpl = void 0;
class FranceIncomeTaxServiceImpl {
    constructor(income, rules, familyParts) {
        this._income = income;
        this._rules = rules;
        this._familyParts = familyParts;
    }
    calculateNetIncome() {
        const taxablePerPart = this._familyParts * this._income / this._familyParts;
        const { tax: taxPerPart, marginalRate, bracketBreakdown } = this.calculateProgressiveTax(taxablePerPart);
        const incomeTax = taxPerPart * this._familyParts;
        const socialContributions = this._income * this._rules.socialContributions.employee.rate;
        const totalDeductions = incomeTax + socialContributions;
        const netIncome = this._income - totalDeductions;
        return {
            grossIncome: this._income,
            incomeTax: this.round(incomeTax),
            socialContributions: this.round(socialContributions),
            totalDeductions: this.round(totalDeductions),
            netIncome: this.round(netIncome),
            averageTaxRate: this.round(incomeTax / this._income),
            marginalTaxRate: marginalRate,
            taxBracketBreakdown: bracketBreakdown,
        };
    }
    calculateProgressiveTax(income) {
        let tax = 0;
        let marginalRate = 0;
        const bracketBreakdown = [];
        for (let index = 0; index < this._rules.taxBrackets.length; index++) {
            const bracket = this._rules.taxBrackets[index];
            const upperBound = bracket.to ?? income;
            if (income <= bracket.from) {
                bracketBreakdown.push({
                    bracketIndex: index,
                    bracketName: `Bracket ${index + 1}`,
                    from: bracket.from,
                    to: bracket.to ?? null,
                    rate: bracket.rate,
                    amountInBracket: 0,
                    taxOnAmount: 0,
                });
                break;
            }
            const taxableAmount = Math.min(upperBound, income) - bracket.from;
            if (taxableAmount > 0) {
                tax += taxableAmount * bracket.rate;
                marginalRate = bracket.rate;
                bracketBreakdown.push({
                    bracketIndex: index,
                    bracketName: `Bracket ${index + 1}`,
                    from: bracket.from,
                    to: bracket.to ?? null,
                    rate: bracket.rate,
                    amountInBracket: taxableAmount,
                    taxOnAmount: taxableAmount * bracket.rate,
                });
            }
            else {
                bracketBreakdown.push({
                    bracketIndex: index,
                    bracketName: `Bracket ${index + 1}`,
                    from: bracket.from,
                    to: bracket.to ?? null,
                    rate: bracket.rate,
                    amountInBracket: 0,
                    taxOnAmount: 0,
                });
            }
        }
        return { tax, marginalRate, bracketBreakdown };
    }
    round(value) {
        return Math.round(value * 100) / 100;
    }
}
exports.FranceIncomeTaxServiceImpl = FranceIncomeTaxServiceImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnJhbmNlSW5jb21lVGF4U2VydmljZUltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5jb21lLXRheC9mcmFuY2UvRnJhbmNlSW5jb21lVGF4U2VydmljZUltcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsTUFBYSwwQkFBMEI7SUFLbkMsWUFBWSxNQUFjLEVBQUUsS0FBcUIsRUFBRSxXQUFtQjtRQUNsRSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztJQUNwQyxDQUFDO0lBRU0sa0JBQWtCO1FBRTNCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzVFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN6RyxNQUFNLFNBQVMsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNqRCxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pGLE1BQU0sZUFBZSxHQUFHLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztRQUN4RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQztRQUVqRCxPQUFPO1lBQ04sV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3pCLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNoQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFD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QyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3RDLENBQUM7Q0FDRDtBQTVGRCxnRUE0RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCcmFja2V0QWxsb2NhdGlvbiB9IGZyb20gXCIuLi9kb21haW4vdHlwZXNcIjtcbmltcG9ydCB7IENvbXB1dGVkSW5jb21lVGF4VmFsdWVzLCBJbmNvbWVUYXhSdWxlcyB9IGZyb20gXCIuL2RvbWFpbi90eXBlc1wiO1xuaW1wb3J0IHsgRnJhbmNlSW5jb21lVGF4U2VydmljZSB9IGZyb20gXCIuL0ZyYW5jZUluY29tZVRheFNlcnZpY2VcIjtcblxuZXhwb3J0IGNsYXNzIEZyYW5jZUluY29tZVRheFNlcnZpY2VJbXBsIGltcGxlbWVudHMgRnJhbmNlSW5jb21lVGF4U2VydmljZSB7XG4gICAgcHJpdmF0ZSBfaW5jb21lOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfcnVsZXM6IEluY29tZVRheFJ1bGVzO1xuICAgIHByaXZhdGUgX2ZhbWlseVBhcnRzOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihpbmNvbWU6IG51bWJlciwgcnVsZXM6IEluY29tZVRheFJ1bGVzLCBmYW1pbHlQYXJ0czogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2luY29tZSA9IGluY29tZTtcbiAgICAgICAgdGhpcy5fcnVsZXMgPSBydWxlcztcbiAgICAgICAgdGhpcy5fZmFtaWx5UGFydHMgPSBmYW1pbHlQYXJ0cztcbiAgICB9XG5cbiAgICBwdWJsaWMgY2FsY3VsYXRlTmV0SW5jb21lKCk6IENvbXB1dGVkSW5jb21lVGF4VmFsdWVzIHtcblxuXHRcdGNvbnN0IHRheGFibGVQZXJQYXJ0ID0gdGhpcy5fZmFtaWx5UGFydHMgKiB0aGlzLl9pbmNvbWUgLyB0aGlzLl9mYW1pbHlQYXJ0cztcblx0XHRjb25zdCB7IHRheDogdGF4UGVyUGFydCwgbWFyZ2luYWxSYXRlLCBicmFja2V0QnJlYWtkb3duIH0gPSB0aGlzLmNhbGN1bGF0ZVByb2dyZXNzaXZlVGF4KHRheGFibGVQZXJQYXJ0KTtcblx0XHRjb25zdCBpbmNvbWVUYXggPSB0YXhQZXJQYXJ0ICogdGhpcy5fZmFtaWx5UGFydHM7XG5cdFx0Y29uc3Qgc29jaWFsQ29udHJpYnV0aW9ucyA9IHRoaXMuX2luY29tZSAqIHRoaXMuX3J1bGVzLnNvY2lhbENvbnRyaWJ1dGlvbnMuZW1wbG95ZWUucmF0ZTtcblx0XHRjb25zdCB0b3RhbERlZHVjdGlvbnMgPSBpbmNvbWVUYXggKyBzb2NpYWxDb250cmlidXRpb25zO1xuXHRcdGNvbnN0IG5ldEluY29tZSA9IHRoaXMuX2luY29tZSAtIHRvdGFsRGVkdWN0aW9ucztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRncm9zc0luY29tZTogdGhpcy5faW5jb21lLFxuXHRcdFx0aW5jb21lVGF4OiB0aGlzLnJvdW5kKGluY29tZVRheCksXG5cdFx0XHRzb2NpYWxDb250cmlidXRpb25zOiB0aGlzLnJvdW5kKHNvY2lhbENvbnRyaWJ1dGlvbnMpLFxuXHRcdFx0dG90YWxEZWR1Y3Rpb25zOiB0aGlzLnJvdW5kKHRvdGFsRGVkdWN0aW9ucyksXG5cdFx0XHRuZXRJbmNvbWU6IHRoaXMucm91bmQobmV0SW5jb21lKSxcblx0XHRcdGF2ZXJhZ2VUYXhSYXRlOiB0aGlzLnJvdW5kKGluY29tZVRheCAvIHRoaXMuX2luY29tZSksXG5cdFx0XHRtYXJnaW5hbFRheFJhdGU6IG1hcmdpbmFsUmF0ZSxcblx0XHRcdHRheEJyYWNrZXRCcmVha2Rvd246IGJyYWNrZXRCcmVha2Rvd24sXG5cdFx0fTtcblx0fVxuXG5cbiAgICBwcml2YXRlIGNhbGN1bGF0ZVByb2dyZXNzaXZlVGF4KGluY29tZTogbnVtYmVyKToge1xuICAgICAgICB0YXg6IG51bWJlcjtcbiAgICAgICAgbWFyZ2luYWxSYXRlOiBudW1iZXI7XG4gICAgICAgIGJyYWNrZXRCcmVha2Rvd246IEJyYWNrZXRBbGxvY2F0aW9uW107XG4gICAgfSB7XG5cdFx0bGV0IHRheCA9IDA7XG5cdFx0bGV0IG1hcmdpbmFsUmF0ZSA9IDA7XG5cdFx0Y29uc3QgYnJhY2tldEJyZWFrZG93bjogQnJhY2tldEFsbG9jYXRpb25bXSA9IFtdO1xuXG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuX3J1bGVzLnRheEJyYWNrZXRzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0Y29uc3QgYnJhY2tldCA9IHRoaXMuX3J1bGVzLnRheEJyYWNrZXRzW2luZGV4XTtcblx0XHRcdGNvbnN0IHVwcGVyQm91bmQgPSBicmFja2V0LnRvID8/IGluY29tZTtcblxuXHRcdFx0aWYgKGluY29tZSA8PSBicmFja2V0LmZyb20pIHtcblx0XHRcdFx0YnJhY2tldEJyZWFrZG93bi5wdXNoKHtcblx0XHRcdFx0XHRicmFja2V0SW5kZXg6IGluZGV4LFxuXHRcdFx0XHRcdGJyYWNrZXROYW1lOiBgQnJhY2tldCAke2luZGV4ICsgMX1gLFxuXHRcdFx0XHRcdGZyb206IGJyYWNrZXQuZnJvbSxcblx0XHRcdFx0XHR0bzogYnJhY2tldC50byA/PyBudWxsLFxuXHRcdFx0XHRcdHJhdGU6IGJyYWNrZXQucmF0ZSxcblx0XHRcdFx0XHRhbW91bnRJbkJyYWNrZXQ6IDAsXG5cdFx0XHRcdFx0dGF4T25BbW91bnQ6IDAsXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdGF4YWJsZUFtb3VudCA9IE1hdGgubWluKHVwcGVyQm91bmQsIGluY29tZSkgLSBicmFja2V0LmZyb207XG5cblx0XHRcdGlmICh0YXhhYmxlQW1vdW50ID4gMCkge1xuXHRcdFx0XHR0YXggKz0gdGF4YWJsZUFtb3VudCAqIGJyYWNrZXQucmF0ZTtcblx0XHRcdFx0bWFyZ2luYWxSYXRlID0gYnJhY2tldC5yYXRlO1xuXHRcdFx0XHRicmFja2V0QnJlYWtkb3duLnB1c2goe1xuXHRcdFx0XHRcdGJyYWNrZXRJbmRleDogaW5kZXgsXG5cdFx0XHRcdFx0YnJhY2tldE5hbWU6IGBCcmFja2V0ICR7aW5kZXggKyAxfWAsXG5cdFx0XHRcdFx0ZnJvbTogYnJhY2tldC5mcm9tLFxuXHRcdFx0XHRcdHRvOiBicmFja2V0LnRvID8/IG51bGwsXG5cdFx0XHRcdFx0cmF0ZTogYnJhY2tldC5yYXRlLFxuXHRcdFx0XHRcdGFtb3VudEluQnJhY2tldDogdGF4YWJsZUFtb3VudCxcblx0XHRcdFx0XHR0YXhPbkFtb3VudDogdGF4YWJsZUFtb3VudCAqIGJyYWNrZXQucmF0ZSxcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRicmFja2V0QnJlYWtkb3duLnB1c2goe1xuXHRcdFx0XHRcdGJyYWNrZXRJbmRleDogaW5kZXgsXG5cdFx0XHRcdFx0YnJhY2tldE5hbWU6IGBCcmFja2V0ICR7aW5kZXggKyAxfWAsXG5cdFx0XHRcdFx0ZnJvbTogYnJhY2tldC5mcm9tLFxuXHRcdFx0XHRcdHRvOiBicmFja2V0LnRvID8/IG51bGwsXG5cdFx0XHRcdFx0cmF0ZTogYnJhY2tldC5yYXRlLFxuXHRcdFx0XHRcdGFtb3VudEluQnJhY2tldDogMCxcblx0XHRcdFx0XHR0YXhPbkFtb3VudDogMCxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHsgdGF4LCBtYXJnaW5hbFJhdGUsIGJyYWNrZXRCcmVha2Rvd24gfTtcblx0fVxuXG4gICAgcHJpdmF0ZSByb3VuZCh2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIDEwMCkgLyAxMDA7XG5cdH1cbn1cbiJdfQ==