export default class MasterSiteList {
    site: string
    siteId: number
    siteDescription: string
    isActive: boolean
    createdOn: string
    createdBy: string
    changedOn: string
    changedBy: string
    validFrom: string
    validTo: string

    constructor() {
      this.site = ""
      this.siteId = 0
      this.siteDescription = ""
      this.isActive = false
      this.createdOn = ""
      this.createdBy = ""
      this.changedOn = ""
      this.changedBy = ""
      this.validFrom = ""
      this.validTo = ""
    }

    setSite({
      site,
      siteId,
      siteDescription,
      isActive,
      createdOn,
      createdBy,
      changedOn,
      changedBy,
      validFrom,
      validTo
    }) {
      this.site = site
      this.siteId = siteId
      this.siteDescription = siteDescription
      this.isActive = isActive
      this.createdOn = createdOn
      this.createdBy = createdBy
      this.changedOn = changedOn
      this.changedBy = changedBy
      this.validFrom = validFrom
      this.validTo = validTo
    }
}

