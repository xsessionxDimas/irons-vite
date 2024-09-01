export type Images = {
  filename: string,
  description: string
}
export type Attachment = Pick<Images, 'filename'> & { url: string }
export type Labours = {
  position: string,
  qty: string,
  hireEach: string,
  totalHours: string,
}
export type Parts = {
  partNumberFormatted: string,
  partNumber: string,
  partDescription: string,
  qty: string,
  attachment: Attachment[],
  images: Images[],
}
export type CrackLength = {
  locationId: string,
  locationDesc: string,
  previousCrack: string,
  currentCrack: string,
}
type Basic = {
  type: string
  assetNumber: string
  title: string
  raisedBy: string
  date: string
  images: Images[]
  description: string,
}
export type CrackYesDetail = Basic & {
  priority: string,
  instruction: string,
  plannedDuration: string,
  parts: Parts[],
  labours: Labours[],
  resources: string[],
  symptoms: string[],
  causes: string[],
  previousCracks: CrackLength[],
  referencePhoto: string
  referenceSection: string
}
export type DefectYesDetail = Omit<CrackYesDetail, 'previousCracks' | 'referencePhoto' | 'referenceSection'>;

export type DefectYesDetailRaw = DefectYesDetail & {
  parts: string,
  labours: string,
  resources: string,
  symptoms: string,
  causes: string,
};
export type CrackYesDetailRaw = CrackYesDetail & {
  parts: string,
  labours: string,
  resources: string,
  symptoms: string,
  causes: string,
};

export type ReferencePhoto = {
  title: string,
  blob: string,
  dimension: {
    height: number,
    width: number,
  },
  id: string
}
