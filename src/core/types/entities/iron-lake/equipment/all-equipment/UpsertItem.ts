export type UpsertItem = {
  equipmentUnitId?: null | number;
  equipmentDraftId?: number;
  equipmentUnit: string;
  siteName: string;
  serialNo: string;
  group: string;
  brandName: string;
  model: string;
  ownership: string;
  engineHourMeter?: null | number | string;
  engineHourMeterOffset: null | number | string;
  componentCode?: string;
  componentName?: string;
  resetDate?: string | null;
  isActive: boolean;
  isWarning?: boolean;
};
