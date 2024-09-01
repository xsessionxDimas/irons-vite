export type PreviousCrack = {
  currentCrack: string,
  locationDesc: string,
  locationId: string,
  previousCrack: string
}

export type PreviousCrackWithValidationState = {
  currentCrack: string,
  locationDesc: string,
  locationId: string,
  previousCrack: string
  isValid: boolean
  errorMessage: string
}
