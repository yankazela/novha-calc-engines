// Canada
import { CanadaMortgageServiceImpl as CanadaMortgageService } from './canada/CanadaMortgageServiceImpl';
import {
    MortgageRules as CanadaMortgageRules,
    MortgageCalculationInput as CanadaMortgageCalculationInput,
    MortgageCalculationResult as CanadaMortgageCalculationResult,
} from './canada/domain/types';

// France
import { FranceMortgageServiceImpl as FranceMortgageService } from './france/FranceMortgageServiceImpl';
import {
    MortgageRules as FranceMortgageRules,
    MortgageInput as FranceMortgageInput,
    MortgageOutput as FranceMortgageCalculationResult,
} from './france/domain/types';

// South Africa
import { SouthAfricaMortgageServiceImpl as SouthAfricaMortgageService } from './south-africa/SouthAfricaMortgageServiceImpl';
import {
    MortgageRules as SouthAfricaMortgageRules,
    MortgageInput as SouthAfricaMortgageInput,
    MortgageOutput as SouthAfricaMortgageOutput,
} from './south-africa/domain/types';

// Australia
import { AustraliaMortgageServiceImpl as AustraliaMortgageService } from './australia/AustraliaMortgageServiceImpl';
import {
    MortgageRules as AustraliaMortgageRules,
    MortgageInput as AustraliaMortgageInput,
    MortgageOutput as AustraliaMortgageOutput,
} from './australia/domain/types';


// United Kingdom
import { UKMortgageServiceImpl as UKMortgageService } from './uk/UKMortgageServiceImpl';
import {
    MortgageRules as UKMortgageRules,
    MortgageInput as UKMortgageInput,
    MortgageOutput as UKMortgageOutput,
} from './uk/domain/types';

// USA
import { USAMortgageServiceImpl as USAMortgageService } from './usa/USAMortgageServiceImpl';
import {
    MortgageRules as USAMortgageRules,
    MortgageInput as USAMortgageInput,
    MortgageOutput as USAMortgageOutput,
} from './usa/domain/types';

// Germany
import { GermanyMortgageServiceImpl as GermanyMortgageService } from './germany/GermanyMortgageServiceImpl';
import {
    MortgageRules as GermanyMortgageRules,
    MortgageInput as GermanyMortgageInput,
    MortgageOutput as GermanyMortgageOutput,
} from './germany/domain/types';

// Brazil
import { BrazilMortgageServiceImpl as BrazilMortgageService } from './brazil/BrazilMortgageServiceImpl';
import {
    MortgageRules as BrazilMortgageRules,
    MortgageInput as BrazilMortgageInput,
    MortgageOutput as BrazilMortgageOutput,
} from './brazil/domain/types';

// Spain
import { SpainMortgageServiceImpl as SpainMortgageService } from './spain/SpainMortgageServiceImpl';
import {
    MortgageRules as SpainMortgageRules,
    MortgageInput as SpainMortgageInput,
    MortgageOutput as SpainMortgageOutput,
} from './spain/domain/types';

// India
import { IndiaMortgageServiceImpl as IndiaMortgageService } from './india/IndiaMortgageServiceImpl';
import {
    MortgageRules as IndiaMortgageRules,
    MortgageInput as IndiaMortgageInput,
    MortgageOutput as IndiaMortgageOutput,
} from './india/domain/types';

// Japan
import { JapanMortgageServiceImpl as JapanMortgageService } from './japan/JapanMortgageServiceImpl';
import {
    MortgageRules as JapanMortgageRules,
    MortgageInput as JapanMortgageInput,
    MortgageOutput as JapanMortgageOutput,
} from './japan/domain/types';

export {
    CanadaMortgageService,
    CanadaMortgageRules,
    CanadaMortgageCalculationInput,
    CanadaMortgageCalculationResult,
    FranceMortgageService,
    FranceMortgageRules,
    FranceMortgageInput,
    FranceMortgageCalculationResult,
    SouthAfricaMortgageService,
    SouthAfricaMortgageRules,
    SouthAfricaMortgageInput,
    SouthAfricaMortgageOutput,
    AustraliaMortgageService,
    AustraliaMortgageRules,
    AustraliaMortgageInput,
    AustraliaMortgageOutput,
    UKMortgageService,
    UKMortgageRules,
    UKMortgageInput,
    UKMortgageOutput,
    USAMortgageService,
    USAMortgageRules,
    USAMortgageInput,
    USAMortgageOutput,
    GermanyMortgageService,
    GermanyMortgageRules,
    GermanyMortgageInput,
    GermanyMortgageOutput,
    BrazilMortgageService,
    BrazilMortgageRules,
    BrazilMortgageInput,
    BrazilMortgageOutput,
    SpainMortgageService,
    SpainMortgageRules,
    SpainMortgageInput,
    SpainMortgageOutput,
    IndiaMortgageService,
    IndiaMortgageRules,
    IndiaMortgageInput,
    IndiaMortgageOutput,
    JapanMortgageService,
    JapanMortgageRules,
    JapanMortgageInput,
    JapanMortgageOutput
};