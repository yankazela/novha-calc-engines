import { Result } from "./domain/types";

export interface IndiaCorporateTaxService {
    calculate(): Result;
}
