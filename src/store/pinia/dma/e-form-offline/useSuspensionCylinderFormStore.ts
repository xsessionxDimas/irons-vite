import { urlAPIBasicParam } from "@/core/const/api"
import {
  AESTShortCurrentDateTime,
  getUTCOffsetDate
} from "@/core/helpers/date-format"
import ApiService from "@/core/services/ApiService"
import { DisabledItem } from "@/core/types/entities/dma/disabledItem"
import { General } from "@/core/types/entities/dma/e-form/general/General"
import {
  GenerateSuspensionCylinderSheet
} from "@/core/types/entities/dma/e-form/generateServiceSheet"
import { Group } from "@/core/types/entities/dma/e-form/group"
import { Item } from "@/core/types/entities/dma/e-form/Item"
import {
  GetSCTemplatePayload
} from "@/core/types/entities/dma/e-form/SuspensionCylinder"
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam"
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { cloneDeep, isUndefined } from "lodash"
import { defineStore } from "pinia"
import { getSCTemplate, updateHeaderSC, updateTaskSC } from "./urls"
import { useEFormStore } from "./useEFormStore"
import { useGeneralFormStore } from "./useGeneralFormStore"
import { db } from "@/database/schema/DexieSchema"
import { useOnline } from "@vueuse/core"
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useSuspensionCylinderFormStore = defineStore({
  id: "offlineSuspensionCylinderForm",
  state: () => {
    return {
      stateShowSuspensionCylinderHeightForm: false,
      stateShowPreviewSuspensionCylinderHeightForm: false,
      stateSCCalibration: {} as Group,
      stateSCHeader: {} as General,
      stateupdateParams: [] as UpdateParam[],
      stateValidation: [] as DisabledItem[]
      // stateStatusValidation: "",
    }
  },
  getters: {
    ShowSuspensionCylinderHeightForm: (state) => {
      return state.stateShowSuspensionCylinderHeightForm
    },
    ShowPreviewSuspensionCylinderHeightForm: (state) => {
      return state.stateShowPreviewSuspensionCylinderHeightForm
    },
    eformStore: () => {
      return useEFormStore()
    },
    generalFormStore: () => {
      return useGeneralFormStore()
    },
    onlineStatus: () => {
      return useOnline()
    },
    // StatusValidation: (state) => {
    //   return state.stateStatusValidation
    // }
  },
  actions: {
    toggleShowPreviewSuspensionCylinderHeightForm(status: boolean) {
      this.stateShowPreviewSuspensionCylinderHeightForm = status
    },
    toggleShowSuspensionCylinderHeightForm(status: boolean) {
      this.stateShowSuspensionCylinderHeightForm = status
      if (!status) {
        this.stateupdateParams = []
        this.stateValidation = []
      }
    },
    async getSuspensionCalibrationTemplate(payload: GetSCTemplatePayload) {
      try {
        const response: AxiosResponse<SingleApiResponse<GenerateSuspensionCylinderSheet>> = await ApiService.post(`${getSCTemplate}?${new URLSearchParams(urlAPIBasicParam).toString()}`, payload as AxiosRequestConfig)
        this.stateSCCalibration = response.data.result.content.detail
        this.stateSCHeader = response.data.result.content.header
        return true
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log("error getSuspensionCalibrationTemplate", error);
        return false
      }
    },
    async getSuspensionCalibrationTemplateFromLocalDB(workOrder) {
      const payloadCalibration = await db.serviceFormPayloadCalibration.where({
        id: workOrder
      }).first()
      if (payloadCalibration) {
        this.stateSCHeader = payloadCalibration.header
        this.stateSCCalibration = payloadCalibration.detail
        return true
      }
      return false
    },
    generatePreAnsweredInput() {
      const generatePara = (val, key) => {
        return {
          keyValue: key,
          propertyParams: [
            {
              propertyName: 'value',
              propertyValue: val
            },
            {
              propertyName: 'updatedBy',
              propertyValue: JSON.stringify(this.eformStore.employee)
            },
            {
              propertyName: 'updatedDate',
              propertyValue: AESTShortCurrentDateTime()
            },
          ]
        }
      }
      // truck id -> equipment
      // truck serial number
      // pstType
      this.stateSCCalibration.subGroup.forEach((subG) => {
        subG.taskGroup.forEach((taskG) => {
          taskG.task.forEach((task) => {
            task.items.forEach((item: Item) => {
              if (item.itemType == "inputWithPlaceholder") {
                if (!isUndefined(item.style) && !isUndefined(item.style.placeholder)) {
                  switch (item.style.placeholder) {
                    case "Truck ID Number":
                      item.value = this.stateSCHeader.equipment
                      this.addUpdateParams(generatePara(item.value, item.key))
                      break;
                    case "Machine SMU":
                      item.value = this.generalFormStore.generalForm.smu
                      this.addUpdateParams(generatePara(item.value, item.key))
                      break;
                    case "Truck Serial Number":
                      item.value = this.stateSCHeader.serialNumber!
                      this.addUpdateParams(generatePara(item.value, item.key))
                      break;
                    case "Calibration Date":
                      item.value = `${getUTCOffsetDate(this.generalFormStore.stateTimeZone)} ${this.generalFormStore.stateTimeZoneDesc}`
                      break;
                    default:
                      break;
                  }
                }
              }
            })
          });
        })
      })
    },
    addUpdateParams(updateParam: UpdateParam) {
      let item = this.stateupdateParams.find((item) => {
        return item.keyValue == updateParam.keyValue
      })
      if (isUndefined(item)) {
        this.stateupdateParams.push(updateParam)
      } else {
        item = updateParam
        this.stateupdateParams.forEach((item) => {
          if (item.keyValue == updateParam.keyValue) {
            item.propertyParams = updateParam.propertyParams
          }
        })
      }
      console.log("item after update", this.stateupdateParams);
    },
    deleteParams(key: string) {
      this.stateupdateParams = this.stateupdateParams.filter((item) => {
        return item.keyValue != key
      })
      console.log("item after delete", this.stateupdateParams);
    },
    generateValidateInput() {
      console.log("this.stateSCCalibration", this.stateSCCalibration);
      this.stateSCCalibration.subGroup.forEach((subG) => {
        subG.taskGroup.forEach((taskG) => {
          taskG.task.forEach((task) => {
            task.items.forEach((item) => {
              if (item.isTaskValue) {
                const check = {
                  key: item.key,
                  value: item.value
                } as DisabledItem
                this.stateValidation.push(check)
              }
            })
          });
        })
      })
      console.log("statevalidation", this.stateValidation);
    },
    updateValidationValue(payload: DisabledItem) {
      this.stateValidation.forEach((item) => {
        if (item.key == payload.key) {
          item.value = payload.value
        }
      })
    },
    async submitForm() {
      // add timestamp payload
      this.stateSCCalibration.subGroup.forEach((subG) => {
        subG.taskGroup.forEach((taskG) => {
          taskG.task.forEach((task) => {
            task.items.forEach((item: Item) => {
              if (item.itemType == "inputWithPlaceholder") {
                if (!isUndefined(item.style) && !isUndefined(item.style.placeholder)) {
                  if (item.style.placeholder == "Calibration Date") {
                    const updateParam = {
                      keyValue: item.key,
                      propertyParams: [
                        {
                          propertyName: 'value',
                          propertyValue: AESTShortCurrentDateTime()
                        },
                        {
                          propertyName: 'updatedBy',
                          propertyValue: JSON.stringify(this.eformStore.employee)
                        },
                        {
                          propertyName: 'updatedDate',
                          propertyValue: AESTShortCurrentDateTime()
                        },
                      ]
                    }
                    this.addUpdateParams(updateParam)
                  }
                }
              }
            })
          });
        })
      })
      // update detail to BE
      const detailBody = {
        headerId: this.stateSCCalibration.headerId,
        workorder: this.stateSCHeader.workOrder,
        id: this.stateSCCalibration.id,
        updateParams: this.stateupdateParams,
        employee: this.eformStore.employee
      }
      if (!isOfflineOrSlowInternetConnection()) {
        await ApiService.post(`${updateTaskSC}?${new URLSearchParams(urlAPIBasicParam).toString()}`, detailBody as AxiosRequestConfig)
      } else {
        await db.pendingTask.add({
          module: 'serviceForm',
          section: 'E-Form',
          type: 'CalibrationDetail',
          workorder: this.eformStore.stateGeneralForm.workOrder,
          key: this.eformStore.stateGeneralForm.key,
          bindingKey: this.eformStore.stateGeneralForm.key,
          payload: JSON.stringify(detailBody),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
      }
      // update header to BE
      const headerBody = {
        id: this.stateSCHeader.id,
        updateParams: [
          {
            propertyParams: [
              {
                propertyName: "status",
                propertyValue: "Submitted"
              }
            ]
          }
        ],
        employee: this.eformStore.employee
      }
      if (!isOfflineOrSlowInternetConnection()) {
        await ApiService.post(`${updateHeaderSC}?${new URLSearchParams(urlAPIBasicParam).toString()}`, headerBody as AxiosRequestConfig)
      } else {
        // update header data
        this.stateSCHeader.status = "Submitted"
        // update suspension cylinder input data
        for (const taskIndex in this.stateSCCalibration.transactionCalibration) {
          if (Object.prototype.hasOwnProperty.call(this.stateSCCalibration.transactionCalibration, taskIndex)) {
            const element = this.stateSCCalibration.transactionCalibration[taskIndex];
            const eformTask = this.eformStore.getFieldValueByKey(element.key, "items")
            element.items = cloneDeep(eformTask)
          }
        }
        // add task
        await db.pendingTask.add({
          module: 'serviceForm',
          section: 'E-Form',
          type: 'CalibrationHeader',
          workorder: this.eformStore.stateGeneralForm.workOrder,
          key: this.eformStore.stateGeneralForm.key,
          bindingKey: this.eformStore.stateGeneralForm.key,
          payload: JSON.stringify(headerBody),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
        // update json to local db
        await db.serviceFormPayloadCalibration.put({
          id: cloneDeep(this.eformStore.stateGeneralForm.workOrder),
          header: cloneDeep(this.stateSCHeader),
          detail: cloneDeep(this.stateSCCalibration)
        })
      }
    }
  }
})
