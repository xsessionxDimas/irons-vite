export type ValidatedItem = {
  unitNumber: string;
  smuDue: string;
  workOrder: string;
  psType: string;
  dateService: string;
  shift: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isValid: boolean;
  isWarning: boolean;
  validationReason: string;
};

// api response.result.content types ironlake
export type IronlakeContentBulkUpload = {
  totalData: number;
  dailyOutstandingServiceList: ValidatedItem[];
};

export type ValidatedDraftItem = {
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
