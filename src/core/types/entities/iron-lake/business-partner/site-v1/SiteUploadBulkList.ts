export default class MasterSiteUploadBulkList {
  site: string
  siteId: number
  siteDescription: string
  isActive: boolean
  validationReason: string
  isValid: boolean

  constructor() {
    this.site = ""
    this.siteId = 0
    this.siteDescription = ""
    this.isActive = true
    this.validationReason = ""
    this.isValid = false
  }

  setSite({
    site,
    siteId,
    siteDescription,
    validationReason,
    isValid
  }) {
    this.site = site
    this.siteId = siteId ? siteId : 0
    this.siteDescription = siteDescription
    this.validationReason = validationReason
    this.isValid = isValid
  }
}

