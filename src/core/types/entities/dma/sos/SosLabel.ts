export interface SosLabel {
  id: string;
  key: string;
  headerId: string;
  workOrder: string;
  modelId: string;
  eformType: string;
  equipment: string;
  equipmentSerialNumber: string;
  customerName: string;
  jobSite: string;
  brandDescription: string;
  smuDue: string;
  brand: string;
  fuelType: string;
  equipmentModel: string;
  meterHrs: string;
  psTypeId?: string;
  details: Detail[];
}

export interface Detail {
  key: string;
  compartmentLubricant: string;
  sampleDate: string;
  volume: string;
  uoM: string;
  lubricantType: string;
  taskChange: string;
  taskAdded: string;
  lastMeterHrs: string;
  componentHours: string|null;
  fuelBurn: string|null;
  fluidHours: string|null;
  fluidChanged: string|null;
  filterChanged: string|null;
  oilType: string|null;
  oilGrade: string|null;
  coolant: string|null;
  fuelType: string|null;
  label: string|null;
}
