/* eslint-disable indent */
import { defineStore } from "pinia";
import {
    Employee,
    Payload,
    PropertyParams,
    UpdateParams
} from "@/core/types/entities/dma/Payload";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import ApiService from "@/core/services/ApiService";
import {
  GENERAL_SERVICE_SHEET_API_URL,
  GET_HEADER_FIELD_VALUE,
  GET_SERVER_TIME
} from "./urls";
import {
  FitterLog,
} from "@/core/types/entities/dma/e-form/general/General"
import { ElLoading } from "element-plus";
import {
  useComponentInterventionEformStore
} from "./useComponentInterventionEformStore";
import {
  ComponentInterventionGroup
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGroup";
import {
  ComponentInterventionGeneral
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGeneral";
import { SMUTolerance } from "@/core/types/entities/dma/e-form/SmuTolerance";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/smu-tolerance-setting/ListItem"
import {
  CRUD_API_URL
} from "../../iron-lake/parameter/smu-tolerance-setting/urls";
import { isUndefined, cloneDeep } from "lodash";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import {
  CRUD_API_URL as LIST_CRUD_API_URL
} from '@/store/pinia/administration/organization-unit/shift/urls'
import { Option } from "@/core/types/misc/Option";
import { Shift } from "@/core/types/entities/dma/component-intervention/Shift";
import {
AESTCurrentDateTime
} from "@/core/helpers/date-format";
import { db } from '@/database/schema/DexieSchema';
import {
  HistoryPersoneel
} from "@/core/types/entities/dma/component-intervention/HistoryPersoneel";
import {
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useGeneralComponentInterventionFormStore = defineStore({
  id: "GeneralComponentInterventionFormStore",
  state: () => {
    return {
      statePayload: {} as Payload,
      stateUpdateParams: {} as UpdateParams,
      statePropertyParams: {} as PropertyParams,
      stateGeneralUpdated: false,
      stateGeneralForm: {} as ComponentInterventionGeneral,
      initPreriskImages: [],
      stateSMUTolerance: {} as SMUTolerance,
      stateSMUToleranceNotMapped: false,
      stateIsSmuCameraDisabled: false,
      stateIsRiskAssesmentPhotoTaken: false,
      stateSelectedFitterShift: {} as Shift,
      stateTimeStamp: '',
      stateShiftList: [] as Shift[],
      stateTimeZone: '+10.00',
      stateTimeZoneDesc: 'AEST',
      stateIsSelectedFitterAlreadyLoggedIn: false,
      stateFitterInfo: { } as FitterLog,
      stateIsFitterLoggedInExist: false,
      statePersoneelHistory: [] as HistoryPersoneel[]
    }
  },
  getters: {
    payload: (state) => {
        return state.statePayload
    },
    generalUpdated: (state) => {
        return state.stateGeneralUpdated;
    },
    generalForm: (state) => {
      return state.stateGeneralForm
    },
    smuTolerance: (state) => {
      return state.stateSMUTolerance
    },
    SMUToleranceNotMapped: (state) => {
      return state.stateSMUToleranceNotMapped
    },
    IsRiskAssesmentPhotoTaken: (state) => {
      return state.stateIsRiskAssesmentPhotoTaken
    },
    IsSelectedFitterAlreadyLoggedIn: (state) => {
      return state.stateIsSelectedFitterAlreadyLoggedIn
    },
    FitterInfo: (state) => {
      return state.stateFitterInfo
    },
    IsFitterLoggedInExist: (state) => {
      return state.stateIsFitterLoggedInExist
    },
    PersoneelHistory: (state) => {
      return state.statePersoneelHistory
    }
  },
  actions: {
    setPersoneelHistory(fitterInfo: Employee) {
      const employeeHistory = { ...fitterInfo } as HistoryPersoneel
      if (this.statePersoneelHistory.length == 0) {
        employeeHistory.isChecked = false
        this.statePersoneelHistory.push(employeeHistory)
      } else {
        const index = this.statePersoneelHistory.findIndex((val) => {
          return val.id == fitterInfo.id
        })
        if (index < 0) {
          employeeHistory.isChecked = false
          this.statePersoneelHistory.push(employeeHistory)
        }
      }
    },
    setPersoneelHistoryChecked(fitterInfo: Employee, isChecked) {
      if (this.statePersoneelHistory.length > 0) {
        const index = this.statePersoneelHistory.findIndex((val) => {
          return val.id == fitterInfo.id
        })
        if (index >= 0) {
          this.statePersoneelHistory[index].isChecked = isChecked
        }
      }
    },
    setIsFitterLoggedInExist(status) {
      this.stateIsFitterLoggedInExist = status
    },
    setFitterInfo(fitterInfo: FitterLog) {
      this.stateFitterInfo = cloneDeep(fitterInfo)
    },
    setFitterInfoFitter(fitter: Option, timestamp: string, shift: string) {
      this.stateFitterInfo.employee = {
        id: fitter.value,
        name: fitter.label
      }
      this.stateFitterInfo.timeLoggedIn = timestamp
      this.stateFitterInfo.shift = shift
    },
    setFitterInfoIsIHaveReadChecked(status: boolean) {
      this.stateFitterInfo.isIHaveReadChecked = status
    },
    setFitterInfoRiskPhotos(newPhotos: ImageInfo[]) {
      if (isUndefined(this.stateFitterInfo.riskPhotos)) this.stateFitterInfo.riskPhotos = []
      this.stateFitterInfo.riskPhotos = [
        ...stringToImageInfoConvert(this.stateFitterInfo.riskPhotos),
        ...newPhotos
      ]
      if (this.stateIsFitterLoggedInExist) this.setGeneralFitterInfoToIndexedDB()
    },
    deleteFitterInfoRiskPhotos(deletedPhoto: string) {
      this.stateFitterInfo.riskPhotos = stringToImageInfoConvert(this.stateFitterInfo.riskPhotos)
      this.stateFitterInfo.riskPhotos = this.stateFitterInfo.riskPhotos.filter((img) => {
        return deletedPhoto != img.filename
      })
      this.setGeneralFitterInfoToIndexedDB()
    },
    async setGeneralFitterInfoToIndexedDB() {
      const logClone = this.generalForm.log ? cloneDeep(this.generalForm.log) : []
      const foundIndex = logClone.findIndex((log) => {
        return log.employee.id == this.stateFitterInfo.employee.id
      })
      this.stateFitterInfo.isIHaveReadChecked = true
      if (foundIndex >= 0) {
        logClone[foundIndex] = this.stateFitterInfo
      } else {
        logClone.push(this.stateFitterInfo)
      }
      const authStore = useAuthenticationStore()
      const payload = {
        id: this.generalForm.id,
        updateParams: [
          {
            keyValue: this.generalForm.key,
            propertyParams: [
              {
                propertyName: 'log',
                propertyValue: JSON.stringify(logClone)
              },
            ]
          }
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      const params = {
        ver: 'v1'
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        // this.stateFitterInfo = {} as FitterLog
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log('update log', error);
      }
    },
    async deleteGeneralFitterInfoFromIndexedDB() {
      try {
        this.stateIsFitterLoggedInExist = false
        this.stateFitterInfo = {} as FitterLog
      } catch (error) {
        console.log('error at indexeddb', error);
      }
    },
    setServiceStart() {
      const date = AESTCurrentDateTime()
      const finalDateForm = `${date}`
      this.addPropertyParam('GENERAL', 'serviceStart', finalDateForm);
      this.stateGeneralForm.serviceStart = finalDateForm
    },
    setIsSelectedFitterAlreadyLoggedIn(status: boolean) {
      this.stateIsSelectedFitterAlreadyLoggedIn = status
    },
    setPayloadId(id: string, employeeId: string, name: string) {
        this.statePayload.id = id;
        this.statePayload.updateParams = [];
        this.statePayload.employee = {} as Employee;
        this.statePayload.employee.id = employeeId;
        this.statePayload.employee.name = name;
    },
    addPropertyParam(taskGroup: string, name: string, value: string | string[]) {
        /* check task group */
        const existingTaskGroup = this.statePayload.updateParams.find((u) => {
            return u.keyValue === taskGroup;
        });
        if (existingTaskGroup) {
            this.stateUpdateParams = existingTaskGroup;
        } else {
            const newUpdateParam = {
                keyValue: taskGroup,
                propertyParams: []
            };
            this.statePayload.updateParams.push(newUpdateParam);
            this.stateUpdateParams = newUpdateParam;
        }
        const existing = this.stateUpdateParams.propertyParams.find((p) => {
            return p.propertyName === name;
        });
        if (existing) {
            existing.propertyValue = value;
            return;
        }
        this.stateUpdateParams.propertyParams.push(
            {
                propertyName: name,
                propertyValue: value
            }
        )
    },
    addUpdatedByAndDate(id: string, name: string) {
        const updatedBy = {
            id: id,
            name: name
        };
        this.addPropertyParam("GENERAL", "updatedBy", JSON.stringify(updatedBy));
        this.addPropertyParam("GENERAL", "updatedDate", "<<ServerDateTime>>");
        this.addPropertyParam("GENERAL", "interventionExecution", "On Progress");
    },
    addStatusHistory(status) {
      const statusHistoryClone = this.generalForm.statusHistory ? cloneDeep(this.generalForm.statusHistory) : []
      statusHistoryClone.push({
        status: status,
        updatedBy: this.FitterInfo.employee,
        updatedDate: "<<ServerDateTime>>",
        tsUpdatedDate: "<<ServerTimeStamp>>"
      })
      this.addPropertyParam("GENERAL", "statusHistory", JSON.stringify(statusHistoryClone));
  },
    async updateGeneralForm() {
        const params = {
            ver: "v1"
        };
        this.statePayload.id = this.generalForm.id
        const eformStore = useComponentInterventionEformStore()
        const groups = eformStore.groups
        let isFormComplete = true
        groups.forEach((group: ComponentInterventionGroup) => {
          if (group.doneTask < group.totalTask) {
            isFormComplete = false
          }
        })
        const authStore = useAuthenticationStore()
        const supervisor = {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }

        if (eformStore.generalForm.riskAssesment[0].value.length > 0) this.addPropertyParam(this.generalForm.riskAssesment[0].key, 'value', JSON.stringify(eformStore.generalForm.riskAssesment[0].value))
        if (this.generalForm.imageEquipment && this.generalForm.imageEquipment.length > 0) this.addPropertyParam('GENERAL', 'imageEquipment', JSON.stringify(this.generalForm.imageEquipment))
        this.addPropertyParam("GENERAL", "supervisor", JSON.stringify(supervisor));
        this.addStatusHistory("On Progress")
        this.setGeneralFitterInfoToIndexedDB()
        // if form complete check status header
        if (isFormComplete) {
          const status = await this.getServiceSheetHeaderKeyValue('interventionExecution')
          if (status.toString().toLowerCase() == 'open' || status.toString().toLowerCase() == 'on progress') {
            try {
              this.statePayload.updateParams[0].keyValue = this.generalForm.key
              await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, this.statePayload as AxiosRequestConfig);
              this.stateGeneralUpdated = true;
              this.stateGeneralForm.interventionExecution = 'On Progress'
              return false
            } catch (error) {
              sendErrorEvent('IRONS', error);
              updateLoggedInStatusFromAPIResponse(error)
              console.log(error);
            }
          } else {
            return true
          }
        } else {
          try {
            this.statePayload.updateParams[0].keyValue = this.generalForm.key
            await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, this.statePayload as AxiosRequestConfig);
            this.stateGeneralUpdated = true;
            this.stateGeneralForm.interventionExecution = 'On Progress'
            this.setGeneralFitterInfoToIndexedDB()
            return false
          } catch (error) {
            updateLoggedInStatusFromAPIResponse(error)
            sendErrorEvent('IRONS', error);
            console.log(error);
          }
        }
    },
    resetGeneral() {
      this.stateGeneralUpdated = false;
      this.statePersoneelHistory = [];
    },
    checkHmOffset(intervention: ComponentInterventionGeneral) {
      switch (intervention.hmOffset) {
        case undefined:
          this.stateGeneralForm.hmOffset = 'Not Applicable';
          break;
        case '':
          this.stateGeneralForm.hmOffset = '0';
          break;
        default:
          break;
      }
    },
    setGeneralForm(payload: ComponentInterventionGeneral) {
      this.stateIsRiskAssesmentPhotoTaken = false
      this.stateIsSmuCameraDisabled = false
      console.log(payload)
      this.stateGeneralForm = payload
      this.checkHmOffset(payload)
      if (!isUndefined(payload)) {
        if (!isUndefined(payload.riskAssesment)) {
          if (!isUndefined(payload.riskAssesment[0].value)) {
            this.initPreriskImages = cloneDeep(payload.riskAssesment[0].value as [])
          }
        }
      }
      try {
        if (this.generalForm.imageEquipment) this.stateIsSmuCameraDisabled = true
      } catch (error) {
        console.log(error);
      }
    },
    async getServiceSheetHeaderKeyVal(key) {
      const body = {
        id: this.generalForm.id,
        keyValue: this.generalForm.key,
        propertyName: key,
      }
      const params = {
        ver: "v1",
      }
      const loading = ElLoading.service({
        lock: true,
        text: 'Check SMU Value',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      try {
        const response: AxiosResponse<SingleApiResponse<string>> = await ApiService.post(`${GET_HEADER_FIELD_VALUE}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        loading.close()
        if (response.data.result.content != "") {
          return response.data.result.content
        } else {
          return ''
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        sendErrorEvent('IRONS', error);
        loading.close()
        return ''
      }
    },
    async getServiceSheetHeaderKeyValue(key) {
      const body = {
        id: this.generalForm.id,
        keyValue: this.generalForm.key,
        propertyName: key,
      }
      const params = {
        ver: "v1",
      }
      try {
        const response: AxiosResponse<SingleApiResponse<string | []>> = await ApiService.post(`${GET_HEADER_FIELD_VALUE}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
        return response.data.result.content
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        return 'error'
      }
    },
    async UpdateServiceEndMechanic(payload) {
      const params = {
          ver: "v1"
      };
      const updatedArr = this.statePayload.updateParams[0].propertyParams.filter((prop) => {
        return prop.propertyName == 'updatedBy' || prop.propertyName == 'updatedDate'
      })
      const body = {
        id: this.payload.id,
        updateParams: [
          {
            keyValue: this.generalForm.key,
            propertyParams: [
              payload,
              ...updatedArr
            ]
          }
        ],
        employee: this.payload.employee,
      }
      try {
          await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig);
          this.stateGeneralUpdated = true;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getSMUTolerance() {
      this.stateSMUToleranceNotMapped = false
      const params = {
        Parameter: '',
        ParameterTo: '',
        ValueMin: '',
        ValueMinTo: '',
        ValueMax: '',
        ValueMaxTo: '',
        Uom: '',
        UomTo: '',
        StartDate: '',
        StartDateTo: '',
        EndDate: '',
        EndDateTo: '',
        Page: '1',
        PageSize: '1',
        Order: '',
        ver: 'v1'
      };
      const setDefaultSMU = () => {
        this.stateSMUTolerance = {
          min: 0,
          max: 0
        }
        this.stateSMUToleranceNotMapped = true
        console.log('SMU tolerance not mapped on ADM');
      }
      try {
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(CRUD_API_URL, "", new URLSearchParams(params).toString())
        const smuData = response.data.result.content[0]
        if (!isUndefined(smuData)) {
          if (smuData.isActive) {
            this.stateSMUTolerance = {
              min: Number(smuData.valueMin),
              max: Number(smuData.valueMax)
            }
          } else {
            setDefaultSMU()
          }
        } else {
          setDefaultSMU()
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        setDefaultSMU()
      }
    },
    async getServerTimestamp(isOnline: boolean) {
      const params = {
        ver: 'v1'
      };
      try {
        if (isOnline) {
          const res: AxiosResponse<SingleApiResponse<string>> = await ApiService.get(GET_SERVER_TIME, '', new URLSearchParams(params).toString())
          this.stateTimeStamp = res.data.result.content
        } else {
          this.stateTimeStamp = AESTCurrentDateTime()
        }
      } catch (error) {
        sendErrorEvent('IRONS', error);
        updateLoggedInStatusFromAPIResponse(error)
      }
    },
    getShift(shift: string) {
      const found = this.stateShiftList.find((s) => {
        return s.shift == shift
      })
      return found ?? {} as Shift
    },
    updateSMUImages(newImages) {
      let arr = [] as string[] | string
      if (this.generalForm.imageEquipment) {
        arr = this.generalForm.imageEquipment
      }
      arr = [
        ...arr,
        ...newImages
      ]
      this.stateGeneralForm.imageEquipment = arr
    },
    deleteSMUPic(deletedImage) {
      let arr = this.generalForm.imageEquipment as string[]
      arr = arr.filter((image) => {
        return image != deletedImage
      })
      this.generalForm.imageEquipment = arr
    },
    toggleChangeIsRiskAssesmentPhotoTaken(status) {
      this.stateIsRiskAssesmentPhotoTaken = status
    },
    updateSMUONGeneral(smu) {
      this.generalForm.interventionSMU = smu
    },
    async getShiftListData() {
      const params = {
        Shift: "",
        StartHour: "",
        StartHourType: "",
        EndHour: "",
        EndHourType: "",
        StartDate: "",
        EndDate: "",
        ver: "v1",
        Page: '1',
        PageSize: '999',
        Order: ""
      }
      try {
        this.stateTimeZone = import.meta.env.VITE_APP_TIME_ZONE as string
        this.stateTimeZoneDesc = import.meta.env.VITE_APP_TIME_ZONE_GMT as string
        const response: AxiosResponse<ApiResponse<Shift>> = await ApiService.get(LIST_CRUD_API_URL, "", new URLSearchParams(params).toString())
        const data = response.data.result.content
        await db.shift.clear()
        await db.shift.bulkAdd(data)
        this.stateShiftList = data
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async setShiftListLocal() {
      this.stateShiftList = await db.shift.toArray()
    }
  }
});
