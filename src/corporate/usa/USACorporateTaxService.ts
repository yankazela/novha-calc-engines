import { Result } from "./domain/types";

export interface USACorporateTaxService {
    calculate(): Result;
}
