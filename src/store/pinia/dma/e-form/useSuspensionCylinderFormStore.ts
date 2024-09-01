import { urlAPIBasicParam } from "@/core/const/api"
import { getUTCOffsetDate } from "@/core/helpers/date-format"
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
import { isUndefined } from "lodash"
import { defineStore } from "pinia"
import { getSCTemplate, updateHeaderSC, updateTaskSC } from "./urls"
import { useEFormStore } from "./useEFormStore"
import { useGeneralFormStore } from "./useGeneralFormStore"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useSuspensionCylinderFormStore = defineStore({
  id: "suspensionCylinderForm",
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
    SCCalibration: (state) => {
      return state.stateSCCalibration
    },
    SCHeader: (state) => {
      return state.stateSCHeader
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
              propertyValue: '<<ServerDateTime>>'
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
    },
    deleteParams(key: string) {
      this.stateupdateParams = this.stateupdateParams.filter((item) => {
        return item.keyValue != key
      })
    },
    generateValidateInput() {
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
                          propertyValue: '<<ServerDateTime>>'
                        },
                        {
                          propertyName: 'updatedBy',
                          propertyValue: JSON.stringify(this.eformStore.employee)
                        },
                        {
                          propertyName: 'updatedDate',
                          propertyValue: '<<ServerDateTime>>'
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
      const res = await ApiService.post(`${updateTaskSC}?${new URLSearchParams(urlAPIBasicParam).toString()}`, detailBody as AxiosRequestConfig)
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
      const headerRes = await ApiService.post(`${updateHeaderSC}?${new URLSearchParams(urlAPIBasicParam).toString()}`, headerBody as AxiosRequestConfig)
    }
  }
})
