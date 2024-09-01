import { ParameterItem } from "./ParameterItem";

export type UpdateForm = {
  description: string;
  equipmentModel: string;
  serviceSize: string;
  component: string;
  cbmGroup: string;
  typeParameter: string;
  uom: string;
  parameters: ParameterItem[];
};
