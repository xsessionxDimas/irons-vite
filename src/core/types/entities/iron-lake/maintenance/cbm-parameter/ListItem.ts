export type ListItem = {
  taskKey: string,
  equipmentModel: string,
  serviceSize: string,
  component: string,
  typeParameter: string,
  cbmGroup: string,
  rating: string,
  taskDescription: string,
  isActive: boolean,
  taskNo: string,
  taskNoDetail: string,
  modifiedBy: string,
  modifiedOn: string,
  cbmParameter: CbmParameter[],
};

export type CbmParameter = {
  cbmParameterId: number | null,
  status: string,
  minValue: string,
  maxValue: string,
  uom: string,
};
