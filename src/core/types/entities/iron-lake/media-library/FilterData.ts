export type FilterData = {
  Id: string;
  StartDate: string;
  EndDate: string;
  FileType: string;
  Page: number;
  PageSize: number;
  Order: string;
  ver: string;
};

export type reqBody = {
  id?: null | string;
  startDate?: null | string;
  endDate?: null | string;
  code?: null | string;
  desc?: null | string;
  fileType?: null | number | string;
  order: string;
  page?: number;
  pageSize: number;
};
