import { Breakdown } from "../../domain/types";

export interface Rules {
    irpj: { baseRate: number; surchargeRate: number; surchargeThreshold: number };
    csll: { rate: number };
}

export interface Input {
    taxableIncome: number;
}

export interface Result {
    corporateTax: number;
    effectiveTaxRate: number;
    breakdowns: Breakdown[];
}
