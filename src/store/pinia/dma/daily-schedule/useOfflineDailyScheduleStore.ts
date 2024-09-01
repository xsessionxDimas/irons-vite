import { defineStore } from "pinia";
import { Option } from "@/core/types/misc/Option";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import ApiService from "@/core/services/ApiService";
import {
  DAILY_SCHEDULE_API_URL,
  DAILY_SCHEDULE_INTERIM_API_URL,
  GET_ATTACHEMNT_LIST_SERVICE_FORM,
  GET_PREVIOUS_CRACK_BY_WO,
  GET_SAS_URL_IMAGE_BY_ID
} from "./urls";
import {
  OfflineDailySchedule as DailySchedule
} from "@/core/types/entities/dma/daily-schedule/OfflineDailySchedule";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import { db } from '@/database/schema/DexieSchema'
import {
  clone,
  cloneDeep,
  isEmpty,
  isUndefined
} from "lodash";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  GenerateServiceSheet
} from "@/core/types/entities/dma/e-form/OfflineGenerateServiceSheet";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";

import {
  GENERATE_SERVICE_SHEET_API_URL,
  GET_TASK_PROGRESS_API_URL
} from "../e-form/urls";
import { General } from "@/core/types/entities/dma/e-form/general/General";
import { useOnline } from "@vueuse/core";
import { TaskProgress } from "@/core/types/entities/dma/e-form/taskProgress";
import { Header } from "@/core/types/entities/dma/defects/Header";
import {
  GET_DEFECTS_ALL_SECTION,
  GET_DEFECTS_DETAIL,
  GET_DEFECTS_HEADER
} from "../e-form/defects/urls";
import { Detail } from "@/core/types/entities/dma/defects/Detail";
import { ServiceSheetDefect } from "@/database/schema/ServiceSheetDefect";
import { formatInternationalDate } from "@/core/helpers/date-format";
import {
  ResponseHmOffset
} from "@/core/types/entities/dma/e-form/general/HmOffset";
import { GET_HM_OFFSET } from "../e-form-offline/urls";
import {
  clearDefectListFromLocalDB,
  dumpDefectListToLocalDB,
  dumpServiceFormComments
} from "@/core/helpers/ironforms/offline/defect-form";
import {
  MultiplePreviousCrack
} from "@/core/types/entities/dma/e-form/cracks/MultiplePreviousCrack";
import {
  ListDefectSections
} from "@/core/types/entities/dma/defects/ListDefectSections";
import {
  GetSCTemplatePayload
} from "@/core/types/entities/dma/e-form/SuspensionCylinder";
import {
  useSuspensionCylinderFormStore
} from "../e-form-offline/useSuspensionCylinderFormStore";
import { Group } from "@/core/types/entities/dma/e-form/group";
import { useEFormStore } from "../e-form-offline/useEFormStore";
import { sendErrorEvent } from "@/core/helpers/analytics";

type DefectBody = {
  workorder: string
}

export const useOfflineDailyScheduleStore = defineStore({
  id: "OfflineDailySchedule",
  state: () => {
    return {
      stateDailySchedules: [] as DailySchedule[],
      stateDailySchedulesInterim: [] as DailySchedule[],
      stateDailyScheduleOptions: [] as Option[],
      stateDailyScheduleInterimOptions: [] as Option[],
      stateSelectedDailySchedule: {} as DailySchedule,
      stateSelectedDailyScheduleInterim: {} as DailySchedule
    }
  },
  getters: {
    DailySchedules: (state) => {
      return state.stateDailySchedules;
    },
    DailyScheduleOptions: (state) => {
      return state.stateDailyScheduleOptions;
    },
    DailyScheduleInterimOptions: (state) => {
      return state.stateDailyScheduleInterimOptions;
    },
    SelectedDailySchedule: (state) => {
      return state.stateSelectedDailySchedule;
    },
    SelectedDailyScheduleInterim: (state) => {
      return state.stateSelectedDailyScheduleInterim;
    },
    AuthStore: () => {
      return useAuthenticationStore()
    },
    onlineStatus: () => {
      return useOnline()
    },
    suspensionCylinderFormStore: () => {
      return useSuspensionCylinderFormStore()
    },
    offlineEformStore: () => {
      return useEFormStore()
    }
  },
  actions: {
    async getDailySchedules(site) {
      const params = {
        ver: "v1",
        siteId: site
      }
      try {
        const response: AxiosResponse<ApiResponse<DailySchedule>> = await ApiService.get(DAILY_SCHEDULE_API_URL, "", new URLSearchParams(params).toString());
        this.stateDailySchedules = response.data.result.content
        this.saveDailyScheduleListToLocalDB(response.data.result.content)
        await this.formatDailyScheduleOptions()
        const localWO = await db.serviceSheetDetail.toArray()
        if (localWO.length > 0) {
          for (const serviceSheetIndex in localWO) {
            if (Object.prototype.hasOwnProperty.call(localWO, serviceSheetIndex)) {
              const element = localWO[serviceSheetIndex];
              const woExist = this.stateDailySchedules.find((wo) => {
                return wo.workOrder == element.id
              })
              if (!woExist) {
                const localServiceSHeet = db.serviceSheetDetail.where({
                  id: element.id
                })
                if (localServiceSHeet) {
                  await localServiceSHeet.delete()
                }
                const localDefect = db.serviceSheetDefect.where({
                  workorder: element.id
                })
                if (localDefect) {
                  await localDefect.delete()
                }
                const task = db.pendingTask.where({
                  workorder: element.id
                })
                if (task) {
                  await task.delete()
                }
                const taskImage = db.pendingTaskFile.where({
                  workorder: element.id
                })
                if (taskImage) {
                  await taskImage.delete()
                }
                const taskRetry = db.retryTask.where({
                  workorder: element.id
                })
                if (taskRetry) {
                  await taskRetry.delete()
                }
                const previousTandem = db.serviceFormPreviousTandem.where({
                  id: element.id
                })
                if (previousTandem) {
                  await previousTandem.delete()
                }
                const calibration = db.serviceFormPayloadCalibration.where({
                  id: element.id
                })
                if (taskRetry) {
                  await calibration.delete()
                }
              }
            }
          }
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        await this.saveDailyScheduleListToLocalDB([
          {
            "id": "1930",
            "smuDue": "4000",
            "workOrder": "7779999981",
            "unitNumber": "DT0700",
            "psType": "4000",
            "shift": "Day",
            "equipmentModel": "KOM 930E-4 HPI",
            "equipmentModelName": "930E-4 HPI",
            "status": "Open"
          }
        ])
        await this.formatDailyScheduleOptions()
      }
    },
    async saveDailyScheduleListToLocalDB(response) {
      for (const dailySchedule of response) {
        // const existing = await db.serviceSheetHeader.where('id').equals(Number(dailySchedule.id)).first()
        // if (!existing) {
        await db.serviceSheetHeader.put({
          id: Number(dailySchedule.id),
          smuDue: dailySchedule.smuDue,
          workOrder: dailySchedule.workOrder,
          unitNumber: dailySchedule.unitNumber,
          psType: dailySchedule.psType,
          shift: dailySchedule.shift,
          equipmentModel: dailySchedule.equipmentModel,
          equipmentModelName: dailySchedule.equipmentModelName,
          status: dailySchedule.status!,
          progress: dailySchedule.progress!,
          syncStatus: 'Not Updated',
          date: new Date().toDateString(),
          label: dailySchedule.label,
          value: dailySchedule.value
        })
        // }
      }
      this.stateDailySchedules = (await db.serviceSheetHeader.reverse().sortBy("id"));
    },
    async getDailyScheduleFromLocalDB() {
      this.stateDailySchedules = await db.serviceSheetHeader.reverse().sortBy("id")
      await this.formatDailyScheduleOptions()
    },
    async getDailySchedulesInterim() {
      try {
        const response: AxiosResponse<ApiResponse<DailySchedule>> = await ApiService.get(DAILY_SCHEDULE_INTERIM_API_URL);
        this.stateDailySchedulesInterim = response.data.result.content;
        this.formatDailyScheduleInterimOptions()
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async formatDailyScheduleOptions() {
      const detailsOnLocal = await db.serviceSheetDetail.toArray()
      const options = [] as Option[]
      // this.stateDailySchedules.forEach((element) => {
      //   options.push({
      //     label: `${element.unitNumber} - ${element.equipmentModel} - ${element.psType} Hour Service - ${element.workOrder}`,
      //     value: element.id.toString(),
      //     status: element.status,
      //     progress: element.progress,
      //     icon: "Not Updated",
      //     workOrder: element.workOrder
      //   })
      // })
      for (const woIndex in detailsOnLocal) {
        if (Object.prototype.hasOwnProperty.call(detailsOnLocal, woIndex)) {
          const element = detailsOnLocal[woIndex];
          this.stateDailySchedules.some((option) => {
            if (option.workOrder == element.id) {
              option.icon = "Updated"
              return true
            }
          })
        }
      }
      this.stateDailyScheduleOptions = this.stateDailySchedules
    },
    formatDailyScheduleInterimOptions() {
      this.stateDailyScheduleInterimOptions = this.stateDailySchedulesInterim.map((e) => {
        return {
          label: `${e.unitNumber} - ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`,
          value: e.id.toString(),
          status: e.status,
          progress: e.progress
        }
      });
    },
    setSelectedDailySchedule(id: string) {
      const dailySchedule = this.DailySchedules.find((d) => {
        return d.id.toString() === id;
      });
      if (dailySchedule) {
        this.stateSelectedDailySchedule = dailySchedule;
      }
    },
    setSelectedDailyScheduleInterim(id: string) {
      const dailySchedule = this.stateDailySchedulesInterim.find((d) => {
        return d.id.toString() === id;
      });
      if (dailySchedule) {
        this.stateSelectedDailyScheduleInterim = dailySchedule;
      }
    },
    updateDailyScheduleSyncStatus(workOrder) {
      this.DailySchedules.forEach((item) => {
        if (item.workOrder == workOrder) {
          item.syncStatus = "Updated"
        }
      })
    },
    async handleServiceFormAccessibleOffline(param) {
      let detailJSON = await this.getWorkOrderDetailById(param)
      detailJSON.id = param.workOrder
      if (!isEmpty(detailJSON.general)) {
        // update task progress
        detailJSON = await this.updateTaskProgressFromDB(detailJSON)
        await db.serviceSheetDetail.put(detailJSON)
        const headerOnLocalDB = await db.serviceSheetHeader.get({
          workOrder: param.workOrder
        })
        // dump all images
        await this.dumpImagesEachServiceDetail(detailJSON.general, detailJSON.serviceSheet)
        // dump all attachments (pdf)
        await this.dumpAttachmentEachServiceDetail(detailJSON)
        // dump defect hader and defect detail
        await this.saveDefectServiceFormToLocalDB(param.workOrder)
        // get previous crack
        await this.savePreviousCrackToLocalDB(param.workOrder)
        // get payload calibration
        await this.getpayloadCalibration({
          employee: {
            id: this.AuthStore.user.EmployeeId,
            name: this.AuthStore.user.Name,
          },
          modelId: detailJSON.general.modelId,
          psTypeId: detailJSON.general.psTypeId,
          unitNumber: detailJSON.general.equipment,
          workOrder: detailJSON.general.workOrder,
        })
        // get previous tandem
        await this.offlineEformStore.handleGetAndUpdatePreviousTandem(detailJSON)
        await this.offlineEformStore.handleGetAndUpdatePreviousReplacement(detailJSON)
        await this.offlineEformStore.handleGetAndUpdatePreviousBrakePack(detailJSON)
        await this.offlineEformStore.getReplacementDefaultBulk({
          modelId: detailJSON.general.modelId,
          psTypeId: detailJSON.general.psTypeId
        }, detailJSON.general.workOrder)
        headerOnLocalDB!.syncStatus = "Updated"
        await db.serviceSheetHeader.put(headerOnLocalDB!)
        this.updateDailyScheduleSyncStatus(param.workOrder)
      }
      this.stateDailyScheduleOptions.forEach((element) => {
        if (element.workOrder == param.workOrder) {
          console.log("element.workOrder", element.workOrder);
          element.icon = "Updated"
          return
        }
      });
    },
    async savePreviousCrackToLocalDB(workOrder: string) {
      const params = {
        workOrder: workOrder,
        ver: "v1"
      }
      try {
        const response: AxiosResponse<SingleApiResponse<MultiplePreviousCrack[]>> = await ApiService.get(`${GET_PREVIOUS_CRACK_BY_WO}`, "", new URLSearchParams(params).toString());
        const previousCracks = cloneDeep(response.data.result.content)
        const previousCracksSameWO = await db.previousCrack.where({
          workOrder: workOrder
        })
        if (previousCracksSameWO) {
          previousCracksSameWO.delete()
        }
        previousCracks.forEach(async (element) => {
          await db.previousCrack.add({
            taskId: element.taskId,
            workOrder: workOrder,
            previousCrack: element.previousCrack
          })
        });
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log("error get previous each wo");
      }
    },
    async syncDetail() {
      const interval = 1000
      let promise = Promise.resolve()
      const data = clone(this.stateDailySchedules)
      data.forEach(async (w) => {
        promise = promise.then(async () => {
          let detailJSON = await this.getWorkOrderDetailById(w)
          detailJSON.id = w.workOrder
          if (!isEmpty(detailJSON.general)) {
            // update task progress
            detailJSON = await this.updateTaskProgressFromDB(detailJSON)
            await db.serviceSheetDetail.put(detailJSON)
            const headerOnLocalDB = await db.serviceSheetHeader.get({
              workOrder: w.workOrder
            })
            // dump all images
            await this.dumpImagesEachServiceDetail(detailJSON.general, detailJSON.serviceSheet)
            // dump defect hader and defect detail
            await this.saveDefectServiceFormToLocalDB(w.workOrder)
            headerOnLocalDB!.syncStatus = "Updated"
            await db.serviceSheetHeader.put(headerOnLocalDB!)
            await this.formatDailyScheduleOptions()
          }
          return new Promise(function (resolve) {
            setTimeout(resolve, interval);
          })
        })
      })
    },
    async saveDefectServiceFormToLocalDB(workOrder) {
      // get API defect header
      const params = {
        workOrder: workOrder,
        ver: "v1"
      }
      const response: AxiosResponse<SingleApiResponse<ListDefectSections>> = await ApiService.get(`${GET_DEFECTS_ALL_SECTION}`, "", new URLSearchParams(params).toString())
      /* set the state */
      const detailList = response.data.result.content?.defectDetail || []
      const headerList = response.data.result.content?.defectHeader || []
      const commentList = response.data.result.content?.comment || []
      commentList.forEach((item) => {
        item.workOrder = workOrder
      })
      clearDefectListFromLocalDB(workOrder)
      dumpDefectListToLocalDB(headerList, detailList)
      dumpServiceFormComments(commentList, workOrder)
    },
    async getDefectHeaderList(defectBody: DefectBody) {
      try {
        const response: AxiosResponse<ApiResponse<Header>> = await ApiService.post(`${GET_DEFECTS_HEADER}`, defectBody as AxiosRequestConfig)
        return response.data.result.content
      } catch (error) {
        sendErrorEvent('IRONS', error);
        return []
      }
    },
    async getDefectDetailList(defectBody: DefectBody) {
      try {
        const response: AxiosResponse<ApiResponse<Detail>> = await ApiService.post(`${GET_DEFECTS_DETAIL}`, defectBody as AxiosRequestConfig)
        return response.data.result.content
      } catch (error) {
        sendErrorEvent('IRONS', error);
        return []
      }
    },
    async getWorkOrderDetailById(dailySchedule: DailySchedule) {
      const body = {
        employee: {
          id: this.AuthStore.user.EmployeeId,
          name: this.AuthStore.user.Name,
        },
        modelId: dailySchedule.equipmentModel,
        psTypeId: dailySchedule.psType,
        workOrder: dailySchedule.workOrder,
        unitNumber: dailySchedule.unitNumber
      };
      const params = {
        ver: "v1",
      };
      const emptyTemplate = {
        id: dailySchedule.workOrder,
        general: {} as General,
        serviceSheet: []
      }
      if (this.onlineStatus.value) {
        try {
          const response: AxiosResponse<SingleApiResponse<GenerateServiceSheet>> =
            await ApiService.post(
              `${GENERATE_SERVICE_SHEET_API_URL}?${new URLSearchParams(
                params,
              ).toString()}`,
              body as AxiosRequestConfig,
            );
          return response.data.result.content
        } catch (error) {
          sendErrorEvent('IRONS', error);
          console.log("error get data service sheet detail offline mode");
          return emptyTemplate
        }
      } else {
        return emptyTemplate
      }
    },
    async getServiceSheetDetailFromLocalDB(wo) {
      return await db.serviceSheetDetail.where('id').equals(wo).first()
    },
    async dumpAttachmentEachServiceDetail(detailJSON: GenerateServiceSheet) {
      const pdfUrlArr: string[] = []

      // generic function
      const pushDataToPdfUrlArr = (tempHtml, className) => {
        const showPDFArr = Array.from(tempHtml.getElementsByClassName(className)) as any[]
        showPDFArr.forEach((element) => {
          if (!pdfUrlArr.includes(element.href as string)) {
            pdfUrlArr.push(element.href as string)
          }
        })
      }

      const formatStringAsHtml = (value) => {
        // get the href
        const tempHtml = document.createElement('div');
        let replacedValue = value
        if (value) {
          replacedValue = replacedValue.replaceAll('{BLOB_URL}', import.meta.env.VITE_APP_BASE_URL_VERSIONING_DIGITAL)
        }
        tempHtml.innerHTML = replacedValue as string

        pushDataToPdfUrlArr(tempHtml, 'show-pdf')
        pushDataToPdfUrlArr(tempHtml, 'spv-print-pdf')
      }

      // get dari general
      detailJSON.general.safetyPrecaution.forEach((safetyItem) => {
        safetyItem.items.forEach((item) => {
          if (item.taskType == "html") {
            formatStringAsHtml(item.value)
          }
        })
      })

      // get dari service sheet detail
      const checkHtmlItem = async (item) => {
        if (item.itemType == "html") {
          formatStringAsHtml(item.value)
        }
      }
      for (const groupIndex in detailJSON.serviceSheet) {
        const group = detailJSON.serviceSheet[groupIndex]
        for (const subGroupIndex in group.subGroup) {
          const subGroup = group.subGroup[subGroupIndex]
          for (const taskGroupIndex in subGroup.taskGroup) {
            const taskGroup = subGroup.taskGroup[taskGroupIndex]
            for (const taskIndex in taskGroup.task) {
              const task = taskGroup.task[taskIndex]
              if (task.taskType === 'table' || task.taskType === 'collapsibleTable') {
                for (const itemIndex in task.items) {
                  const item = task.items[itemIndex]
                  for (const property in item) {
                    const currItem = item[property]
                    await checkHtmlItem(currItem)
                  }
                }
              }
              for (const inlineItemIndex in task.items) {
                const inlineItem = task.items[inlineItemIndex]
                await checkHtmlItem(inlineItem)
              }
            }
          }
        }
      }
      // hit api
      const distinctedPdfUrlArr: string[] = []
      for (const pdfUrlIndex in pdfUrlArr) {
        const pdfUrl = pdfUrlArr[pdfUrlIndex]
        const pdfOnLocaDB = await db.taskReference.where({
          filename: pdfUrl
        }).first()
        if (!pdfOnLocaDB) {
          distinctedPdfUrlArr.push(pdfUrl)
        } else {
          if (!pdfOnLocaDB.createdDate) {
            db.taskReference.where({
              filename: pdfUrl
            }).delete()
            distinctedPdfUrlArr.push(pdfUrl)
          } else {
            const currentDate = new Date()
            const createdDate = pdfOnLocaDB.createdDate
            const timeDiff = currentDate.getTime() - createdDate.getTime()
            const dayDiff = timeDiff / (1000 * 60 * 60 * 24)
            if (dayDiff > 1) {
              db.taskReference.where({
                filename: pdfUrl
              }).delete()
              distinctedPdfUrlArr.push(pdfUrl)
            }
          }
        }
      }
      const formattedPdfUrlArr = distinctedPdfUrlArr.map((url) => {
        return `'${url}'`
      })
      // simpen di db
      if (distinctedPdfUrlArr.length == 0) return
      // get Image List
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${GET_ATTACHEMNT_LIST_SERVICE_FORM}`, formattedPdfUrlArr as AxiosRequestConfig);
      const respPdfList = response.data.result.content
      respPdfList.forEach(async (file) => {
        const byteCharacters = atob(file.dataFile)
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: file.file_type })
        // dump
        await db.taskReference.add({
          workorder: detailJSON.general.workOrder,
          filename: `${file.file_url}`,
          file: blob,
          fileType: "pdf",
          createdDate: new Date()
        })
      });
    },
    async dumpImagesEachServiceDetail(general = {} as General, detail: Group[]) {
      const detailJSON = {
        general,
        serviceSheet: detail
      }
      const imgIDArr: string[] = []
      const truckItems = detailJSON.general.checkBeforeTruck?.items || {}
      if (truckItems) {
        for (const truckIndex in truckItems) {
          if (Object.prototype.hasOwnProperty.call(truckItems, truckIndex)) {
            const element = truckItems[truckIndex];
            if (element.itemType == "html") {
              imgIDArr.push(element.icon.value)
            }
          }
        }
      }
      const checkImageItem = async (item) => {
        if (item.itemType == "image") {
          if (this.onlineStatus.value) {
            const existing = await db.taskReference.where({
              filename: item.value as string
            }).first()
            if (!existing) {
              if (!imgIDArr.includes(item.value as string)) {
                imgIDArr.push(item.value as string)
              }
            } else {
              if (!existing.createdDate) {
                db.taskReference.where({
                  filename: item.value
                }).delete()
                if (!imgIDArr.includes(item.value as string)) {
                  imgIDArr.push(item.value as string)
                }
              } else {
                const currentDate = new Date()
                const createdDate = existing.createdDate
                const timeDiff = currentDate.getTime() - createdDate.getTime()
                const dayDiff = timeDiff / (1000 * 60 * 60 * 24)
                if (dayDiff > 1) {
                  db.taskReference.where({
                    filename: item.value
                  }).delete()
                  if (!imgIDArr.includes(item.value as string)) {
                    imgIDArr.push(item.value as string)
                  }
                }
              }
            }
          }
        }
      }
      for (const groupIndex in detailJSON.serviceSheet) {
        const group = detailJSON.serviceSheet[groupIndex]
        for (const subGroupIndex in group.subGroup) {
          const subGroup = group.subGroup[subGroupIndex]
          for (const taskGroupIndex in subGroup.taskGroup) {
            const taskGroup = subGroup.taskGroup[taskGroupIndex]
            for (const taskIndex in taskGroup.task) {
              const task = taskGroup.task[taskIndex]
              if (task.taskType === 'table' || task.taskType === 'collapsibleTable') {
                for (const itemIndex in task.items) {
                  const item = task.items[itemIndex]
                  for (const property in item) {
                    const currItem = item[property]
                    await checkImageItem(currItem)
                  }
                }
              }
              for (const inlineItemIndex in task.items) {
                const inlineItem = task.items[inlineItemIndex]
                await checkImageItem(inlineItem)
              }
            }
          }
        }
      }

      if (imgIDArr.length == 0) return
      for (const imgIdIndex in imgIDArr) {
        const imgId = imgIDArr[imgIdIndex]
        const params = {
          ver: "v1",
          id: imgId
        }
        const response: AxiosResponse<SingleApiResponse<URL>> = await ApiService.get(`${GET_SAS_URL_IMAGE_BY_ID}`, "", new URLSearchParams(params).toString());
        const imageUrl = response.data.result.content
        const file = await fetch(imageUrl.toString(), {
          headers: new Headers({ })
        }).then((r) => {
          return r.blob()
        }).then((blobData) => {
          return blobData
        })
        await db.taskReference.add({
          workorder: detailJSON.general.workOrder,
          filename: imgId,
          file: file,
          fileType: "image",
          createdDate: new Date()
        })
      }
    },
    async getpayloadCalibration(payload: GetSCTemplatePayload) {
      await this.suspensionCylinderFormStore.getSuspensionCalibrationTemplate(payload)
      if (this.suspensionCylinderFormStore.stateSCHeader) {
        await db.serviceFormPayloadCalibration.put({
          id: cloneDeep(payload.workOrder.toString()),
          header: cloneDeep(this.suspensionCylinderFormStore.stateSCHeader),
          detail: cloneDeep(this.suspensionCylinderFormStore.stateSCCalibration)
        })
        await this.dumpImagesEachServiceDetail(this.suspensionCylinderFormStore.stateSCHeader, [
          this.suspensionCylinderFormStore.stateSCCalibration
        ])
      }
    },
    async updateTaskProgressFromDB(detailJSON: GenerateServiceSheet) {
      if (this.onlineStatus.value) {
        const params = {
          ver: "v1",
        };
        try {
          const body = {
            modelId: detailJSON.general.modelId,
            psTypeId: detailJSON.general.psTypeId,
            workOrder: detailJSON.general.workOrder,
            headerId: detailJSON.serviceSheet[0].headerId
          };
          const response: AxiosResponse<SingleApiResponse<TaskProgress[]>> =
            await ApiService.post(
              `${GET_TASK_PROGRESS_API_URL}?${new URLSearchParams(
                params,
              ).toString()}`,
              body as AxiosRequestConfig,
            );
          response.data.result.content.forEach((item) => {
            const currGroup = detailJSON.serviceSheet.find((groupItem) => {
              return item.group === groupItem.key;
            });
            if (currGroup) {
              if (currGroup.groupName == "DEFECT_IDENTIFIED_SERVICE" && item.identifiedDefectCount) {
                currGroup.doneTask = item.identifiedDefectCount;
                currGroup.totalTask = item.identifiedDefectCount
              } else {
                currGroup.doneTask = item.doneTask;
                currGroup.totalTask = item.totalTask;
              }
            }
          });
          return detailJSON
        } catch (error) {
          sendErrorEvent('IRONS', error);
          console.log(error);
          return detailJSON
        }
      }
      return detailJSON
    },
    async getHmOffset(site) {
      const params = {
        ver: "v1",
        equipmentNo: "",
        siteId: site,
        asIsDate: formatInternationalDate()
      };
      // get API
      try {
        await db.hmOffset.clear()
        const res: AxiosResponse<SingleApiResponse<ResponseHmOffset>> = await ApiService.get(
          `${GET_HM_OFFSET}`, "", new URLSearchParams(
            params,
          ).toString()
        );
        for (const hmOffsetIndex in res.data.result.content.hmOffsetList) {
          const hmOffset = res.data.result.content.hmOffsetList[hmOffsetIndex]
          await db.hmOffset.add(hmOffset)
        }
      } catch (e) {
        sendErrorEvent('IRONS', e);
        console.log("error get hm offset offline", e);
      }
    }
  }
});
