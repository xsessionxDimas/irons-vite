export type ValidatedItem = {
  siteName: string;
  equipmentUnit: string;
  serialNo: string;
  group: string;
  brandName: string;
  model: string;
  ownership: string;
  engineHourMeter: number;
  engineHourMeterOffset: number;
  resetDate: null | string;
  componentCode: string;
  componentName: string;
  isActive: boolean;
  isWarning: boolean;
  isValid: boolean;
  previousEngineHourMeterOffset: number;
  validationReason: string;
};

// api response.result.content types ironlake
export type IronlakeContentBulkUpload = {
  totalData: number;
  equipmentList: ValidatedItem[];
};

export type ValidatedDraftItem = {
  equipmentNoDraftId: number;
  siteName: string | null;
  equipmentNo: string;
  serialNo: string;
  equipmentGroup: string;
  equipmentBrand: string;
  equipmentModel: string;
  engineHourMeter: number;
  engineHourMeterOffset: number;
  ownership: string;
  componentCode: string | null;
  componentName: string | null;
  modifiedOn: string;
  modifiedBy: number;
  validationReason: string;
};
