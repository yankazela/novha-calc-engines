import { Breakdown } from "../../domain/types";

export interface CapitalGainsBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface Rules {
    brackets: CapitalGainsBracket[];
}

export interface Input {
    capitalGain: number;
}
