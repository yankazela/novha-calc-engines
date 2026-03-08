import { Breakdown } from "../../domain/types";

export interface TaxBracket {
    from: number;
    to: number | null;
    rate: number;
}

export interface RelationshipClass {
    exemption: number;
    brackets: TaxBracket[];
}

export interface Rules {
    relationships: {
        spouse: RelationshipClass;
        child: RelationshipClass;
        sibling: RelationshipClass;
        other: RelationshipClass;
    };
}

export type RelationshipType = 'spouse' | 'child' | 'sibling' | 'other';

export interface Input {
    estateValue: number;
    relationship: RelationshipType;
}

export interface Result {
    taxableEstate: number;
    inheritanceTax: number;
    effectiveRate: number;
    breakdowns: Breakdown[];
}
