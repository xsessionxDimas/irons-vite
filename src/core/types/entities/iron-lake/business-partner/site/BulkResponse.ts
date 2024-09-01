export type BulkResponse = {
  totalData: number;
  siteList: SiteItem[];
};

export type SiteItem = {
  siteId: string;
  siteCode: string;
  siteName: string;
  isActive: string;
  isValid: boolean;
  validationReason: string;
};
