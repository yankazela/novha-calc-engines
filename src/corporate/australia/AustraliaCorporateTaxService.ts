import { Input, Result, Rules } from "./domain/types";

export interface AustraliaCorporateTaxService {
    calculate(input: Input, rules: Rules): Result;
}
