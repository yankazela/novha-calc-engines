import { Input, Rules, Result } from '../canada/domain/types';

export interface CanadaCorporateTaxService {
    calculate(): Result;
}