export type ValidToken = {
  token: string,
  expired: number,
  lastUpdated: number,
  expiredDate?: Date,
  lastUpdatedDate?: Date
}
