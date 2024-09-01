export interface SosPayloadEdit {
  id: string;
  workOrder: string;
  employee: Employee;
  updateParams: SosUpdateParams[];
}

export interface Employee {
  id: string,
  name: string
}

export interface SosUpdateParams {
  keyValue: string,
  propertyParams: SosPropertyParams[]
}

export interface SosPropertyParams {
  propertyName: string,
  propertyValue: string
}
