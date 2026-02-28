import { Result } from "./domain/types";

export interface UKCorporateTaxService {
    calculate(): Result;
}
