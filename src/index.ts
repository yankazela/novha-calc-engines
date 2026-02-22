export { CalculatorType } from './shared/domain/types';

// Canada
export { CanadaIncomeTaxServiceImpl as CanadaIncomeTaxService } from './income-tax/canada/CanadaIncomeTaxServiceImpl';
export { CanadaMortgageServiceImpl as CanadaMortgageService } from './mortgage/canada/CanadaMortgageServiceImpl';
export {
    ComputedIncomeTaxValues as CanadaComputedIncomeTaxValues,
    IncomeTaxRules as CanadaIncomeTaxRules,
} from './income-tax/canada/domain/types';
export {
    MortgageRules as CanadaMortgageRules,
    MortgageCalculationInput as CanadaMortgageCalculationInput,
    MortgageCalculationResult as CanadaMortgageCalculationResult,
} from './mortgage/canada/domain/types';

export { CanadaCorporateTaxServiceImpl as CanadaCorporateTaxService } from './corporate/canada/CanadaCorporateTaxServiceImpl';
export {
    Input as CanadaCorporateTaxInput,
    Rules as CanadaCorporateTaxRules,
    Result as CanadaCorporateTaxResult,
} from './corporate/canada/domain/types';

// France
export { FranceIncomeTaxServiceImpl as FranceIncomeTaxService } from './income-tax/france/FranceIncomeTaxServiceImpl';
export { FranceMortgageServiceImpl as FranceMortgageService } from './mortgage/france/FranceMortgageServiceImpl';
export { 
    ComputedIncomeTaxValues as FranceComputedIncomeTaxValues,
    IncomeTaxRules as FranceIncomeTaxRules,
} from './income-tax/france/domain/types';
export {
    MortgageRules as FranceMortgageRules,
    MortgageInput as FranceMortgageInput,
    MortgageOutput as FranceMortgageCalculationResult,
} from './mortgage/france/domain/types';

export { FranceCorporateTaxServiceImpl as FranceCorporateTaxService } from './corporate/france/FranceCorporateTaxServiceImpl';
export {
    Input as FranceCorporateTaxInput,
    Rules as FranceCorporateTaxRules,
    Result as FranceCorporateTaxResult,
} from './corporate/france/domain/types';

// South Africa
export { SouthAfricaIncomeTaxServiceImpl as SouthAfricaIncomeTaxService } from './income-tax/south-africa/SouthAfricaIncomeTaxServiceImpl';
export { SouthAfricaMortgageServiceImpl as SouthAfricaMortgageService } from './mortgage/south-africa/SouthAfricaMortgageServiceImpl';
export {
    ComputedIncomeTaxValues as SouthAfricaComputedIncomeTaxValues,
    IncomeTaxRules as SouthAfricaIncomeTaxRules,
} from './income-tax/south-africa/domain/types';
export {
    MortgageRules as SouthAfricaMortgageRules,
    MortgageInput as SouthAfricaMortgageInput,
    MortgageOutput as SouthAfricaMortgageOutput,
} from './mortgage/south-africa/domain/types';

export { SouthAfricaCorporateTaxServiceImpl as SouthAfricaCorporateTaxService } from './corporate/south-africa/SouthAfricaCorporateTaxServiceImpl';
export {
    Rules as SouthAfricaCorporateTaxRules,
    Input as SouthAfricaCorporateTaxInput,
    Result as SouthAfricaCorporateTaxResult,
} from './corporate/south-africa/domain/types';

export { IncomeTaxCalculatorSchema } from './income-tax/domain/types';
export * from './income-tax/domain/types';