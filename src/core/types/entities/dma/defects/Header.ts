import { Audit } from "@/core/types/intervention/Audit";
import { DownloadHistory } from "./DownloadHistory";

export type Header = {
  id: string;
  key: string;
  defectHeaderId: string,
  serviceSheetDetailId: string;
  form: string;
  category: string;
  taskId: string;
  taskNo: string;
  taskValue: string;
  taskDesc: string;
  formDefect: string;
  priority: string;
  assetNumber: string;
  defectWorkorder: string;
  imageAvailable: boolean;
  defectType: string;
  cbmMeasurement: string;
  cbmUom: string;
  cbmImageKey: string;
  cbmImageProp: string;
  isCbmAdjusment: string;
  repairedStatus: string;
  cbmNAStatus: string;
  workorder: string | undefined;
  status: string;
  createdBy: Audit;
  createdDate: string;
  updatedBy: Audit;
  updatedDate: string;
  plannerStatus?: string;
  plannerCbmNAStatus?: string;
  declineReason?: string;
  declineBy: Audit;
  declineDate: string;
  approveReason?: string;
  plannerApproveReason?: string;
  // diisi buat sorting, kalo submited/ acknowledge = 1, kalo decline = 2
  numberStatus?: number;
  images?: string;
  interventionId?: string;

  // defect detail desc (defect review)
  descriptionDefect?: string;

  // download history
  downloadHistory?: DownloadHistory[];

  commentValue?: string;

  approvedBy: Audit;
  approvedDate: string;

  appPlannerBy?: Audit;
  appPlannerDate?: string;

  appSPVBy?: Audit;
  appSPVDate?: string;

  cbmRatingType?: string;

  correctedValue?: string;
  correctedMeasurement?: string;
  correctedUom?: string;
  cbmPistonA?: string;
  cbmPistonB?: string;
  cbmPistonResult?: string;
  cbmPistonTool?: string;
  generalStatus?: string;
  isRevised?: string
};

export type HeaderHistory = {
    defectHeaderId: string,
    pic: string,
    action: string,
    createdDate: string,
    declineReason?: string,
    approveReason?: string,
    role: string
}

export const DefectPriorityEnum = {
  P1: "P1",
  P2: "P2",
  P3: "P3",
  P4: "P4",
}
