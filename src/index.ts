export { CalculatorType } from './shared/domain/types';
export { IncomeTaxCalculatorSchema } from './income-tax/domain/types';
export * from './income-tax/domain/types';

export * as IncomeTax from './income-tax';
export * as CorporateTax from './corporate';
export * as CapitalGain from './capital-gains';
export * as Mortgage from './mortgage';
export * as InheritanceTax from './inheritance-tax';
