import { ListItem } from "./ListItem";
import { ListDraft } from "./ListDraft";

export type SiteContent = {
  totalData: number;
  siteList: ListItem[];
  siteDraftList: ListDraft[];
};
