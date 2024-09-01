export type ServiceFormPreviousTandem = {
  id: string,
  previousTandem : PreviousTandemTask[]
}

export type PreviousTandemTask = {
  workOrderPrev: null | string,
  key: string,
  locationId: string,
  locationDesc: string,
  previousTandem: string,
  currentTandem: string
}