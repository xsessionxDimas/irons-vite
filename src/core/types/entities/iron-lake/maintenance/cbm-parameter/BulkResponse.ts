import { ValidatedItem } from "../maintenance-strategy/ValidatedItem";

export type BulkResponse = {
  totalData: number;
  cbmParameterList: ValidatedItem[];
};
