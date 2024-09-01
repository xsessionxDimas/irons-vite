import { Header } from "@/core/types/entities/dma/defects/Header";
import { filter, orderBy } from "lodash";
import DefectApprovalClass from "./DefectsApprovalClass";

export default class InterventionDefectApprovalClass extends DefectApprovalClass {
  /* methods */
  protected setDefectHeaders(headers: Header[]) {
    this.defectHeaders = filter(headers, (i) => {
      return i.category === 'NORMAL' && i.taskValue === '3';
    });
  }
  protected setDefectNAHeaders(headers: Header[]) {
    this.defectNAHeaders = filter(headers, (i) => {
      return (i.category === 'NORMAL' || i.category === 'CBM') && i.taskValue === '4';
    });
    this.defectNAHeaders = orderBy(this.defectNAHeaders, [
      (obj) => {
        return Number(obj.taskNo.replaceAll(/[a-zA-Z_;]/g, ''));
      },
      (obj) => {
        return obj.taskDesc;
      }
    ]);
  }
}
