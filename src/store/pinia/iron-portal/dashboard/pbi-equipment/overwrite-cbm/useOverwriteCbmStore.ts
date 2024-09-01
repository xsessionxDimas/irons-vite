/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GET_DETAIL_CBM_API_URL,
  GET_DETAIL_CBM_INTERIM_API_URL,
  UPDATE_TASK_REVISE_API_URL,
  UPDATE_TASK_REVISE_DEFECT_API_URL,
  GET_IMAGE_API_URL,
  CHANGE_HISTORY_CBM_API_URL,
  GET_DETAIL_INTERVENTION_API_URL,
  UPDATE_TASK_REVISE_INTERIM_API_URL,
  UPDATE_TASK_REVISE_INTERIM_DEFECT_API_URL,
  UPDATE_TASK_INTERVENTION_REVISE_API_URL,
  UPDATE_TASK_INTERVENTION_REVISE_DEFECT_API_URL,
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  normalizeDate,
  formatDateForPostData
} from "@/core/helpers/date-format";
import {
  CbmManual,
  CbmAutomatic,
  CbmAverage,
  CbmOilCooled,
  AverageValue,
  AvgKey,
  OilCooledKey,
  ImagesItem,
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/OverwriteType"
import { Option } from "@/core/types/misc/Option";
import { sendErrorEvent } from "@/core/helpers/analytics";

type CbmHistoryChanges = {
  ratingOri: String | null;
  ratingUpdate: String | null;
  valueOri: String | null;
  valueUpdate: String | null;
}

const initialParamGetDetailCbm = {
  workOrder: "",
  taskKey: "",
  component: "",
  ver: "v1",
}

const initialParamGetMappingCbm = {
  model: "",
  psType: "",
  ver: "v1",
}

const defaultInputError = {
  measurementValue: {
    errorMessage: "",
    isShowError: false,
  },
  measurementRating: {
    errorMessage: "",
    isShowError: false,
  },
  camera: {
    errorMessage: "",
    isShowError: false,
  }
}

const defaultInputErrorOilCooled = {
  pistonA: {
    errorMessage: "",
    isShowError: false,
  },
  pistonB: {
    errorMessage: "",
    isShowError: false,
  },
  camera: {
    errorMessage: "",
    isShowError: false,
  },
};

const defaultInputErrorList = [
  {
    measurementValue: {
      errorMessage: "",
      isShowError: false,
    },
    measurementRating: {
      errorMessage: "",
      isShowError: false,
    },
    camera: {
      errorMessage: "",
      isShowError: false,
    },
  }
]

export const useOverwriteCbmStore = defineStore({
  id: "overwriteCbm",
  state: () => {
    return {
      stateParamGetDetailCbm: initialParamGetDetailCbm,
      stateParamGetMappingCbm: initialParamGetMappingCbm,
      stateDetailCbm: {} as any,
      stateIsError: false,
      stateError: "",
      stateModifiedObjectAvg: {} as CbmAverage,
      stateModifiedObjectAut: {
        taskNo: '',
        measurementLocation: '',
        uom: '',
        measurementValue: '',
        measurementRating: '',
        images: '',
      } as CbmAutomatic,
      stateModifiedObjectMan: {
        taskNo: '',
        measurementLocation: '',
        uom: '',
        measurementRating: '',
        images: '',
      } as CbmManual,
      stateModifiedObjectOilCooled: {
        taskNo: "",
        measurementLocation: "",
        tool: "",
        pistonMovementA: "",
        pistonMovementB: "",
        pistonMovementResult: "",
        uom: "",
        pistonMovementRating: "",
        rating: "",
        images: "",
      } as CbmOilCooled,
      stateCbmType: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateIsUserCanRevise: false,
      stateItemKey: {
        camera: '',
        rating: '',
        measurement: '',
      },
      stateItemKeyAvg: [] as AvgKey[],
      stateItemKeyOilCooled: {} as OilCooledKey,
      stateEmployeeData: {
        id: '',
        name: '',
      },
      stateInputErrorList: [
        ...defaultInputErrorList
      ],
      stateInputError: {
        ...defaultInputError
      },
      stateInputErrorOilCooled: {
        ...defaultInputErrorOilCooled,
      },
      stateCbmTypeAutomatic: [
        "AUTOMATIC",
        "AUTOMATIC_PREVIOUS",
        "DROPDOWN_TOOL",
        "BIRANA",
      ],
      stateCbmTypeManual: [
        "MANUAL",
        "NORMAL"
      ],
    }
  },
  getters: {
    detailCbm: (state) => {
      return state.stateDetailCbm;
    },
    cbmType: (state) => {
      return state.stateCbmType;
    },
    cbmTypeAutomatic: (state) => {
      return state.stateCbmTypeAutomatic;
    },
    cbmTypeManual: (state) => {
      return state.stateCbmTypeManual;
    },
    modifiedObjectAvg: (state) => {
      return state.stateModifiedObjectAvg;
    },
    modifiedObjAut: (state) => {
      return state.stateModifiedObjectAut;
    },
    modifiedObjMan: (state) => {
      return state.stateModifiedObjectMan;
    },
    modifiedObjOilCooled: (state) => {
      return state.stateModifiedObjectOilCooled;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    error: (state) => {
      return state.stateError;
    },
    errors: (state) => {
      return state.stateErrors;
    },
    isError: (state) => {
      return state.stateIsError;
    },
    inputErrorList: (state) => {
      return state.stateInputErrorList;
    },
    inputError: (state) => {
      return state.stateInputError
    },
    inputErrorOilCooled: (state) => {
      return state.stateInputErrorOilCooled;
    },
    isUserCanRevise: (state) => {
      return state.stateIsUserCanRevise;
    },
    itemKey: (state) => {
      return state.stateItemKey;
    },
    itemKeyOilCooled: (state) => {
      return state.stateItemKeyOilCooled;
    },
    isReplacementAdjustment: (state) => {
      if (state.stateDetailCbm.isReplacementAdjustment) {
        return state.stateDetailCbm.isReplacementAdjustment
      }
      return false
    }
  },
  actions: {
    setCbmType(source = 'serviceSheet') {
      const lastItemInHistoryModified = this.stateDetailCbm.historyModifiedDefault[this.stateDetailCbm.historyModifiedDefault.length - 1]
      if (lastItemInHistoryModified.rating == "AUTOMATIC") {
        const categoryItemTypeFromResponse = lastItemInHistoryModified.items.find((qeustionItem) => {
          return qeustionItem.categoryItemType == "resultParamRating"
        });
        this.stateCbmType = categoryItemTypeFromResponse ? "AVERAGE" : "AUTOMATIC"
        return
      }
      if (source == 'intervention' && (lastItemInHistoryModified.rating == 'AUTOMATIC_REPLACEMENT' || lastItemInHistoryModified.rating == 'AUTOMATIC_REPLACEMENT_GAP')) {
        // CBM Replacement on intervention is same with CBM Automatic
        this.stateCbmType = 'AUTOMATIC'
      } else {
        this.stateCbmType = lastItemInHistoryModified.rating
      }
    },
    setAverageForms() {
      this.stateInputErrorList = []
      this.stateModifiedObjectAvg.value = []
      for (let index = 0; index < this.stateDetailCbm.historyModifiedDefault.length; index++) {
        this.stateModifiedObjectAvg.value.push({
          measurementValue: "",
          measurementRating: "",
          uom: this.stateDetailCbm.currentCondition.uom,
          images: [],
        })
        this.stateInputErrorList.push({
          measurementValue: {
            errorMessage: "",
            isShowError: false,
          },
          measurementRating: {
            errorMessage: "",
            isShowError: false,
          },
          camera: {
            errorMessage: "",
            isShowError: false,
          },
        })
      }
    },
    setModifiedObject(detailCbm) {
      if (this.cbmType == 'AUTOMATIC' || this.cbmType.includes('PREVIOUS') || this.cbmType == 'CALIPER') {
        this.stateModifiedObjectAut = {
          taskNo: detailCbm.value.currentCondition.taskNo,
          measurementLocation: detailCbm.value.currentCondition.measurementLocation,
          uom: detailCbm.value.currentCondition.uom,
          measurementValue: "",
          measurementRating: "",
          images: ""
        } as CbmAutomatic;
      } else if (this.cbmType == 'NORMAL' || this.cbmType == 'MANUAL') {
        this.stateModifiedObjectMan = {
          taskNo: detailCbm.value.currentCondition.taskNo,
          measurementLocation: detailCbm.value.currentCondition.measurementLocation,
          uom: detailCbm.value.currentCondition.uom,
          measurementRating: "",
          images: ""
        } as CbmManual;
      } else if (this.cbmType == "AVERAGE") {
        this.setAverageForms()
      } else if (this.cbmType == "AUTOMATIC_REPLACEMENT" || this.cbmType == "AUTOMATIC_REPLACEMENT_GAP") {
        this.stateModifiedObjectAut = {
          taskNo: detailCbm.value.currentCondition.taskNo,
          measurementLocation: detailCbm.value.currentCondition.measurementLocation,
          uom: detailCbm.value.currentCondition.uom,
          measurementValue: "",
          measurementRating: "",
          images: ""
        } as CbmAutomatic;
      } else if (this.cbmType == "OIL_COOLED") {
        this.stateModifiedObjectOilCooled = {
          taskNo: detailCbm.value.currentCondition.taskNo,
          measurementLocation: detailCbm.value.currentCondition.measurementLocation,
          tool: detailCbm.value.currentCondition.pistonTool,
          pistonMovementA: "",
          pistonMovementB: "",
          pistonMovementResult: "",
          uom: detailCbm.value.currentCondition.pistonUom,
          pistonMovementRating: "",
          rating: "",
          images: "",
        } as CbmOilCooled
      }
    },
    setIsUserCanRevise(isRevise: boolean) {
      this.stateIsUserCanRevise = isRevise;
    },
    async getDetailCbm() {
      const params = {
        taskKey: this.stateParamGetDetailCbm.taskKey,
        workOrder: this.stateParamGetDetailCbm.workOrder,
        component: this.stateParamGetDetailCbm.component,
      };
      try {
        this.stateLoading = true;
        const response: AxiosResponse<ApiResponse<any>> = await ApiService.post(`${GET_DETAIL_CBM_API_URL}?ver=v1`, params as AxiosRequestConfig);
        this.stateDetailCbm = response.data.result.content;
        this.setCbmType();
        if (this.stateCbmType == "AVERAGE") {
          this.setAverageForms()
        }
      } catch (error) {
        console.log(error);
        sendErrorEvent('IRONS', error);
      } finally {
        this.stateLoading = false;
      }
    },
    async getDetailIntervention() {
      this.stateLoading = true;
      const params = {
        taskKey: this.stateParamGetDetailCbm.taskKey,
        workOrder: this.stateParamGetDetailCbm.workOrder,
        component: this.stateParamGetDetailCbm.component,
      };
      try {
        const response: AxiosResponse<ApiResponse<any>> = await ApiService.post(`${GET_DETAIL_INTERVENTION_API_URL}?ver=v1`, params as AxiosRequestConfig);
        this.stateDetailCbm = response.data.result.content;
        this.setCbmType('intervention');
      } catch (error) {
        console.log(error);
      } finally {
        this.stateLoading = false;
      }
    },
    async getDetailCbmInterim() {
      const params = {
        taskKey: this.stateParamGetDetailCbm.taskKey,
        workOrder: this.stateParamGetDetailCbm.workOrder,
        component: this.stateParamGetDetailCbm.component,
      };
      try {
        this.stateLoading = true;
        const response: AxiosResponse<ApiResponse<any>> = await ApiService.post(`${GET_DETAIL_CBM_INTERIM_API_URL}?ver=v1`, params as AxiosRequestConfig);
        this.stateDetailCbm = response.data.result.content;
        this.setCbmType();
      } catch (error) {
        console.log(error);
        sendErrorEvent('IRONS', error);
      } finally {
        this.stateLoading = false;
      }
    },
    async getImage(imageInfo) {
      if (!imageInfo) return null

      const params = {
        fileUrl: `${imageInfo.filename}`,
        ver: 'v1',
      }
      try {
        const urlWithParam = `${GET_IMAGE_API_URL}?${new URLSearchParams(params).toString()}`
        const response: AxiosResponse<Blob> = await ApiService.getBlob(urlWithParam)
        const buffer = response.data
        const blob = new Blob([buffer])
        const urlCreator = window.URL || window.webkitURL
        const url = urlCreator.createObjectURL(blob)
        return {
          key: imageInfo.filename,
          value: url,
          blob,
        }
      } catch (error) {
        console.log('image', error)
        return null
      }
    },
    defineItemKey(source = 'serviceSheet') {
      if ((this.stateCbmType == "AUTOMATIC_REPLACEMENT" || this.stateCbmType == "AUTOMATIC_REPLACEMENT_GAP") && source == 'serviceSheet') {
        this.stateItemKey.camera = this.stateDetailCbm.replacementPhoto[0].items[2].key

        // jika isReplacement true ===> taskKey value & rating utk payload diambil dari historyModifiedDefault, pake 1 task key besarnya doang
        if (this.isReplacementAdjustment) {
          this.stateItemKey.measurement = this.stateDetailCbm.historyModifiedDefault[0].items[0].key
          this.stateItemKey.rating = this.stateDetailCbm.historyModifiedDefault[0].items[0].key
          return
        }
        // jika isReplacement false ===> taskKey value & rating utk payload diambil dari beforeAdjustment, ngikut categoryItemType (paramRating dan targetRating)
        this.stateItemKey.measurement = this.stateDetailCbm.beforeReplacementItems[4].key // key dari paramRating
        this.stateItemKey.rating = this.stateDetailCbm.beforeReplacementItems[6].key // key dari targetRating
        return
      }

      for (const itemIndex in this.stateDetailCbm.historyModifiedDefault[0].items) {
        if (Object.hasOwnProperty.call(this.stateDetailCbm.historyModifiedDefault[0].items, itemIndex)) {
          const element = this.stateDetailCbm.historyModifiedDefault[0].items[itemIndex];
          if (
            this.cbmType == "MANUAL" ||
            this.cbmType == "NORMAL" &&
            element.categoryItemType == "resultRating") {
            this.stateItemKey.rating = element.key
          } else if (element.itemType == "smallCamera") {
            this.stateItemKey.camera = element.key
          } else if (element.categoryItemType == "paramRating" || element.categoryItemType == "paramRatingDynamic") {
            this.stateItemKey.measurement = element.key
          } else if (element.categoryItemType == "targetRating" || (element.itemType == "dropDown" && element.categoryItemType != "resultStatus")) {
            this.stateItemKey.rating = element.key
          } else if (element.description == "Adjustment") {
            this.stateItemKey.rating = element.key
            this.stateItemKey.measurement = element.key
            this.stateItemKey.camera = element.key
          }
        }
      }
    },
    defineItemMan() {
      for (const itemIndex in this.stateDetailCbm.historyModifiedDefault[0].items) {
        if (Object.hasOwnProperty.call(this.stateDetailCbm.historyModifiedDefault[0].items, itemIndex)) {
          const element = this.stateDetailCbm.historyModifiedDefault[0].items[itemIndex];
          if (element.itemType == "smallCamera") {
            this.stateItemKey.camera = element.key
          } else if (element.itemType == "dropDown" && element?.isTaskValue && element.categoryItemType != 'resultStatus') {
            this.stateItemKey.rating = element.key
          }
        }
      }
    },

    /**
     * defineItemKeyAvg
     */
    defineItemKeyAvg() {
      this.stateDetailCbm.historyModifiedDefault.forEach((el) => {
        const eachItem = {} as AvgKey
        for (const itemIndex in el.items) {
          if (Object.hasOwnProperty.call(el.items, itemIndex)) {
            const element = el.items[itemIndex];
            if (element.categoryItemType == "resultParamRating") {
              eachItem.value = element.key
            } else if (element.itemType == "smallCamera") {
              eachItem.camera = element.key
            } else if (element.itemType == "paramRating") {
              eachItem.rating = element.key
            } else if (element.category == "cbmCalculateAvg") {
              eachItem.value = element.key
            } else if (element.categoryItemType == "targetRating" || (element.itemType == "dropDown" && element.categoryItemType != "resultStatus")) {
              eachItem.rating = element.key
            }
          }
        }
        this.stateItemKeyAvg.push(eachItem)
      })
    },

    defineItemKeyOilCooled() {
      this.stateDetailCbm.historyModifiedDefault.forEach((el) => {
        for (const itemIndex in el.items) {
          if (Object.hasOwnProperty.call(el.items, itemIndex)) {
            const element = el.items[itemIndex];
            if (element.categoryItemType == "pistonMovementA") {
              this.stateItemKeyOilCooled.pistonMovementA = element.key;
            } else if (element.categoryItemType == "pistonMovementB") {
              this.stateItemKeyOilCooled.pistonMovementB = element.key;
            } else if (element.categoryItemType == "pistonMovementResult") {
              this.stateItemKeyOilCooled.pistonMovementResult = element.key;
            } else if (element.categoryItemType == "targetTool") {
              this.stateItemKeyOilCooled.uom = element.key;
            } else if (element.categoryItemType == "pistonMovementRating") {
              this.stateItemKeyOilCooled.pistonMovementRating = element.key;
            } else if (element.categoryItemType == "targetRating") {
              this.stateItemKeyOilCooled.rating = element.key;
            } else if (element.itemType == "smallCamera") {
              this.stateItemKeyOilCooled.camera = element.key;
            }
          }
        }
      });
    },


    getUrlApiUpdate(source: string) {
      switch (source) {
        case 'interim':
          return UPDATE_TASK_REVISE_INTERIM_API_URL;
        case 'intervention':
          return UPDATE_TASK_INTERVENTION_REVISE_API_URL;
        default:
          return UPDATE_TASK_REVISE_API_URL;
      }
    },
    getUrlApiDefectUpdate(source: string) {
      switch (source) {
        case 'interim':
          return UPDATE_TASK_REVISE_INTERIM_DEFECT_API_URL;
        case 'intervention':
          return UPDATE_TASK_INTERVENTION_REVISE_DEFECT_API_URL;
        default:
          return UPDATE_TASK_REVISE_DEFECT_API_URL;
      }
    },
    getBeforeValue(beforeValue) {
      const ratingObj = beforeValue.find((obj) => {
        return obj.categoryItemType == "targetRating";
      });
      let ratingValue = '';
      if (ratingObj) {
        ratingValue = ratingObj.value;
      }

      const uomObj = beforeValue.find((obj) => {
        return obj.categoryItemType == "targetTool";
      });
      let uomValue = '';
      if (uomObj) {
        uomValue = uomObj.value;
      } else if (!uomObj) {
        const measurementValueIndex = beforeValue.findIndex((obj) => {
          return (
            obj.categoryItemType == "paramRating" ||
            obj.categoryItemType == "paramRatingDynamic"
          )
        });
        uomValue = beforeValue[measurementValueIndex + 1].value;
      }

      const measurementObj = beforeValue.find((obj) => {
        return (
          obj.categoryItemType == "paramRating" ||
          obj.categoryItemType == "paramRatingDynamic"
        );
      });
      let measurementValue = '';
      if (measurementObj) {
        measurementValue = measurementObj.value;
      }

      return {
        rating: ratingValue,
        measurement: measurementValue,
        uom: uomValue
      }
    },

    /**
     * TECH-DEBT: type needs, explaination needs
     *
     * @param mRating
     * @param mValue
     * @param taskNo
     * @param source
     */
    async postDefectHistory(mRating, mValue, taskNo, source = 'serviceSheet', isOilCooled = false) {
      // make postDefectHistory function
      const isCbmAdjustment = this.stateDetailCbm.historyModifiedDefault[0].items[0].description == 'Adjustment';
      const beforeAdjustment = this.stateDetailCbm.beforeAdjustmentItems;
      const beforeReplacement = this.stateDetailCbm.beforeReplacementItems;

      const body = {
        "updateParams": [
          {
            "keyValue": this.stateDetailCbm.taskKey,
            "propertyParams": [
              {
                "propertyName": "taskValue",
                "propertyValue": mRating,
              }
            ]
          }
        ],
        "headerId": source == 'intervention' ? this.stateDetailCbm.id : this.stateDetailCbm.headerId,
        "workorder": this.stateDetailCbm.workOrder,
        "id": source == 'intervention' ? this.stateDetailCbm.id : this.stateDetailCbm.serviceSheetDetailId,
        "employee": this.stateEmployeeData,
        "defectHeader": {
          "workorder": this.stateDetailCbm.workOrder,
          "form": this.stateDetailCbm.form,
          "category": "CBM",
          "taskId": this.stateDetailCbm.taskKey,
          "taskNo": taskNo,
          "taskDesc": this.stateDetailCbm.currentCondition.measurementLocation,
          "defectWorkorder": "",
          "formDefect": "",
          "defectType": "",
          "cbmMeasurement": mValue ? mValue : "",
          "cbmUom": mValue ? this.stateDetailCbm.currentCondition.uom : "",
          "cbmImageKey": this.itemKey.camera,
          "cbmImageProp": source == 'intervention' ? "images" : "value",
          "isCbmAdjusment": isCbmAdjustment ? "true" : "false",
          "taskValue": mRating,
          "repairedStatus": "Not-Repaired",
          "cbmNAStatus": "Not-Confirm",
          "supervisor": this.stateEmployeeData,
          "status": "Submit"
        }
      }
      if (beforeAdjustment) {
        body['defectHeader']['correctedValue'] = mRating;
        body['defectHeader']['correctedMeasurement'] = mValue ? mValue : "";
        body['defectHeader']['correctedUom'] = mValue ? this.stateDetailCbm.currentCondition.uom : "";
        body['defectHeader']['taskValue'] = this.getBeforeValue(beforeAdjustment).rating;
        body['defectHeader']['cbmMeasurement'] = this.getBeforeValue(beforeAdjustment).measurement;
        body['defectHeader']['cbmUom'] = this.getBeforeValue(beforeAdjustment).uom;
      }
      if (beforeReplacement) {
        body['defectHeader']['correctedValue'] = mRating;
        body['defectHeader']['correctedMeasurement'] = mValue ? mValue : "";
        body['defectHeader']['correctedUom'] = mValue ? this.stateDetailCbm.currentCondition.uom : "";
        body['defectHeader']['taskValue'] = this.getBeforeValue(beforeReplacement).rating;
        body['defectHeader']['cbmMeasurement'] = this.getBeforeValue(beforeReplacement).measurement;
        body['defectHeader']['cbmUom'] = this.getBeforeValue(beforeReplacement).uom;
      }
      if (source == 'intervention') {
        body['defectHeader']['interventionHeaderId'] = this.stateDetailCbm.interventionHeaderId;
        body['defectHeader']['interventionId'] = this.stateDetailCbm.id;
      } else {
        body['defectHeader']['serviceSheetDetailId'] = this.stateDetailCbm.serviceSheetDetailId
      }
      // Oil Cooled
      if (isOilCooled) {
        body.defectHeader.cbmUom = this.stateModifiedObjectOilCooled.uom
        body.defectHeader["pistonUom"] = this.stateModifiedObjectOilCooled.uom
        body.defectHeader["cbmPistonA"] = this.stateModifiedObjectOilCooled.pistonMovementA
        body.defectHeader["cbmPistonB"] = this.stateModifiedObjectOilCooled.pistonMovementB
        body.defectHeader["cbmPistonResult"] = this.stateModifiedObjectOilCooled.pistonMovementResult
        body.defectHeader["cbmPistonTool"] = this.getPistonToolLabel(this.stateModifiedObjectOilCooled.tool)
      }

      try {
        const params = {
          ver: "v1"
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${this.getUrlApiDefectUpdate(source)}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        console.log(error)
        sendErrorEvent('IRONS', error);
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
    },

    getPistonToolLabel(toolValue: string) {
      const tempTool = this.stateDetailCbm.historyModifiedDefault[0].items.find((item) => {
        return item.categoryItemType == "dropdownTool"
      })
      if (tempTool) {
        let options = [] as Option[]
        let pistonToolVal = ""
        const itemValArr = tempTool.caption.replace("[", "").replace("]", "").split("; ")
        const valArr = tempTool.itemValue.replace("[", "").replace("]", "").split(", ")
        options = itemValArr.map((el, index) => {
          return {
            label: el.replaceAll("'", ''),
            value: valArr[index].replaceAll("'", '')
          }
        });
        options.forEach((opt) => {
          if (opt.value == tempTool.value) {
            pistonToolVal = opt.label;
          }
        })
        const toolOption = options.find((item) => {
          return item.value == toolValue
        })
        return toolOption?.label
      }
      return ""
    },

    /**
     * updateTaskReviseManual
     *
     * @param component
     * @param sampleDate
     * @param userAccount
     * @param source
     * @returns
     */
    async updateTaskReviseManual(component: string, sampleDate: string, userAccount: string, source: string) {
      this.defineItemMan();
      const defectValue = this.modifiedObjMan.measurementRating == "X" || this.modifiedObjMan.measurementRating == "C"
      if (defectValue) {
        this.postDefectHistory(this.modifiedObjMan.measurementRating, null, this.modifiedObjMan.taskNo, source);
      }
      const payload = {
        "headerId": source == 'intervention' ? this.stateDetailCbm.id : this.stateDetailCbm.headerId,
        "workorder": this.stateDetailCbm.workOrder,
        "taskKey": this.stateDetailCbm.taskKey,
        "id": source == 'intervention' ? this.stateDetailCbm.id : this.stateDetailCbm.serviceSheetDetailId,
        "isUpdatePhoto": false,
        "updateParams": [
          {
            "keyValue": this.itemKey.rating,
            "propertyParams": [
              {
                "propertyName": "value",
                "propertyValue": this.modifiedObjMan.measurementRating
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          },
          {
            "keyValue": this.stateDetailCbm.taskKey,
            "propertyParams": [
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          }
        ],
        "employee": this.stateEmployeeData
      }
      if (source == 'intervention') {
        payload['component'] = component;
      }
      if (this.modifiedObjMan.images.length != 0) {
        payload.isUpdatePhoto = true;
        payload.updateParams.push(
          {
            "keyValue": source == 'intervention' ? this.stateDetailCbm.taskKey : this.itemKey.camera,
            "propertyParams": [
              {
                "propertyName": source == 'intervention' ? "images" : "value",
                "propertyValue": JSON.stringify(this.modifiedObjMan.images)
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          }
        )
      }
      if (this.modifiedObjMan.measurementRating == "A" || this.modifiedObjMan.measurementRating == "B") {
        payload.updateParams.push({
          "keyValue": this.stateDetailCbm.taskKey,
          "propertyParams": [
            {
              "propertyName": "taskValue",
              "propertyValue": this.modifiedObjMan.measurementRating
            },
            {
              "propertyName": "updatedBy",
              "propertyValue": JSON.stringify(this.stateEmployeeData)
            },
            {
              "propertyName": "updatedDate",
              "propertyValue": "<<ServerDateTime>>"
            }
          ]
        })
      }
      const modifiedObject = {
        measurementRating: this.modifiedObjMan.measurementRating,
        measurementValue: null,
      }
      try {
        this.stateLoading = true;
        const params = {
          ver: "v1"
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${this.getUrlApiUpdate(source)}?${new URLSearchParams(params).toString()}`, payload as any)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
        await this.changeHistoryCBM(modifiedObject, component, new Date(sampleDate), userAccount);
        return response
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      } finally {
        this.stateLoading = false;
      }
    },

    /**
     *  updateTaskReviseAutomatic
     *
     * @param component
     * @param sampleDate
     * @param userAccount
     * @param source
     * @returns
     */
    async updateTaskReviseAutomatic(component: string, sampleDate: string, userAccount: string, source = 'serviceSheet') {
      this.defineItemKey();

      const defectValue = this.modifiedObjAut.measurementRating == "X" || this.modifiedObjAut.measurementRating == "C";

      const taskDesc: string | undefined = this.stateDetailCbm?.historyModifiedDefault[0].description;

      if (!taskDesc) throw Error("Object is incorrect, invalid description");

      // NOTE: _ is description
      const [taskNumber, subtaskNumber, _] = taskDesc.split(";")

      const taskNo = taskNumber + ";" + subtaskNumber

      if (defectValue) {
        this.postDefectHistory(
          this.modifiedObjAut.measurementRating,
          this.modifiedObjAut.measurementValue,
          taskNo,
          source
        );
      }

      const isCbmAdjustment = this.stateDetailCbm.historyModifiedDefault[0].items[0].description == 'Adjustment';

      const payload = {
        "headerId": source == 'intervention' ? this.stateDetailCbm.id : this.stateDetailCbm.headerId,
        "workorder": this.stateDetailCbm.workOrder,
        "taskKey": this.stateDetailCbm.taskKey,
        "id": source == 'intervention' ? this.stateDetailCbm.id : this.stateDetailCbm.serviceSheetDetailId,
        "isUpdatePhoto": false,
        "updateParams": [
          {
            "keyValue": this.itemKey.rating,
            "propertyParams": [
              {
                "propertyName": isCbmAdjustment ? "rating" : "value",
                "propertyValue": this.modifiedObjAut.measurementRating
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          }
        ],
        "employee": this.stateEmployeeData
      }
      if (!isCbmAdjustment) {
        payload.updateParams.push(
          {
            "keyValue": this.stateDetailCbm.taskKey,
            "propertyParams": [
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          }
        )
      }
      if (source == 'intervention') {
        payload['component'] = component;
      }
      if (this.itemKey.measurement !== "") {
        payload.updateParams.push({
          "keyValue": this.itemKey.measurement,
          "propertyParams": [
            {
              "propertyName": isCbmAdjustment ? "measurement" : "value",
              "propertyValue": this.modifiedObjAut.measurementValue
            },
            {
              "propertyName": "updatedBy",
              "propertyValue": JSON.stringify(this.stateEmployeeData)
            },
            {
              "propertyName": "updatedDate",
              "propertyValue": "<<ServerDateTime>>"
            }
          ]
        })
      }
      if (this.modifiedObjAut.measurementRating == "A" || this.modifiedObjAut.measurementRating == "B") {
        payload.updateParams.push({
          "keyValue": this.stateDetailCbm.taskKey,
          "propertyParams": [
            {
              "propertyName": "taskValue",
              "propertyValue": this.modifiedObjAut.measurementRating
            },
            {
              "propertyName": "updatedBy",
              "propertyValue": JSON.stringify(this.stateEmployeeData)
            },
            {
              "propertyName": "updatedDate",
              "propertyValue": "<<ServerDateTime>>"
            }
          ]
        })
      }
      if (this.modifiedObjAut.images.length != 0) {
        payload.isUpdatePhoto = true;
        payload.updateParams.push(
          {
            "keyValue": source == 'intervention' ? this.stateDetailCbm.taskKey : this.itemKey.camera,
            "propertyParams": [
              {
                "propertyName": source == 'intervention' ? 'images' : isCbmAdjustment ? "pictures" : "value",
                "propertyValue": JSON.stringify(this.modifiedObjAut.images)
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          }
        )
      }
      const modifiedObject = {
        measurementRating: this.modifiedObjAut.measurementRating,
        measurementValue: this.modifiedObjAut.measurementValue,
      }
      try {
        this.stateLoading = true;
        const params = {
          ver: "v1"
        };
        console.log("payload", payload)
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${this.getUrlApiUpdate(source)}?${new URLSearchParams(params).toString()}`, payload as any)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
        await this.changeHistoryCBM(modifiedObject, component, new Date(sampleDate), userAccount);
        return response
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      } finally {
        this.stateLoading = false;
      }
    },

    /**
     *  updateTaskReviseAutomaticReplacementAndGap
     *
     * @param component
     * @param sampleDate
     * @param userAccount
     * @returns
     */
    async updateTaskReviseAutomaticReplacementAndGap(component: string, sampleDate: string, userAccount: string, source = 'serviceSheet') {
      this.defineItemKey(source);

      const defectValue = this.modifiedObjAut.measurementRating == "X" || this.modifiedObjAut.measurementRating == "C";

      const taskDesc: string | undefined = this.stateDetailCbm?.historyModifiedDefault[0].description;

      if (!taskDesc) throw Error("Object is incorrect, invalid description");

      // NOTE: _ is description
      const [taskNumber, subtaskNumber, _] = taskDesc.split(";")

      const taskNo = taskNumber + ";" + subtaskNumber

      if (defectValue) {
        this.postDefectHistory(
          this.modifiedObjAut.measurementRating,
          this.modifiedObjAut.measurementValue,
          taskNo,
          source
        );
      }

      const payload = {
        "headerId": source == 'intervention' ? this.stateDetailCbm.id : this.stateDetailCbm.headerId,
        "workorder": this.stateDetailCbm.workOrder,
        "taskKey": this.stateDetailCbm.taskKey,
        "id": source == 'intervention' ? this.stateDetailCbm.id : this.stateDetailCbm.serviceSheetDetailId,
        "isUpdatePhoto": false,
        "updateParams": [
          {
            "keyValue": this.itemKey.measurement,
            "propertyParams": [
              {
                "propertyName": this.isReplacementAdjustment ? "measurement" : "value",
                "propertyValue": this.modifiedObjAut.measurementValue
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          },
          {
            "keyValue": this.itemKey.rating,
            "propertyParams": [
              {
                "propertyName": this.isReplacementAdjustment ? "rating" : "value",
                "propertyValue": this.modifiedObjAut.measurementRating
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          },
        ],
        "employee": this.stateEmployeeData
      }
      if (this.modifiedObjAut.measurementRating == "A" || this.modifiedObjAut.measurementRating == "B") {
        payload.updateParams.push({
          "keyValue": this.stateDetailCbm.taskKey,
          "propertyParams": [
            {
              "propertyName": "taskValue",
              "propertyValue": this.modifiedObjAut.measurementRating
            },
            {
              "propertyName": "updatedBy",
              "propertyValue": JSON.stringify(this.stateEmployeeData)
            },
            {
              "propertyName": "updatedDate",
              "propertyValue": "<<ServerDateTime>>"
            }
          ]
        })
      }
      if (this.modifiedObjAut.measurementRating == "C" || this.modifiedObjAut.measurementRating == "X") {
        payload.updateParams.push({
          "keyValue": this.stateDetailCbm.taskKey,
          "propertyParams": [
            {
              "propertyName": "updatedBy",
              "propertyValue": JSON.stringify(this.stateEmployeeData)
            },
            {
              "propertyName": "updatedDate",
              "propertyValue": "<<ServerDateTime>>"
            }
          ]
        })
      }
      if (this.modifiedObjAut.images.length > 0) {
        payload.isUpdatePhoto = true;
        payload.updateParams.push({
          "keyValue": source == 'intervention' ? this.stateDetailCbm.taskKey : this.itemKey.camera,
          "propertyParams": [
            {
              "propertyName": source == 'intervention' ? "images" : "value",
              "propertyValue": JSON.stringify(this.modifiedObjAut.images)
            },
            {
              "propertyName": "updatedBy",
              "propertyValue": JSON.stringify(this.stateEmployeeData)
            },
            {
              "propertyName": "updatedDate",
              "propertyValue": "<<ServerDateTime>>"
            }
          ]
        })
      }
      if (source == 'intervention') {
        payload['component'] = component;
      }
      const modifiedObject = {
        measurementRating: this.modifiedObjAut.measurementRating,
        measurementValue: this.modifiedObjAut.measurementValue,
      }
      try {
        this.stateLoading = true;
        const params = {
          ver: "v1"
        };
        console.log("payload", payload)

        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${this.getUrlApiUpdate(source)}?${new URLSearchParams(params).toString()}`, payload as any)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
        await this.changeHistoryCBM(modifiedObject, component, new Date(sampleDate), userAccount);
        return response;
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      } finally {
        this.stateLoading = false;
      }
    },

    /**
     * updateTaskReviseAverage
     */
    async updateTaskReviseAverage() {
      this.stateLoading = true;
      this.defineItemKeyAvg();
      const promises: Promise<any>[] = [];
      this.modifiedObjectAvg.value.forEach((el, idx) => {
        promises.push(
          new Promise<any>((resolve) => {
            this.avgReviseSingle(
              el,
              idx,
            ).then(resolve)
          })
        )
      })
      // reset after using
      this.stateItemKeyAvg = []

      await Promise.allSettled(promises).then((res) => {
        const result = res.map((val) => {
          if (val.status === "fulfilled") {
            return val.value
          }
        });

        const errorResponse = result.find((response) => {
          // if response give error
          return response.data.title === "Error"
        });

        if (errorResponse) {
          this.stateErrors.push(errorResponse.data.result.message);
          this.stateIsError = true;
        }
      }).finally(() => {
        this.stateLoading = false;
      })
    },

    /**
     *  updateTaskReviseOilCooled
     *
     * @param component
     * @param sampleDate
     * @param userAccount
     * @param source
     * @returns
     */
    async updateTaskReviseOilCooled(component: string, sampleDate: string, userAccount: string, source = 'serviceSheet') {
      this.defineItemKeyOilCooled();

      const defectValue = this.modifiedObjOilCooled.rating == "X" || this.modifiedObjOilCooled.rating == "C";

      const taskDesc: string | undefined = this.stateDetailCbm?.historyModifiedDefault[0].description;

      if (!taskDesc) throw Error("Object is incorrect, invalid description");

      // NOTE: _ is description
      const [taskNumber, subtaskNumber, _] = taskDesc.split(";")

      const taskNo = taskNumber + ";" + subtaskNumber

      if (defectValue) {
        this.postDefectHistory(
          this.modifiedObjOilCooled.rating,
          Number(this.modifiedObjOilCooled.pistonMovementRating) / 100,
          taskNo,
          source,
          true
        );
      }

      const isCbmAdjustment = this.stateDetailCbm.historyModifiedDefault[0].items[0].description == 'Adjustment';

      const payload = {
        "headerId": source == 'intervention' ? this.stateDetailCbm.id : this.stateDetailCbm.headerId,
        "workorder": this.stateDetailCbm.workOrder,
        "taskKey": this.stateDetailCbm.taskKey,
        "id": source == 'intervention' ? this.stateDetailCbm.id : this.stateDetailCbm.serviceSheetDetailId,
        "isUpdatePhoto": false,
        "updateParams": [
          {
            "keyValue": this.itemKeyOilCooled.pistonMovementA,
            "propertyParams": [
              {
                "propertyName": "value",
                "propertyValue": this.modifiedObjOilCooled.pistonMovementA
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          },
          {
            "keyValue": this.itemKeyOilCooled.pistonMovementB,
            "propertyParams": [
              {
                "propertyName": "value",
                "propertyValue": this.modifiedObjOilCooled.pistonMovementB
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          },
          {
            "keyValue": this.itemKeyOilCooled.pistonMovementResult,
            "propertyParams": [
              {
                "propertyName": "value",
                "propertyValue": this.modifiedObjOilCooled.pistonMovementResult
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          },
          {
            "keyValue": this.itemKeyOilCooled.uom,
            "propertyParams": [
              {
                "propertyName": "value",
                "propertyValue": this.modifiedObjOilCooled.uom
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          },
          {
            "keyValue": this.itemKeyOilCooled.pistonMovementRating,
            "propertyParams": [
              {
                "propertyName": "value",
                "propertyValue": Number(this.modifiedObjOilCooled.pistonMovementRating) / 100
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          },
          {
            "keyValue": this.itemKeyOilCooled.rating,
            "propertyParams": [
              {
                "propertyName": "value",
                "propertyValue": this.modifiedObjOilCooled.rating
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          },
          {
            "keyValue": this.stateDetailCbm.taskKey,
            "propertyParams": [
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          }
        ],
        "employee": this.stateEmployeeData
      }
      if (this.modifiedObjOilCooled.rating == "A" || this.modifiedObjOilCooled.rating == "B") {
        payload.updateParams.push({
          "keyValue": this.stateDetailCbm.taskKey,
          "propertyParams": [
            {
              "propertyName": "taskValue",
              "propertyValue": this.modifiedObjOilCooled.rating
            },
            {
              "propertyName": "updatedBy",
              "propertyValue": JSON.stringify(this.stateEmployeeData)
            },
            {
              "propertyName": "updatedDate",
              "propertyValue": "<<ServerDateTime>>"
            }
          ]
        })
      }

      if (this.modifiedObjOilCooled.images.length != 0) {
        payload.isUpdatePhoto = true;
        payload.updateParams.push(
          {
            "keyValue": source == 'intervention' ? this.stateDetailCbm.taskKey : this.itemKeyOilCooled.camera,
            "propertyParams": [
              {
                "propertyName": source == 'intervention' ? 'images' : isCbmAdjustment ? "pictures" : "value",
                "propertyValue": JSON.stringify(this.modifiedObjOilCooled.images)
              },
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          }
        )
      }
      const modifiedObject = {
        ratingOri: this.stateDetailCbm.currentCondition.pistonRating,
        ratingUpdate: this.modifiedObjOilCooled.rating,
        valueOri: this.stateDetailCbm.currentCondition.pistonPercentageValue,
        valueUpdate: `${Number(this.modifiedObjOilCooled.pistonMovementRating) / 100}`,
      }
      try {
        this.stateLoading = true;
        const params = {
          ver: "v1"
        };
        console.log("payload", payload)
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${this.getUrlApiUpdate(source)}?${new URLSearchParams(params).toString()}`, payload as any)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
        await this.changeHistoryCBMNew(modifiedObject, component, new Date(sampleDate), userAccount);
        return response
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      } finally {
        this.stateLoading = false;
      }
    },

    /**
     * Revise avg for one task
     *
     * @param avgPayload
     * @param itemKey
     * @returns
     */
    async avgReviseSingle(avgPayload: AverageValue, idx: number) {
      const itemKey = this.stateItemKeyAvg[idx] as AvgKey;
      const taskKey = this.stateDetailCbm.historyModifiedDefault[idx]?.key;
      const taskDesc: string | undefined = this.stateDetailCbm?.historyModifiedDefault[idx].description;

      if (!taskDesc) throw Error("Object is incorrect, invalid description");

      // NOTE: _ is description
      const [taskNumber, subtaskNumber, _] = taskDesc.split(";")

      const taskNo = taskNumber + ";" + subtaskNumber
      const rating = avgPayload.measurementRating
      const value = avgPayload.measurementValue

      const has_rating = !!rating;

      if (has_rating) {
        const is_defect_value = ["C", "X"]
          .includes(rating);

        // report when is defect
        if (is_defect_value) {
          await this.postDefectHistory(rating, value, taskNo).catch(() => {
            throw Error("Defect history is failed to update");
          })
        }
      }
      console.log('index:', idx)
      const payload = {
        "headerId": this.stateDetailCbm.headerId,
        "workorder": this.stateDetailCbm.workOrder,
        "taskKey": taskKey,
        "id": this.stateDetailCbm.serviceSheetDetailId,
        "isUpdatePhoto": false,
        "updateParams": [] as any[],
        "employee": this.stateEmployeeData
      }
      if (idx == 3) {
        console.log('ok')
        payload.updateParams.push(
          {
            "keyValue": this.stateDetailCbm.taskKey,
            "propertyParams": [
              {
                "propertyName": "updatedBy",
                "propertyValue": JSON.stringify(this.stateEmployeeData)
              },
              {
                "propertyName": "updatedDate",
                "propertyValue": "<<ServerDateTime>>"
              }
            ]
          }
        )
      }

      const ratingPayload = {
        "keyValue": itemKey.rating,
        "propertyParams": [
          {
            "propertyName": "value",
            "propertyValue": rating
          },
          {
            "propertyName": "updatedBy",
            "propertyValue": JSON.stringify(this.stateEmployeeData)
          },
          {
            "propertyName": "updatedDate",
            "propertyValue": "<<ServerDateTime>>"
          }
        ]
      }
      const valuePayload = {
        "keyValue": itemKey.value,
        "propertyParams": [
          {
            "propertyName": "value",
            "propertyValue": value
          },
          {
            "propertyName": "updatedBy",
            "propertyValue": JSON.stringify(this.stateEmployeeData)
          },
          {
            "propertyName": "updatedDate",
            "propertyValue": "<<ServerDateTime>>"
          }
        ]
      }
      const cameraPayload = {
        "keyValue": itemKey.camera,
        "propertyParams": [
          {
            "propertyName": "value",
            "propertyValue": JSON.stringify(avgPayload.images)
          },
          {
            "propertyName": "updatedBy",
            "propertyValue": JSON.stringify(this.stateEmployeeData)
          },
          {
            "propertyName": "updatedDate",
            "propertyValue": "<<ServerDateTime>>"
          }
        ]
      }

      if (rating == "A" || rating == "B") {
        payload.updateParams.push({
          "keyValue": taskKey,
          "propertyParams": [
            {
              "propertyName": "taskValue",
              "propertyValue": rating
            },
            {
              "propertyName": "updatedBy",
              "propertyValue": JSON.stringify(this.stateEmployeeData)
            },
            {
              "propertyName": "updatedDate",
              "propertyValue": "<<ServerDateTime>>"
            }
          ]
        })
      }

      if (avgPayload.images.length != 0) {
        payload.isUpdatePhoto = true;
        payload.updateParams.push(cameraPayload)
      }
      if (itemKey.value) {
        payload.updateParams.push(valuePayload)
      }
      if (itemKey.rating) {
        payload.updateParams.push(ratingPayload)
      }
      const params = {
        ver: "v1"
      };

      const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_TASK_REVISE_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig)
      return response
    },

    async changeHistoryCBM(modifiedObject, component: string, sampleDate: Date, userAccount: string) {
      const body = {
        equipment: this.stateDetailCbm.equipment,
        component: component,
        taskKey: this.stateDetailCbm.taskKey,
        sampleDate: sampleDate ? formatDateForPostData(normalizeDate(sampleDate)) : "",
        ratingOri: this.stateDetailCbm.currentCondition.rating,
        ratingUpdate: modifiedObject.measurementRating,
        valueOri: this.stateDetailCbm.currentCondition.value || this.stateDetailCbm.currentCondition.measurementValue || null,
        valueUpdate: modifiedObject.measurementValue || null,
        interventionReason: this.stateDetailCbm.currentCondition.measurementLocation,
        workOrder: this.stateDetailCbm.workOrder,
      }
      try {
        const params = {
          userAccount: userAccount,
          ver: "v1"
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CHANGE_HISTORY_CBM_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
        if (response.data.title === "Error") {
          console.log("error", response)
        }
        return response
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async changeHistoryCBMNew(
      modifiedObject: CbmHistoryChanges,
      component: string,
      sampleDate: Date,
      userAccount: string,
    ) {
      const body = {
        equipment: this.stateDetailCbm.equipment,
        component: component,
        taskKey: this.stateDetailCbm.taskKey,
        sampleDate: sampleDate
          ? formatDateForPostData(normalizeDate(sampleDate))
          : "",
        ratingOri: modifiedObject.ratingOri,
        ratingUpdate: modifiedObject.ratingUpdate,
        valueOri: modifiedObject.valueOri,
        valueUpdate: modifiedObject.valueUpdate,
        interventionReason:
          this.stateDetailCbm.currentCondition.measurementLocation,
        workOrder: this.stateDetailCbm.workOrder,
      };
      try {
        const params = {
          userAccount: userAccount,
          ver: "v1",
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> =
          await ApiService.post(
            `${CHANGE_HISTORY_CBM_API_URL}?${new URLSearchParams(
              params,
            ).toString()}`,
            body as AxiosRequestConfig,
          );
        if (response.data.title === "Error") {
          console.log("error", response);
        }
        return response;
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error);
      }
    },
    setImagePerRowAverage(rowIndex: number, images: ImagesItem[]) {
      const is_object_exists = this.stateModifiedObjectAvg.value[rowIndex];
      if (!is_object_exists) throw Error("never found index row");

      if (typeof this.stateModifiedObjectAvg.value[rowIndex].images == 'string') {
        this.stateModifiedObjectAvg.value[rowIndex].images = []
      }

      const newImageObject = images;

      this.stateModifiedObjectAvg.value[rowIndex].images = newImageObject;
    },
    setImageManual(images: string) {
      this.stateModifiedObjectMan.images = images
    },
    setImageAutomatic(images: string) {
      this.stateModifiedObjectAut.images = images
    },
    setImageOilCooled(images: string) {
      this.stateModifiedObjectOilCooled.images = images;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setInputErrorCbmAutomatic(errorText: string, isShowError: boolean) {
      this.stateInputError.measurementValue.errorMessage = errorText
      this.stateInputError.measurementValue.isShowError = isShowError
    },
    setInputErrorCbmManual(errorText: string, isShowError: boolean) {
      this.stateInputError.measurementRating.errorMessage = errorText
      this.stateInputError.measurementRating.isShowError = isShowError
    },
    setInputErrorCbmOilCooledPistonA(errorText: string, isShowError: boolean) {
      this.stateInputErrorOilCooled.pistonA.errorMessage = errorText;
      this.stateInputErrorOilCooled.pistonA.isShowError = isShowError;
    },
    setInputErrorCbmOilCooledPistonB(errorText: string, isShowError: boolean) {
      this.stateInputErrorOilCooled.pistonB.errorMessage = errorText;
      this.stateInputErrorOilCooled.pistonB.isShowError = isShowError;
    },

    initErrorInputCbmAverage() {
      this.stateInputErrorList = [];
      const detailCBM = Array.from(this.stateDetailCbm.historyModifiedDefault);

      detailCBM.forEach(() => {
        this.stateInputErrorList.push(defaultInputErrorList[0])
      })
    },

    /**
     *
     * @param rowIndex
     * @param errorText
     * @param isShowError
     */
    setInputErrorCbmAverage(rowIndex: number, errorText: string, isShowError: boolean) {
      this.stateInputErrorList[rowIndex].measurementValue.errorMessage = errorText
      this.stateInputErrorList[rowIndex].measurementValue.isShowError = isShowError
    },
    setParamGetDetailCbm(param) {
      this.stateParamGetDetailCbm.taskKey = param.taskKey;
      this.stateParamGetDetailCbm.workOrder = param.workOrder;
      this.stateParamGetDetailCbm.component = param.component;
    },
    setAutomaticRating(rating) {
      this.stateModifiedObjectAut.measurementRating = rating
    },
    setOilCooledPercentWorn(percent) {
      this.stateModifiedObjectOilCooled.pistonMovementRating = percent;
    },
    setOilCooledRating(rating) {
      this.stateModifiedObjectOilCooled.rating = rating;
    },
    setModifiedData(index: number, field: keyof AverageValue, value) {
      this.stateModifiedObjectAvg.value[index][field] = value
    },
    resetParamGetDetailCbm() {
      this.stateParamGetDetailCbm = {
        ...initialParamGetDetailCbm
      };
    },
    resetList() {
      this.stateDetailCbm = {} as any
      this.stateIsError = false
      this.stateError = ""
      this.stateErrors = [] as string[]
      this.stateLoading = false
      this.stateIsUserCanRevise = false
    },
    resetErrors() {
      this.stateErrors = [] as string[];
      this.stateIsError = false;
      this.stateInputError = {
        ...defaultInputError
      }
      this.stateInputErrorList = [
        ...defaultInputErrorList
      ]
    },
  },
});
