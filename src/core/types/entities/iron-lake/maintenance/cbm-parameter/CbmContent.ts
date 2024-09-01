import { DraftItem } from "./DraftItem";
import { ListItem } from "./ListItem";

export type CbmContent = {
  totalData: number;
  cbmParameterList: ListItem[];
  cbmParameterDraftList: DraftItem[];
};
