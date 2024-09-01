export type ListItem = {
  dailyOutstandingServiceId: number;
  equipmentNo: string;
  serviceSize: string;
  workOrder: number;
  dateService: string;
  smuDue: number;
  isActive: boolean;
  status?: string;
};

export type DraftItem = {
  dailyOutstandingServiceDraftId: number;
  equipmentNo: string;
  serviceSize: string;
  workOrder: null | number;
  dateService: string;
  smuDue: null | number;
  shift: string;
  startDate: string;
  endDate: string;
  validationReason: string;
};

// api response.result.content types ironlake
export type IronlakeContentDOS = {
  totalData: number;
  dailyOutstandingServiceList: ListItem[];
  dailyOutstandingServiceDraftList: DraftItem[];
};
