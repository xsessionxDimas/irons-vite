export interface SosHistory {
  id:                    string;
  key:                   string;
  headerId:              string;
  workOrder:             string;
  eformType:             string;
  modelId:               string;
  equipment:             string;
  psTypeId:              string|null;
  equipmentSerialNumber: string;
  equipmentModel:        string;
  customerName:          string;
  jobSite:               string;
  brandDescription:      string;
  meterHrs:              string;
  brand:                 string;
  fuelType:              string;
  createdDate:           string;
  details:               string|null;
}
