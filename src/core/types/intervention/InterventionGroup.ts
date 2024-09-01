import { Section } from "./Section"

export type InterventionGroup = {
    key: string,
    group: string,
    sequence: number,
    sections: Section[]
}
