import { Result } from "./domain/types";

export interface SwitzerlandCorporateTaxService {
    calculate(): Result;
}
