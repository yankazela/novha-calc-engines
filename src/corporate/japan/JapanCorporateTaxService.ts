import { Result } from "./domain/types";

export interface JapanCorporateTaxService {
    calculate(): Result;
}
