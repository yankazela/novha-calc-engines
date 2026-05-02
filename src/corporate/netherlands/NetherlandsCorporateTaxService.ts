import { Result } from "./domain/types";

export interface NetherlandsCorporateTaxService {
    calculate(): Result;
}
