export default class MasterSitePost {
  siteId: number
  site: string
  siteDescription: string
  isActive: boolean

  constructor() {
    this.site = ""
    this.siteId = 0
    this.siteDescription = ""
    this.isActive = true
  }

  setSite({
    site,
    siteId,
    siteDescription,
    isActive,
  }) {
    this.site = site
    this.siteId = siteId
    this.siteDescription = siteDescription
    this.isActive = isActive
  }
}
