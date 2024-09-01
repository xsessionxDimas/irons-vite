type EqpComponent = {
  componentCode: string;
  componentName: string;
}

export type ListItem = {
  equipmentNoId: number;
  siteName: string;
  equipmentNo: string;
  serialNo?: string;
  equipmentGroup: string;
  equipmentBrand: string;
  equipmentModel: string;
  engineHourMeter: number;
  engineHourMeterOffset: number;
  siteId: string;
  ownership: string;
  resetDate: string;
  modifiedOn: string;
  modifiedBy: string;
  ehmOffsetModifiedOn: string;
  ehmOffsetModifiedBy: string;
  isActive: boolean;
  isWarning: boolean;
  component: EqpComponent[];
};

export type DraftItem = {
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

// api response.result.content types ironlake
export type ContentAllEqp = {
  totalData: number;
  equipmentList: ListItem[];
  equipmentDraftList: DraftItem[];
};

export type CompListByEqp = {
  componentList: {
    componentCode: string,
    componentName: string,
  }[]
}
