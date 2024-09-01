export type FilterData = {
  UnitNumber: string;
  SmuDue: string;
  WorkOrder: string;
  PsType: string;
  DateService: string;
  Shift: string;
  StartDate: string;
  EndDate: string;
  UnitNumberTo: string;
  SmuDueTo: string;
  WorkOrderTo: string;
  PsTypeTo: string;
  DateServiceTo: string;
  ShiftTo: string;
  StartDateTo: string;
  EndDateTo: string;
  Page: number;
  PageSize: number;
  Order: string;
  ver: string;
};

export type reqBody = {
  siteId?: string;
  equipmentNoId?: null | number | string;
  smuDue?: null | number | string;
  workOrder?: null | number | string;
  serviceSize?: string;
  dateFrom?: null | string;
  dateTo?: null | string;
  statusId?: null | number | string;
  page?: number;
  pageSize: number;
};
