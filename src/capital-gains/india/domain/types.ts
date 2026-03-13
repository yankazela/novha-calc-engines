import { Breakdown } from "../../domain/types";

export interface Rules {
    shortTermRate: number;
    longTermRate: number;
    longTermExemption: number;
}

export interface Input {
    capitalGain: number;
    holdingPeriodMonths: number;
}
