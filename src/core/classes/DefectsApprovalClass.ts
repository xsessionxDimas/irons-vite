import { Detail } from "@/core/types/entities/dma/defects/Detail";
import { Header } from "@/core/types/entities/dma/defects/Header";
import { filter, orderBy, keyBy } from "lodash";

export default class DefectApprovalClass {
    /* fields */
    protected smuDefectHeaders: Header[];
    protected defectHeaders: Header[];
    protected crackHeaders: Header[];
    protected cbmHeaders: Header[];
    protected defectNAHeaders: Header[];
    protected crackNAHeaders: Header[];
    protected defectDetails: Detail[];
    protected crackDetails: Detail[];
    protected defectNADetails: Detail[];
    protected crackNADetails: Detail[];
    protected defectGenericHeaders: Header[];
    protected defectGenericDetails: Detail[];
    protected smuDefectDetails: Detail[];

    public constructor() {
      /* init all arrays */
      this.smuDefectHeaders = [];
      this.defectHeaders = [];
      this.crackHeaders = [];
      this.cbmHeaders = [];
      this.defectNAHeaders = [];
      this.crackNAHeaders = [];
      this.defectDetails = [];
      this.crackDetails = [];
      this.defectNADetails = [];
      this.crackNADetails = [];
      this.defectGenericHeaders = [];
      this.defectGenericDetails = [];
      this.smuDefectDetails = [];
    }

    /* methods */
    protected setDefectHeaders(headers: Header[]) {
      this.defectHeaders = filter(headers, (i) => {
        return ((i.category === 'NORMAL' && i.taskValue == '2') || (i.category === 'NORMAL' && i.taskValue == '3' && i.cbmRatingType == 'SERVICE_CLEANED_AND_REPLACED'));
      });
    }
    protected setSMUDefectHeaders(headers: Header[]) {
      this.smuDefectHeaders = filter(headers, (i) => {
        return i.defectType == 'machineSMU';
      });
    }
    protected setDefectGenericHeaders(headers: Header[]) {
      this.defectGenericHeaders = filter(headers, (i) => {
        return i.category === 'NORMAL' && i.defectType == 'Generic';
      });
    }
    private setCrackHeaders(headers: Header[]) {
      const values = ['2', '3']
      this.crackHeaders = filter(headers, (i) => {
        return i.category === 'CRACK' && values.includes(i.taskValue);
      });
    }
    private setCBMHeaders(headers: Header[]) {
      this.cbmHeaders = filter(headers, (i) => {
        return [
          'CBM',
          'CBM-NORMAL',
        ].includes(i.category) && isNaN(Number(i.taskValue));
      });
      this.cbmHeaders = orderBy(this.cbmHeaders, [
        (obj) => {
          let number = 0
          if (isNaN(Number(obj.taskNo))) {
            let stringIndex = ''
            let continueLoop = true
            for (let i = 0; i < obj.taskNo.length; i++) {
              if (continueLoop) {
                if (isNaN(Number(obj.taskNo.charAt(i)))) {
                  stringIndex = obj.taskNo.charAt(i)
                  continueLoop = false
                }
              }
            }
            const taskNumb = Number(obj.taskNo.split(stringIndex)[0])
            return taskNumb
            // return taskNo.replace(/[a-zA-Z_]+/g, '')
          } else {
            number = Number(obj.taskNo)
          }
          // return Number(obj.taskNo.replaceAll(/[a-zA-Z_;]/g, ''));
          return number
        },
        (obj) => {
          return obj.taskNo;
        }
      ]);
    }
    protected setDefectNAHeaders(headers: Header[]) {
      this.defectNAHeaders = filter(headers, (i) => {
        return (i.category === 'NORMAL' || i.category === 'CBM') && i.taskValue === '3' && i.cbmRatingType != 'SERVICE_CLEANED_AND_REPLACED';
      });
    }
    private setCrackNAHeaders(headers: Header[]) {
      this.crackNAHeaders = filter(headers, (i) => {
        return i.category === 'CRACK' && i.taskValue === '4';
      });
    }
    private orderDetailTaskCBM() {
      this.cbmHeaders = this.cbmHeaders.sort((a, b) => {
        return a.taskNo.localeCompare(b.taskNo, 'en', {
          numeric: true
        })
      })
    }
    public setHeaders(headers: Header[]) {
      this.setSMUDefectHeaders(headers);
      this.setDefectHeaders(headers);
      this.setDefectGenericHeaders(headers)
      this.setCrackHeaders(headers);
      this.setCBMHeaders(headers);
      this.orderDetailTaskCBM();
      this.setDefectNAHeaders(headers);
      this.setCrackNAHeaders(headers);
    }
    private setDefectDetails(details: Detail[]) {
      const lookups = keyBy(this.defectHeaders, (h) => {
        return h.id;
      });
      this.defectDetails = filter(details, (d) => {
        return lookups[d.defectHeaderId] !== undefined;
      });
      this.defectDetails.forEach((d) => {
        /* find headers */
        const header = this.defectHeaders.find((h) => {
          return h.id === d.defectHeaderId;
        });
        if (header) {
          header.priority = d.detail.priority;
          header.assetNumber = d.detail.assetNumber;
          header.imageAvailable = d.detail.images != "[]";

          if (header.status == "Acknowledge" || header.status == "Submited") {
            header.numberStatus = 1
            if (header.plannerStatus == "Acknowledge" || header.plannerStatus == "Submited") {
              header.numberStatus = 1
            } else if (header.plannerStatus == "Decline") {
              header.numberStatus = 2
            }
          } else if (header.status == "Decline") {
            header.numberStatus = 2
          }
        }
      });
      this.defectHeaders = orderBy(this.defectHeaders, [
        (obj) => {
          return obj.numberStatus
        },
        (obj) => {
          return obj.priority;
        },
        (obj) => {
          return Number(obj.taskNo?.replaceAll(/[a-zA-Z]/g, ''));
        },
        (obj) => {
          return obj.taskDesc;
        }
      ]);
    }
    private setDefectGenericDetails(details: Detail[]) {
      const lookups = keyBy(this.defectGenericHeaders, (h) => {
        return h.defectHeaderId;
      });
      this.defectGenericDetails = filter(details, (d) => {
        return lookups[d.defectHeaderId] !== undefined;
      });
      this.defectGenericDetails.forEach((d) => {
        /* find headers */
        const header = this.defectGenericHeaders.find((h) => {
          return h.defectHeaderId === d.defectHeaderId;
        });
        if (header) {
          header.priority = d.detail.priority;
          header.assetNumber = d.detail.assetNumber;
          header.imageAvailable = d.detail.images != "[]";

          if (header.status == "Acknowledge" || header.status == "Submited") {
            header.numberStatus = 1
            if (header.plannerStatus == "Acknowledge" || header.plannerStatus == "Submited") {
              header.numberStatus = 1
            } else if (header.plannerStatus == "Decline") {
              header.numberStatus = 2
            }
          } else if (header.status == "Decline") {
            header.numberStatus = 2
          }
        }
      });
      this.defectGenericHeaders = orderBy(this.defectGenericHeaders, [
        (obj) => {
          return obj.numberStatus
        },
        (obj) => {
          return obj.priority;
        },
        (obj) => {
          return obj.taskDesc;
        }
      ]);
    }
    private setSMUDefectDetails(details: Detail[]) {
      const lookups = keyBy(this.smuDefectHeaders, (h) => {
        return h.id;
      });
      this.smuDefectDetails = filter(details, (d) => {
        return lookups[d.defectHeaderId] !== undefined;
      });
      this.smuDefectDetails.forEach((d) => {
        /* find headers */
        const header = this.defectGenericHeaders.find((h) => {
          return h.id === d.defectHeaderId;
        });
        if (header) {
          header.priority = d.detail.priority;
          header.assetNumber = d.detail.assetNumber;
          header.imageAvailable = d.detail.images != "[]";

          if (header.status == "Acknowledge" || header.status == "Submited") {
            header.numberStatus = 1
            if (header.plannerStatus == "Acknowledge" || header.plannerStatus == "Submited") {
              header.numberStatus = 1
            } else if (header.plannerStatus == "Decline") {
              header.numberStatus = 2
            }
          } else if (header.status == "Decline") {
            header.numberStatus = 2
          }
        }
      });
    }
    private setCrackDetails(details: Detail[]) {
      const lookups = keyBy(this.crackHeaders, (h) => {
        return h.id;
      });
      this.crackDetails = filter(details, (d) => {
        return lookups[d.defectHeaderId] !== undefined;
      });
      this.crackDetails.forEach((d) => {
        /* find headers */
        const header = this.crackHeaders.find((h) => {
          return h.id === d.defectHeaderId;
        });
        if (header) {
          header.priority = d.detail.priority;
          header.assetNumber = d.detail.assetNumber;
          header.imageAvailable = d.detail.images != "[]";

          if (header.status == "Acknowledge" || header.status == "Submited") {
            header.numberStatus = 1
            if (header.plannerStatus == "Acknowledge" || header.plannerStatus == "Submited") {
              header.numberStatus = 1
            } else if (header.plannerStatus == "Decline") {
              header.numberStatus = 2
            }
          } else if (header.status == "Decline") {
            header.numberStatus = 2
          }
        }
      });
      this.crackHeaders = orderBy(this.crackHeaders, [
        (obj) => {
          return obj.numberStatus
        },
        (obj) => {
          return obj.priority;
        },
        (obj) => {
          return Number(obj.taskNo.replaceAll(/[a-zA-Z]/g, ''));
        },
        (obj) => {
          return obj.taskDesc;
        }
      ]);
    }
    private setDefectNADetails(details: Detail[]) {
      const lookups = keyBy(this.defectNAHeaders, (h) => {
        return h.id;
      });
      this.defectNADetails = filter(details, (d) => {
        return lookups[d.defectHeaderId] !== undefined;
      })

      this.defectNADetails.forEach((d) => {
        /* find headers */
        const header = this.defectNAHeaders.find((h) => {
          return h.id === d.defectHeaderId;
        });
        if (header) {
          if (header.cbmNAStatus == "Confirmed" || header.cbmNAStatus == "Not-Confirm") {
            header.numberStatus = 1
            if (header.plannerCbmNAStatus == "Confirmed" || !header.plannerCbmNAStatus) {
              header.numberStatus = 1
            } else if (header.plannerCbmNAStatus == "Decline") {
              header.numberStatus = 2
            }
          } else if (header.cbmNAStatus == "Decline") {
            header.numberStatus = 2
          }
        }
      });
      this.defectNAHeaders = orderBy(this.defectNAHeaders, [
        (obj) => {
          return obj.numberStatus
        },
        (obj) => {
          return Number(obj.taskNo.replaceAll(/[a-zA-Z]/g, ''));
        },
        (obj) => {
          return obj.taskDesc;
        }
      ]);
    }
    private setCrackNADetails(details: Detail[]) {
      const lookups = keyBy(this.crackNAHeaders, (h) => {
        return h.id;
      });
      this.crackNADetails = filter(details, (d) => {
        return lookups[d.defectHeaderId] !== undefined;
      })

      this.crackNADetails.forEach((d) => {
        /* find headers */
        const header = this.crackNAHeaders.find((h) => {
          return h.id === d.defectHeaderId;
        });
        if (header) {
          if (header.cbmNAStatus == "Confirmed" || header.cbmNAStatus == "Not-Confirm") {
            header.numberStatus = 1
            if (header.plannerCbmNAStatus == "Confirmed" || !header.plannerCbmNAStatus) {
              header.numberStatus = 1
            } else if (header.plannerCbmNAStatus == "Decline") {
              header.numberStatus = 2
            }
          } else if (header.cbmNAStatus == "Decline") {
            header.numberStatus = 2
          }
        }
      });
      this.crackNAHeaders = orderBy(this.crackNAHeaders, [
        (obj) => {
          return obj.numberStatus
        },
        (obj) => {
          return Number(obj.taskNo.replaceAll(/[a-zA-Z]/g, ''));
        },
        (obj) => {
          return obj.taskDesc;
        }
      ]);
    }
    public setDetails(details: Detail[]) {
      this.setDefectDetails(details);
      this.setDefectGenericDetails(details);
      this.setSMUDefectDetails(details);
      this.setCrackDetails(details);
      this.setDefectNADetails(details);
      this.setCrackNADetails(details);
    }
    public updateDefectMOU(headerId: string, mou: string) {
      const header = this.defectHeaders.find((h) => {
        return h.id === headerId
      });
      if (header) {
        header.defectWorkorder = mou;
      }
    }
    public updateDefectRepairedStatus(headerId: string) {
      const header = this.defectHeaders.find((h) => {
        return h.id === headerId
      });
      if (header) {
        header.repairedStatus = "Repaired";
      }
    }
    public setDefectAcknowledge(headerId: string) {
      const header = this.defectHeaders.find((h) => {
        return h.id === headerId
      });
      if (header) {
        header.status = "Acknowledge";
      }
    }
    public updateCrackMOU(headerId: string, mou: string) {
      const header = this.crackHeaders.find((h) => {
        return h.id === headerId
      });
      if (header) {
        header.defectWorkorder = mou;
      }
    }
    public updateCrackRepairedStatus(headerId: string) {
      const header = this.crackHeaders.find((h) => {
        return h.id === headerId
      });
      if (header) {
        header.repairedStatus = "Repaired";
      }
    }
    public setCrackAcknowledge(headerId: string) {
      const header = this.crackHeaders.find((h) => {
        return h.id === headerId
      });
      if (header) {
        header.status = "Acknowledge";
      }
    }
    public setCBMAcknowledge(headerId: string) {
      const header = this.cbmHeaders.find((h) => {
        return h.id === headerId
      });
      if (header) {
        header.status = "Acknowledge";
      }
    }
    public setDefectNAAcknowledge(headerId: string) {
      const header = this.defectNAHeaders.find((h) => {
        return h.id === headerId
      });
      if (header) {
        header.status = "Acknowledge";
      }
    }
    public setCrackNAAcknowledge(headerId: string) {
      const header = this.crackNAHeaders.find((h) => {
        return h.id === headerId
      });
      if (header) {
        header.status = "Acknowledge";
      }
    }

    /* getters */
    get DefectHeaders(): Header[] {
      return this.defectHeaders;
    }
    get SMUDefectHeaders(): Header[] {
      return this.smuDefectHeaders;
    }
    get DefectGenericHeaders(): Header[] {
      return this.defectGenericHeaders;
    }
    get CrackHeaders(): Header[] {
      return this.crackHeaders;
    }
    get CBMHeaders(): Header[] {
      return this.cbmHeaders;
    }
    get DefectNAHeaders(): Header[] {
      return this.defectNAHeaders;
    }
    get CrackNAHeaders(): Header[] {
      return this.crackNAHeaders;
    }
    get DefectDetails(): Detail[] {
      return this.defectDetails;
    }
    get SMUDefectDetails(): Detail[] {
      return this.smuDefectDetails;
    }
    get DefectGenericDetails(): Detail[] {
      return this.defectGenericDetails;
    }
    get CrackDetails(): Detail[] {
      return this.crackDetails;
    }
    get DefectNADetails(): Detail[] {
      return this.defectNADetails;
    }
    get CrackNADetails(): Detail[] {
      return this.crackNADetails;
    }
}
