// Capital Gains - Canada
import { CanadaCapitalGainsServiceImpl as CanadaCapitalGainsService } from './canada/CanadaCapitalGainsServiceImpl';
import {
    Input as CanadaCapitalGainsInput,
    Rules as CanadaCapitalGainsRules
} from './canada/domain/types';

// Capital Gains - France
import { FranceCapitalGainsServiceImpl as FranceCapitalGainsService } from './france/FranceCapitalGainsServiceImpl';
import {
    Input as FranceCapitalGainsInput,
    Rules as FranceCapitalGainsRules
} from './france/domain/types';

// Capital Gains - South Africa
import { SouthAfricaCapitalGainsServiceImpl as SouthAfricaCapitalGainsService } from './south-africa/SouthAfricaCapitalGainsServiceImpl';
import {
    Input as SouthAfricaCapitalGainsInput,
    Rules as SouthAfricaCapitalGainsRules
} from './south-africa/domain/types';

// Capital Gains - Australia
import { AustraliaCapitalGainsServiceImpl as AustraliaCapitalGainsService } from './australia/AustraliaCapitalGainsServiceImpl';
import {
    Input as AustraliaCapitalGainsInput,
    Rules as AustraliaCapitalGainsRules
} from './australia/domain/types';

// Capital Gains - UK
import { UKCapitalGainsServiceImpl as UKCapitalGainsService } from './uk/UKCapitalGainsServiceImpl';
import {
    Input as UKCapitalGainsInput,
    Rules as UKCapitalGainsRules
} from './uk/domain/types';

// Capital Gains - USA
import { USACapitalGainsServiceImpl as USACapitalGainsService } from './usa/USACapitalGainsServiceImpl';
import {
    Input as USACapitalGainsInput,
    Rules as USACapitalGainsRules
} from './usa/domain/types';

// Capital Gains - Germany
import { GermanyCapitalGainsServiceImpl as GermanyCapitalGainsService } from './germany/GermanyCapitalGainsServiceImpl';
import {
    Input as GermanyCapitalGainsInput,
    Rules as GermanyCapitalGainsRules
} from './germany/domain/types';
import { Result } from './domain/types';

export {
    CanadaCapitalGainsService,
    CanadaCapitalGainsInput,
    CanadaCapitalGainsRules,
    FranceCapitalGainsService,
    FranceCapitalGainsInput,
    FranceCapitalGainsRules,
    SouthAfricaCapitalGainsService,
    SouthAfricaCapitalGainsInput,
    SouthAfricaCapitalGainsRules,
    AustraliaCapitalGainsService,
    AustraliaCapitalGainsInput,
    AustraliaCapitalGainsRules,
    UKCapitalGainsService,
    UKCapitalGainsInput,
    UKCapitalGainsRules,
    USACapitalGainsService,
    USACapitalGainsInput,
    USACapitalGainsRules,
    GermanyCapitalGainsService,
    GermanyCapitalGainsInput,
    GermanyCapitalGainsRules,
    Result
};