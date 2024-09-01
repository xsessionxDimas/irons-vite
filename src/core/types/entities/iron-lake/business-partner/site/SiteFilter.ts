export default class MasterSiteFilter {
  Site: string
  SiteDescription: string
  order: string
  page: string
  pageSize: string
  ver = "v1"

  constructor() {
    this.Site = ""
    this.SiteDescription = ""
    this.order = ""
    this.page = "1"
    this.pageSize = "10"
  }

  setAllFilter({
    Site,
    SiteDescription
  }) {
    this.Site = Site
    this.SiteDescription = SiteDescription
  }
}
