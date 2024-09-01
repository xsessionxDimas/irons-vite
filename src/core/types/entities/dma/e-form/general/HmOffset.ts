export type HmOffset = {
  equipmentNo: string,
  hmOffset: number,
  resetDate: string,
  createdOn: string,
  createdBy: string,
  modifiedOn: string,
  modifiedBy: string,
  SiteId: string,
  SiteName: string
}

export type ResponseHmOffset = {
  totalData: number,
  hmOffsetList: HmOffset[]
}
