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
  GET_MASTER_SETTING_BY_PARAM,
  GET_SERVER_TIME,
  UPDATE_TASK_FITTER_VALIDATION_URL,
  GET_HM_OFFSET
} from "./urls";
import {
  FitterLog,
  General
} from "@/core/types/entities/dma/e-form/general/General";
import { ElLoading } from "element-plus";
import { useInterimEngineStore } from "./useInterimEngineStore";
import { Group } from "@/core/types/entities/dma/e-form/group";
import { SMUTolerance } from "@/core/types/entities/dma/e-form/SmuTolerance";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/smu-tolerance-setting/ListItem"
import {
  CRUD_API_URL
} from "../../iron-lake/parameter/smu-tolerance-setting/urls";
import {
isUndefined,
cloneDeep,
isNull,
} from "lodash";
import {
  ListItem as ShiftItem
} from "@/core/types/entities/administration/organization-unit/shift/ListItem";
import {
  CRUD_API_URL as SHIFT_LIST_URL
} from "../../administration/organization-unit/shift/urls";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import {
  ListItem as ShiftList
} from "@/core/types/entities/administration/organization-unit/shift/ListItem"
import {
  CRUD_API_URL as LIST_CRUD_API_URL
} from '@/store/pinia/administration/organization-unit/shift/urls'
import {
  updateServiceSheetHeaderResponse
} from "@/core/types/entities/dma/e-form/update-data/update-service-sheet-header-response";
import { Option } from "@/core/types/misc/Option";
import { v4 as uuidv4 } from 'uuid';
import {
  ServicePersonnel
  } from "@/core/types/entities/dma/e-form/general/ServicePersonnel";
import {
  ResponseHmOffset
} from "@/core/types/entities/dma/e-form/general/HmOffset";
import { formatInternationalDate } from "@/core/helpers/date-format";
import {
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  isCameraDisabled,
  isCameraDisabledParam
} from "@/core/helpers/ironforms/disabled-state";
import {
GeneralData,
passingParameterUpdateSMU
} from "@/core/types/entities/dma/defects/DefectSMU";
import { Audit } from "@/core/types/intervention/Audit";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useInterimGeneralFormStore = defineStore({
  id: "InterimGeneralForm",
  state: () => {
    return {
      statePayload: {} as Payload,
      stateUpdateParams: {} as UpdateParams,
      statePropertyParams: {} as PropertyParams,
      stateImageInfos: [] as Array<string>,
      stateImageBlobs: [] as Array<Blob>,
      statePreRiskImageInfos: [] as Array<string>,
      statePreRiskImageBlobs: [] as Array<Blob>,
      stateGeneralUpdated: false,
      stateGeneralForm: {} as General,
      initPreriskImages: [],
      stateSMUActual: 0,
      stateSMUTolerance: {} as SMUTolerance,
      stateSMUToleranceNotMapped: false,
      stateIsSmuCameraDisabled: false,
      stateIsSwingHourCameraDisabled: false,
      stateIsTravelHourCameraDisabled: false,
      stateIsRiskAssesmentPhotoTaken: false,
      stateSelectedFitterShift: {} as ShiftItem,
      stateTimeStamp: '',
      stateShiftList: [] as ShiftList[],
      stateTimeZone: '+10.00',
      stateTimeZoneDesc: 'AEST',
      stateIsSelectedFitterAlreadyLoggedIn: false,
      stateFitterInfo: { } as FitterLog,
      stateIsFitterLoggedInExist: false,
      stateIsTruckAlreadyCheckedByOtherFitter: false,
      stateCurrentPersoneel: {} as ServicePersonnel,
      stateHmOffset: 0 as number | string
    }
  },
  getters: {
    payload: (state) => {
        return state.statePayload
    },
    selectedFitter: () => {
      const eFormStore = useInterimEngineStore()
      return eFormStore.employee
    },
    generalUpdated: (state) => {
        return state.stateGeneralUpdated;
    },
    smuActual: (state) => {
      return state.stateSMUActual
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
    CurrentPersoneel: (state) => {
      return state.stateCurrentPersoneel
    },
    HmOffset: (state) => {
      return state.stateHmOffset
    }
  },
  actions: {
    setCurrentPersoneel(personeel) {
      this.stateCurrentPersoneel = personeel
    },
    setIsFitterLoggedInExist(status) {
      this.stateIsFitterLoggedInExist = status
    },
    setFitterInfo(fitterInfo: FitterLog) {
      this.stateFitterInfo = cloneDeep(fitterInfo)
    },
    setFitterInfoFitter(fitter: Option, timestamp: string, shift: string) {
      this.stateFitterInfo.id = uuidv4(),
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
    setFitterInfoRiskPhotos(newPhotos: ImageInfo) {
      if (isUndefined(this.stateFitterInfo.riskPhotos)) this.stateFitterInfo.riskPhotos = []
      this.stateFitterInfo.riskPhotos = [
        ...stringToImageInfoConvert(this.stateFitterInfo.riskPhotos),
        ...[newPhotos]
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
    async setGeneralFitterInfoToIndexedDB(editExisting = false) {
      const logClone = cloneDeep(this.generalForm.log)
      const findIndex = logClone.findIndex((log) => {
        return log.employee.id == this.stateFitterInfo.employee.id
      })
      if (editExisting && findIndex >= 0) {
        logClone[findIndex] = this.stateFitterInfo
      } else {
        logClone.push(this.stateFitterInfo)
      }

      const authStore = useAuthenticationStore()
      const payload = {
        id: this.generalForm.id,
        updateParams: [
          {
            keyValue: 'GENERAL',
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
        },
        localStatus: this.generalForm.status
      }
      const params = {
        ver: 'v1'
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        // this.stateFitterInfo = {} as FitterLog
        this.stateGeneralForm.log = logClone
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log('update log', error);
      }
    },
    async deleteGeneralFitterInfoFromIndexedDB() {
      try {
        this.stateIsFitterLoggedInExist = false
        this.stateFitterInfo = { } as FitterLog
      } catch (error) {
        console.log('error at indexeddb', error);
      }
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
        this.addPropertyParam("GENERAL", "status", "On Progress");
        if (this.generalForm.serviceStart == '' && this.generalForm.tsServiceStart == '') {
          this.addPropertyParam("GENERAL", "serviceStart", "<<ServerDateTime>>");
          this.addPropertyParam("GENERAL", "tsServiceStart", "<<ServerTimeStamp>>");
        }
    },
    async updateGeneralForm() {
        const params = {
            ver: "v1"
        };
        this.statePayload.id = this.generalForm.id
        this.statePayload.localStatus = this.generalForm.status
        const eformStore = useInterimEngineStore()
        const groups = eformStore.groups
        let isFormComplete = true
        groups.forEach((group: Group) => {
          if (group.doneTask < group.totalTask) {
            isFormComplete = false
          }
        })
        if (eformStore.generalForm.riskAssesment[0].value.length > 0) this.addPropertyParam(this.generalForm.riskAssesment[0].key, 'value', JSON.stringify(eformStore.generalForm.riskAssesment[0].value))
        if (this.generalForm.imageEquipment.length > 0) this.addPropertyParam('GENERAL', 'imageEquipment', JSON.stringify(this.generalForm.imageEquipment))
        // if form complete check status header
        if (isFormComplete) {
          const status = await this.getServiceSheetHeaderKeyValue('status')
          if (status.toString().toLowerCase() == 'open' || status.toString().toLowerCase() == 'on progress') {
            try {
              const response = await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, this.statePayload as AxiosRequestConfig);
              this.stateGeneralUpdated = true;
              this.stateGeneralForm.status = 'On Progress'
              response.data.result.content.updateParams.forEach((updateParam) => {
                if (updateParam.keyValue == "GENERAL") {
                  updateParam.propertyParams.forEach((propertyParam) => {
                    if (propertyParam.propertyName == "serviceStart") {
                      this.stateGeneralForm.serviceStart = propertyParam.propertyValue
                    }
                  });
                }
              })
              if (!this.stateIsFitterLoggedInExist) this.setGeneralFitterInfoToIndexedDB()
              return false
            } catch (error) {
              updateLoggedInStatusFromAPIResponse(error)
              sendErrorEvent('IRONS', error);
              console.log(error);
            }
          } else {
            return true
          }
        } else {
          try {
            const response = await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, this.statePayload as AxiosRequestConfig);
            this.stateGeneralUpdated = true;
            this.stateGeneralForm.status = 'On Progress'
            response.data.result.content.updateParams.forEach((updateParam) => {
              if (updateParam.keyValue == "GENERAL") {
                updateParam.propertyParams.forEach((propertyParam) => {
                  if (propertyParam.propertyName == "serviceStart") {
                    this.stateGeneralForm.serviceStart = propertyParam.propertyValue
                  }
                });
              }
            })
            if (!this.stateIsFitterLoggedInExist) this.setGeneralFitterInfoToIndexedDB()
            return false
          } catch (error) {
            updateLoggedInStatusFromAPIResponse(error)
            sendErrorEvent('IRONS', error);
            console.log(error);
          }
        }
    },
    pushNewImageInfos(info: string) {
        this.stateImageInfos.push(info);
    },
    pushNewImageBlob(blob: Blob) {
        this.stateImageBlobs.push(blob);
    },
    pushNewPreRiskImageInfos(info: string) {
        this.statePreRiskImageInfos.push(info);
    },
    pushNewPreRiskImageBlob(blob: Blob) {
        this.statePreRiskImageBlobs.push(blob);
    },
    resetGeneral() {
      this.stateGeneralUpdated = false;
    },
    setGeneralForm(payload: General) {
      this.stateIsRiskAssesmentPhotoTaken = false
      this.statePreRiskImageInfos = []
      this.stateIsSmuCameraDisabled = false
      this.stateIsSwingHourCameraDisabled = false
      this.stateIsTravelHourCameraDisabled = false
      this.stateGeneralForm = payload
      if (!isUndefined(payload)) {
        if (!isUndefined(payload.riskAssesment)) {
          if (!isUndefined(payload.riskAssesment[0].value)) {
            this.initPreriskImages = cloneDeep(payload.riskAssesment[0].value as [])
          }
        }
      }
      try {
        const smuParam:isCameraDisabledParam = [
          this.generalForm.status,
          this.generalForm.imageEquipment
        ]
        const swingParam:isCameraDisabledParam = [
          this.generalForm.status,
          this.generalForm.swingHourImages
        ]
        const travelParam:isCameraDisabledParam = [
          this.generalForm.status,
          this.generalForm.travelHourImages
        ]
        this.stateIsSmuCameraDisabled = isCameraDisabled(...smuParam)
        this.stateIsSwingHourCameraDisabled = isCameraDisabled(...swingParam)
        this.stateIsTravelHourCameraDisabled = isCameraDisabled(...travelParam)
      } catch (error) {
        console.log(error);
      }
    },
    async getServiceSheetHeaderKeyVal(key, name) {
      const body = {
        id: this.stateGeneralForm.id,
        keyValue: 'GENERAL',
        propertyName: key,
      }
      const params = {
        ver: "v1",
      }
      const loading = ElLoading.service({
        lock: true,
        text: `Check ${name} Value`,
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
        loading.close()
        sendErrorEvent('IRONS', error);
        return ''
      }
    },
    async getServiceSheetHeaderKeyValue(key) {
      const body = {
        id: this.stateGeneralForm.id,
        keyValue: 'GENERAL',
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
        return prop.propertyName == 'updatedDate'
      })
      const body = {
        id: this.payload.id,
        updateParams: [
          {
            keyValue: 'GENERAL',
            propertyParams: [
              payload,
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.CurrentPersoneel.mechanic)
              },
              ...updatedArr
            ]
          }
        ],
        employee: this.payload.employee,
        localStatus: this.generalForm.status
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
    setSMUActual(smu: number) {
      this.stateSMUActual = smu
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
        setDefaultSMU()
        sendErrorEvent('IRONS', error);
      }
    },
    async getServerTimestamp() {
      const params = {
        ver: 'v1'
      };
      try {
        const res: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(GET_SERVER_TIME, '', new URLSearchParams(params).toString())
        this.stateTimeStamp = res.data.result.content as string
        return res.data.result.content
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log('error get server time', error);
        return ''
      }
    },
    async getShift(shift) {
      const params = {
        Shift: shift,
        StartHour: '',
        StartHourType: '',
        EndHour: '',
        EndHourType: '',
        StartDate: '',
        EndDate: '',
        ver: "v1",
        Page: '1',
        PageSize: '1',
        Order: ""
      }
      try {
        const response: AxiosResponse<ApiResponse<ShiftItem>> = await ApiService.get(SHIFT_LIST_URL, "", new URLSearchParams(params).toString())
        console.log('data shift', response);
        if (response.data.result.content.length > 0) {
          this.stateSelectedFitterShift = response.data.result.content[0]
          console.log('🕐 selected fitter shift', this.stateSelectedFitterShift);
          return response.data.result.content[0]
        } else {
          return { } as ShiftItem
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        return { } as ShiftItem
      }
    },
    updateSMUImages(newImages: ImageInfo[]) {
      this.stateGeneralForm.imageEquipment = newImages
    },
    updateSwingImages(newImages: ImageInfo[]) {
      this.stateGeneralForm.swingHourImages = newImages
    },
    updateTravelImages(newImages: ImageInfo[]) {
      this.stateGeneralForm.travelHourImages = newImages
    },
    toggleChangeIsRiskAssesmentPhotoTaken(status) {
      this.stateIsRiskAssesmentPhotoTaken = status
    },
    async updateServiceSheetHeaderToTrue() {
      const authStore = useAuthenticationStore()
      const payload = {
        id: this.generalForm.id,
        updateParams: [
          {
            keyValue: 'GENERAL',
            propertyParams: [
              {
                propertyName: 'isDeleted',
                propertyValue: 'false'
              },
            ]
          }
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        localStatus: this.generalForm.status
      }
      const params = {
        ver: 'v1'
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log('upload risk Assesment', error);
      }
    },
    updateSMUONGeneral(params : {
      value: string,
      smuBy: Audit,
      smuDate: string
    }) {
      const { value, smuBy, smuDate } = params
      this.generalForm.smu = value
      this.generalForm.smuBy = smuBy
      this.generalForm.smuDate = smuDate
      const eformStore = useInterimEngineStore()
      eformStore.stateGeneralForm.smu = value
      eformStore.stateGeneralForm.smuBy = smuBy
      eformStore.stateGeneralForm.smuDate = smuDate
    },
    updateSwingHourONGeneral(smu) {
      this.generalForm.swingHour = smu
    },
    updateTravelHourONGeneral(smu) {
      this.generalForm.travelHour = smu
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
        const timeZonePayload = {
          key: 'TimeZone'
        }
        const timeZoneResponse: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${GET_MASTER_SETTING_BY_PARAM}?${new URLSearchParams(params).toString()}`, timeZonePayload as AxiosRequestConfig)
        this.stateTimeZone = `${timeZoneResponse.data.result.content.value}`
        const timeZoneDescPayload = {
          key: 'TimeZoneDesc'
        }
        const timeZoneDescResponse: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${GET_MASTER_SETTING_BY_PARAM}?${new URLSearchParams(params).toString()}`, timeZoneDescPayload as AxiosRequestConfig)
        this.stateTimeZoneDesc = `${timeZoneDescResponse.data.result.content.value}`
        console.log('timeZoneDescResponse', timeZoneDescResponse);
        const response: AxiosResponse<ApiResponse<ShiftList>> = await ApiService.get(LIST_CRUD_API_URL, "", new URLSearchParams(params).toString())
        this.stateShiftList = response.data.result.content
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async postCheckBeforeTruckItem(updateParam: UpdateParams, itemKey: string) {
      const eformStore = useInterimEngineStore()
      const updatedBy = eformStore.employee
      updateParam.propertyParams.push({
        propertyName: 'updatedBy',
        propertyValue: JSON.stringify(updatedBy)
      })
      const params = {
        ver: 'v1'
      }
      const body = {
        id: this.generalForm.id,
        updateParams: [
          updateParam
        ],
        employee: updatedBy
      }
      try {
        const checkedItem = this.generalForm.checkBeforeTruck.items.find((checkItem) => {
          return checkItem.key == itemKey
        })
        const response: AxiosResponse<SingleApiResponse<updateServiceSheetHeaderResponse>> = await ApiService.post(`${UPDATE_TASK_FITTER_VALIDATION_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
        if (response.data.result.message == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
          this.toggleIsTruckAlreadyCheckedByOtherFitter(true)
        }
        response.data.result.content.updateParams[0].propertyParams.forEach((propertyParam) => {
          if (propertyParam.propertyName == 'updatedDate') {
            checkedItem!.updatedDate = propertyParam.propertyValue as string
          }
          if (propertyParam.propertyName == 'updatedBy') {
            checkedItem!.updatedBy = JSON.parse(propertyParam.propertyValue as string)
          }
          // checkedItem!.updatedBy = updatedBy
        })
        this.updateAllCheckBoxValue(response.data.result.content.checkBeforeTruck!)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
      }
    },
    updateAllCheckBoxValue(checks: UpdateParams[]) {
      checks?.forEach((check) => {
        this.generalForm.checkBeforeTruck.items.forEach((item) => {
          if (check.keyValue == item.key) {
            check.propertyParams.forEach((propPar) => {
              if (propPar.propertyName == 'updatedDate') {
                if (propPar.propertyValue) {
                  item!.updatedDate = propPar.propertyValue as string
                }
              }
              if (propPar.propertyName == 'updatedBy') {
                if (propPar.propertyValue != "null") {
                  item!.updatedBy = JSON.parse(propPar.propertyValue as string)
                }
              }
              if (propPar.propertyName == 'value') {
                item!.value = propPar.propertyValue
              }
            })
          }
        })
      })
    },
    toggleIsTruckAlreadyCheckedByOtherFitter(status) {
      this.stateIsTruckAlreadyCheckedByOtherFitter = status
    },
    updateGeneralUpdated(status) {
      this.stateGeneralUpdated = status
    },
    async updateSwingTravelValueToBE(propertyName, propertyValue) {
      const authStore = useAuthenticationStore()
      const payload = {
        id: this.generalForm.id,
        updateParams: [
          {
            keyValue: 'GENERAL',
            propertyParams: [
              {
                propertyName: propertyName,
                propertyValue: propertyValue
              },
            ]
          }
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        localStatus: this.generalForm.status
      }
      const params = {
        ver: 'v1'
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log('update swing/travel hour value', error);
      }
    },
    async updateSMUValueToBE(paramData: passingParameterUpdateSMU) {
      const { smu, hmOffset, smuDate, smuBy } = paramData
      let generalData = {
        id: this.generalForm.id,
        localStatus: this.stateGeneralForm.status
      } as Partial<GeneralData>
      if (paramData.generalData) {
        generalData = paramData.generalData
      }
      const authStore = useAuthenticationStore()
      const payload = {
        id: generalData.id,
        updateParams: [
          {
            keyValue: 'GENERAL',
            propertyParams: [
              {
                propertyName: 'smu',
                propertyValue: smu
              },
              {
                propertyName: 'smuBy',
                propertyValue: smu !== '' ? JSON.stringify(smuBy) : ""
              },
              {
                propertyName: 'smuDate',
                propertyValue: smu !== '' ? smuDate : ""
              },
            ]
          }
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        localStatus: generalData.localStatus
      }
      if (hmOffset != "") {
        payload.updateParams[0].propertyParams.push({
          propertyName: 'hmOffset',
          propertyValue: hmOffset
        })
      }
      const params = {
        ver: 'v1'
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log('update smu/hmoffset value', error);
      }
    },
    async updateSMUImageToBE(data = {
      id: "",
      employee: {} as Audit,
      localStatus: "",
      imageEquipment: "",
    }): Promise<any> {
      const authStore = useAuthenticationStore()
      let newData = {
        id: this.generalForm.id,
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        localStatus: this.generalForm.status,
        imageEquipment: this.generalForm.imageEquipment,
      }
      if (data.id != "") {
        newData = data
      }
      const payload = {
        id: this.generalForm.id,
        updateParams: [
          {
            keyValue: 'GENERAL',
            propertyParams: [
              {
                propertyName: 'imageEquipment',
                propertyValue: JSON.stringify(newData.imageEquipment)
              },
            ]
          }
        ],
        employee: newData.employee,
        localStatus: newData.localStatus
      }
      const params = {
        ver: 'v1'
      }
      try {
        const result = await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        return result as AxiosResponse<SingleApiResponse<string>>
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log('update smu image value', error);
      }
    },
    async updateTravelSwingImageToBE(type: string, images: ImageInfo[]) {
      const authStore = useAuthenticationStore()
      const payload = {
        id: this.generalForm.id,
        updateParams: [
          {
            keyValue: 'GENERAL',
            propertyParams: [
              {
                propertyName: type,
                propertyValue: JSON.stringify(images)
              },
            ]
          }
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        localStatus: this.generalForm.status
      }
      const params = {
        ver: 'v1'
      }
      try {
        await ApiService.post(`${GENERAL_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(`update ${type} image value`, error);
      }
    },
    async getHmOffsetValue(site) {
      this.stateHmOffset = 0
      const eformStore = useInterimEngineStore()
      if (!eformStore.generalForm) return
      if (eformStore.generalForm.smu) {
        if (isUndefined(eformStore.generalForm.hmOffset) || isNull(eformStore.generalForm.hmOffset)) {
          this.stateHmOffset = "Not Applicable"
        } else {
          this.stateHmOffset = eformStore.generalForm.hmOffset
        }
      } else {
        const params = {
          ver: "v1",
          equipmentNo: eformStore.unitNumber,
          siteId: site,
          asIsDate: formatInternationalDate()
        };
        // get API
        try {
          const res: AxiosResponse<SingleApiResponse<ResponseHmOffset>> = await ApiService.get(
            `${GET_HM_OFFSET}`, "", new URLSearchParams(
              params,
            ).toString()
          );
          if (res.data.result.content.totalData == 0) this.stateHmOffset = 0
          else if (res.data.result.content.totalData > 0) {
            this.stateHmOffset = res.data.result.content.hmOffsetList[0].hmOffset
          }
        } catch (e) {
          sendErrorEvent('IRONS', e);
          console.log("error get hm offset", e);
        }
      }
    },
  }
});
