// Canada
import { CanadaIncomeTaxServiceImpl as CanadaIncomeTaxService } from './canada/CanadaIncomeTaxServiceImpl';
import {
    ComputedIncomeTaxValues as CanadaComputedIncomeTaxValues,
    IncomeTaxRules as CanadaIncomeTaxRules,
} from './canada/domain/types';
import { FranceIncomeTaxServiceImpl as FranceIncomeTaxService } from './france/FranceIncomeTaxServiceImpl';

// France
import { 
    ComputedIncomeTaxValues as FranceComputedIncomeTaxValues,
    IncomeTaxRules as FranceIncomeTaxRules,
} from './france/domain/types';

// South Africa
import { SouthAfricaIncomeTaxServiceImpl as SouthAfricaIncomeTaxService } from './south-africa/SouthAfricaIncomeTaxServiceImpl';
import {
    ComputedIncomeTaxValues as SouthAfricaComputedIncomeTaxValues,
    IncomeTaxRules as SouthAfricaIncomeTaxRules,
} from './south-africa/domain/types';

// Australia
import { AustraliaIncomeTaxServiceImpl as AustraliaIncomeTaxService } from './australia/AustraliaIncomeTaxServiceImpl';
import {
    ComputedIncomeTaxValues as AustraliaComputedIncomeTaxValues,
    IncomeTaxRules as AustraliaIncomeTaxRules,
} from './australia/domain/types';

// UK
import { UKIncomeTaxServiceImpl as UKIncomeTaxService } from './uk/UKIncomeTaxServiceImpl';
import {
    ComputedIncomeTaxValues as UKComputedIncomeTaxValues,
    IncomeTaxRules as UKIncomeTaxRules,
} from './uk/domain/types';

// USA
import { USAIncomeTaxServiceImpl as USAIncomeTaxService } from './usa/USAIncomeTaxServiceImpl';
import {
    ComputedIncomeTaxValues as USAComputedIncomeTaxValues,
    IncomeTaxRules as USAIncomeTaxRules,
} from './usa/domain/types';

// Germany
import { GermanyIncomeTaxServiceImpl as GermanyIncomeTaxService } from './germany/GermanyIncomeTaxServiceImpl';
import {
    ComputedIncomeTaxValues as GermanyComputedIncomeTaxValues,
    IncomeTaxRules as GermanyIncomeTaxRules,
} from './germany/domain/types';

export {
    CanadaIncomeTaxService,
    CanadaComputedIncomeTaxValues,
    CanadaIncomeTaxRules,
    FranceIncomeTaxService,
    FranceComputedIncomeTaxValues,
    FranceIncomeTaxRules,
    SouthAfricaIncomeTaxService,
    SouthAfricaComputedIncomeTaxValues,
    SouthAfricaIncomeTaxRules,
    AustraliaIncomeTaxService,
    AustraliaComputedIncomeTaxValues,
    AustraliaIncomeTaxRules,
    UKIncomeTaxService,
    UKComputedIncomeTaxValues,
    UKIncomeTaxRules,
    USAIncomeTaxService,
    USAComputedIncomeTaxValues,
    USAIncomeTaxRules,
    GermanyIncomeTaxService,
    GermanyComputedIncomeTaxValues,
    GermanyIncomeTaxRules,
};