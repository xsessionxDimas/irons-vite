import { filter, orderBy } from 'lodash'
import { Defect } from '@/database/schema/Defect'


export default class DefectIdentifiedClass {
  /* fields */
  protected smuDefectHeaders: Defect[];
  protected defectHeaders: Defect[]
  protected defectGenericHeaders: Defect[]
  protected crackHeaders: Defect[]
  protected cbmHeaders: Defect[]
  protected defectNAHeaders: Defect[]
  protected crackNAHeaders: Defect[]

  public constructor() {
    /* init all arrays */
    this.smuDefectHeaders = []
    this.defectHeaders = []
    this.defectGenericHeaders = []
    this.crackHeaders = []
    this.cbmHeaders = []
    this.defectNAHeaders = []
    this.crackNAHeaders = []
  }

  /* methods */
  protected setSMUDefectHeaders(headers: Defect[]) {
    this.smuDefectHeaders = filter(headers, (i) => {
      return i.defectType == 'machineSMU';
    })
  }
  protected setDefectHeaders(headers: Defect[]) {
    this.defectHeaders = filter(headers, (i) => {
      return i.category === 'NORMAL' && i.taskValue === '3'
    })
    this.defectHeaders = orderBy(this.defectHeaders, [
      (obj) => {
        return obj.priority;
      },
      (obj) => {
        return Number(obj.taskNo?.replaceAll(/[a-zA-Z]/g, ''));
      },
      (obj) => {
        return obj.taskDesc;
      }
    ])
  }
  protected setDefectGenericHeaders(headers: Defect[]) {
    this.defectGenericHeaders = filter(headers, (i) => {
      return i.category === 'NORMAL' && i.defectType == 'Generic'
    })
    this.defectGenericHeaders = orderBy(this.defectGenericHeaders, [
      (obj) => {
        return obj.priority;
      },
      (obj) => {
        return Number(obj.taskNo?.replaceAll(/[a-zA-Z]/g, ''));
      },
      (obj) => {
        return obj.taskDesc;
      }
    ])
  }
  private setCrackHeaders(headers: Defect[]) {
    const values = ['2', '3']
    this.crackHeaders = filter(headers, (i) => {
      return i.category === 'CRACK' && values.includes(i.taskValue as string)
    })
    this.crackHeaders = orderBy(this.crackHeaders, [
      (obj) => {
        return obj.priority;
      },
      (obj) => {
        return Number(obj.taskNo?.replaceAll(/[a-zA-Z]/g, ''));
      },
      (obj) => {
        return obj.taskDesc;
      }
    ])
  }
  private setCBMHeaders(headers: Defect[]) {
    this.cbmHeaders = filter(headers, (i) => {
      return [
        'CBM',
        'CBM-NORMAL'
      ].includes(i.category) && isNaN(Number(i.taskValue))
    });
    this.cbmHeaders = orderBy(this.cbmHeaders, [
      (obj) => {
        let number = 0
        if (obj.taskNo && isNaN(Number(obj.taskNo))) {
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
        } else {
          number = Number(obj.taskNo)
        }
        return number
      },
      (obj) => {
        return obj.taskNo
      }
    ])
  }
  protected setDefectNAHeaders(headers: Defect[]) {
    this.defectNAHeaders = filter(headers, (i) => {
      return (i.category === 'NORMAL' || i.category === 'CBM') && i.taskValue === '4'
    })
    this.defectNAHeaders = orderBy(this.defectNAHeaders, [
      (obj) => {
        return Number(obj.taskNo?.replaceAll(/[a-zA-Z_;]/g, ''))
      },
      (obj) => {
        return obj.taskDesc;
      }
    ])
  }
  private setCrackNAHeaders(headers: Defect[]) {
    this.crackNAHeaders = filter(headers, (i) => {
      return i.category === 'CRACK' && i.taskValue === '4';
    });
    this.crackNAHeaders = orderBy(this.crackNAHeaders, [
      (obj) => {
        return Number(obj.taskNo?.replaceAll(/[a-zA-Z_;]/g, ''));
      },
      (obj) => {
        return obj.taskDesc
      }
    ]);
  }
  private orderDetailTaskCBM() {
    this.cbmHeaders = this.cbmHeaders.sort((a, b) => {
      const taskNoA = a.taskNo as string
      const taskNoB = b.taskNo as string
      return taskNoA.localeCompare(taskNoB, 'en', {
        numeric: true
      })
    })
  }
  public setHeaders(headers: Defect[]) {
    this.setSMUDefectHeaders(headers)
    this.setDefectHeaders(headers)
    this.setDefectGenericHeaders(headers)
    this.setCrackHeaders(headers)
    this.setCBMHeaders(headers)
    this.orderDetailTaskCBM()
    this.setDefectNAHeaders(headers)
    this.setCrackNAHeaders(headers)
  }

  /* getters */
  get DefectSMUHeaders(): Defect[] {
    return this.smuDefectHeaders
  }
  get DefectHeaders(): Defect[] {
    return this.defectHeaders
  }
  get DefectGenericHeaders(): Defect[] {
    return this.defectGenericHeaders
  }
  get CrackHeaders(): Defect[] {
    return this.crackHeaders
  }
  get CBMHeaders(): Defect[] {
    return this.cbmHeaders
  }
  get DefectNAHeaders(): Defect[] {
    return this.defectNAHeaders
  }
  get CrackNAHeaders(): Defect[] {
    return this.crackNAHeaders
  }
}
