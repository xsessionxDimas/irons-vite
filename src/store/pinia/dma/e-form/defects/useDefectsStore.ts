import { defineStore } from "pinia";
import {
  GET_DEFECTS_HEADER,
  GET_DEFECTS_DETAIL,
  UPDATE_DEFECT_DETAIL,
  UPDATE_DEFECT_HEADER,
  GET_DETAIL_FIELD_VALUE,
  UPDATE_DEFECT_DETAIL_FITTER,
  GET_ALL_DEFECTS,
  GET_DEFECTS_CBM
} from "./urls"
import {
  Detail,
  DetailHistory
} from "@/core/types/entities/dma/defects/Detail"
import {
  Header,
  HeaderHistory
} from "@/core/types/entities/dma/defects/Header"
import ApiService from "@/core/services/ApiService"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import DefectApprovalClass from "@/core/classes/DefectsApprovalClass"
import DefectYesClass from "@/core/classes/DefectYesClass"
import CrackYesClass from "@/core/classes/CrackYesClass"
import { useCameraStore } from "@/store/pinia/application/useCameraStore"
import { ImageObject } from "@/core/types/entities/dma/ImageObject"
import { useAttachmentStore } from "../attachments/useAttachmentStore"
import { Part } from "@/core/types/entities/dma/e-form/defects/Part"
import { Labour } from "@/core/types/entities/dma/e-form/defects/Labour"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { useEFormStore } from "../useEFormStore";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import DefectNoClass from "@/core/classes/DefectNoClass";
import CrackNoClass from "@/core/classes/CrackNoClass";
import { isEmpty, isUndefined } from "lodash";
import { AESTCurrentDateTime } from "@/core/helpers/date-format";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  WrapperListDefectSections
} from "@/core/types/entities/dma/defects/ListDefectSections"
import { Comment } from "@/database/schema/Comment"
import { Audit } from "@/core/types/intervention/Audit"
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo"
import {
  CBMInfoDetail
} from "@/core/types/entities/dma/defects/component-intervention/CBMInfoDetail";
import { sendCustomEvent } from "@/core/helpers/azure-app-insight";
import { DefectSMU } from "@/core/types/entities/dma/defects/DefectSMU";
import {
  Dimensions
} from "@/core/types/entities/report/history/historical-eform-dma/ImageItem";
import {
  useGlobalConnectionStore
} from "@/store/pinia/application/useGlobalConnectionStore"
import { convertErrorMessage } from "../helpers"
import {
  assignCrackDetail,
  assignDefectDetail,
  downloadImageAttachments
} from "@/store/pinia/dma/e-form-offline/defects/methods";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useDefectsStore = defineStore({
  id: "defects",
  state: () => {
    return {
      stateLoading: false,
      stateData: new DefectApprovalClass(),
      stateComments: [] as Comment[],
      stateDefectFormData: new DefectYesClass(),
      stateDefectNoFormData: new DefectNoClass(),
      stateCrackFormData: new CrackYesClass(),
      stateCrackSimpleFormData: new CrackNoClass(),
      stateDefectSMU: {} as DefectSMU,
      stateIsError: false,
      stateHeaderId: "",
      stateDetailId: "",
      stateHeaderStatus: "",
      stateDefectFetched: false,
      stateDefectGeneralStatus: "",
      stateLoadDefectImages: false,
      stateApproveBy: undefined as Audit | undefined,
      stateApproveDate: undefined as string | undefined,
      stateDefectPictures: {},
      stateDefectKey: 1,
      stateDefectDetails: [] as Detail[],
      stateReferencePhoto: {
        title: "",
        blob: "",
        id: "",
        dimension: {} as Dimensions,
      },
      stateDefectFormStatusSPV: "",
      stateErrorMessage: "",
      stateCurrentUserGroup: "",
      stateErrorByNetwork: false,
      stateDefectHeaderHistory: [] as HeaderHistory[],
      stateSelectedHeaderHistory: [] as HeaderHistory[],
      stateDefectDetailHistory: [] as DetailHistory[],
      stateSelectedDetailHistory: [] as DetailHistory[],
      stateSelectedDetailVersion: {} as DetailHistory,
      stateDefectHeaders: [] as Header[],
    }
  },
  getters: {
    Loading: (state) => {
      return state.stateLoading;
    },
    GeneralStatus: (state) => {
      return state.stateDefectGeneralStatus
    },
    ApprovalData: (state) => {
      return state.stateData;
    },
    DefectKey: (state) => {
      return state.stateDefectKey;
    },
    DefectFormData: (state) => {
      return state.stateDefectFormData;
    },
    CrackFormData: (state) => {
      return state.stateCrackFormData;
    },
    ImagesDefect: () => {
      const cameraStore = useCameraStore();
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "defect";
      }) as ImageObject;
    },
    ImagesCrack: () => {
      const cameraStore = useCameraStore();
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "crack";
      }) as ImageObject;
    },
    IsError: (state) => {
      return state.stateIsError;
    },
    ErrorMessage: (state) => {
      return state.stateErrorMessage;
    },
    HeaderId: (state) => {
      return state.stateHeaderId;
    },
    DetailId: (state) => {
      return state.stateDetailId;
    },
    DataFetched: (state) => {
      return state.stateDefectFetched;
    },
    HeaderStatus: (state) => {
      return state.stateHeaderStatus;
    },
    DefectPictures: (state) => {
      return state.stateDefectPictures;
    },
    LoadDefectImages: (state) => {
      return state.stateLoadDefectImages;
    },
    referencePhoto: (state) => {
      return state.stateReferencePhoto;
    },
    Comments: (state) => {
      return state.stateComments;
    },
    ApproveBy: (state) => {
      return state.stateApproveBy;
    },
    ApproveDate: (state) => {
      return state.stateApproveDate;
    },
    DefectFormStatusSPV: (state) => {
      return state.stateDefectFormStatusSPV;
    },
    DefectSMUHeader: (state): Header => {
      return (
        state.stateData.SMUDefectHeaders.find((obj) => {
          return obj.defectType == "machineSMU";
        }) ?? ({} as Header)
      );
    },
    DefectSMUDetail: (state) => {
      return state.stateDefectSMU;
    },
    DefectSMUDetailDetail: (state) => {
      return state.stateData.SMUDefectDetails.find((d) => {
        return d.defectHeaderId == state.stateDetailId;
      });
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore();
    },
    DefectHeaderHistory: (state) => {
      return state.stateDefectHeaderHistory
    },
    DefectDetailHistory: (state) => {
      return state.stateDefectDetailHistory
    },
    SelectedDefectHeaderHistory: (state) => {
      return state.stateSelectedHeaderHistory
    },
    SelectedDefectDetailVersion: (state) => {
      return state.stateSelectedDetailVersion
    },
    VersionDate: (state) => {
      const dates = state.stateSelectedHeaderHistory.map((header) => {
        return header.createdDate
      })
      return dates
    },
  },
  actions: {
    setCurrentUserGroup(userGroup: string): void {
      this.stateCurrentUserGroup = userGroup;
    },
    setHeaderId(id: string) {
      this.stateHeaderId = id;
    },
    setDefectFetched(value) {
      this.stateDefectFetched = value;
    },
    setDetailId(id: string) {
      this.stateDetailId = id;
    },
    createRequestBody(workorder: string) {
      return {
        workorder: workorder,
      };
    },
    async getDefectsDataHeader(workorder: string) {
      const body = this.createRequestBody(workorder);
      try {
        const response: AxiosResponse<ApiResponse<Header>> =
          await ApiService.post(
            `${GET_DEFECTS_HEADER}`,
            body as AxiosRequestConfig,
          );
        /* set the state */
        this.stateData.setHeaders(response.data.result.content);
      } catch (error) {
        sendCustomEvent("fe_event_error_get_defect_header", {
          errorMessage: error,
        });
        sendErrorEvent('IRONS', error);
      }
    },
    async getDefectsDataDetail(workorder: string) {
      try {
        const body = this.createRequestBody(workorder);
        const response: AxiosResponse<ApiResponse<Detail>> =
          await ApiService.post(
            `${GET_DEFECTS_DETAIL}`,
            body as AxiosRequestConfig,
          );
        /* set the state */
        this.stateData.setDetails(response.data.result.content);
        this.stateDefectDetails = response.data.result.content;
        // await this.setReferencePhoto(detail.referenceSection, detail.referencePhoto)
      } catch (error) {
        sendCustomEvent("fe_event_error_get_defect_detail", {
          errorMessage: error,
        });
        sendErrorEvent('IRONS', error);
      }
    },
    toggleErrorByNetwork(status: boolean) {
      this.stateErrorByNetwork = status;
    },
    async getDefectsDataAll(workorder: string) {
      const params = {
        workOrder: workorder,
        ver: "v1",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<WrapperListDefectSections>> = await ApiService.get(`${GET_ALL_DEFECTS}`, "", new URLSearchParams(params).toString())
        /* set the state */
        this.stateData.setHeaders(response.data.result.content?.content.defectHeader || [])
        this.stateData.setDetails(response.data.result.content?.content.defectDetail || [])
        this.stateDefectDetails = response.data.result.content?.content.defectDetail || []
        this.stateDefectHeaders = response.data.result.content?.content.defectHeader || []
        this.stateComments = response.data.result.content?.content.comment || []
        this.stateDefectHeaderHistory = response.data.result.content?.content.defectHeaderHistory || []
        this.stateDefectDetailHistory = response.data.result.content?.content.defectDetailHistory || []
        this.stateApproveBy = response.data.result.content?.content.approvedBy || undefined
        this.stateApproveDate = response.data.result.content?.content.approvedDate || ""
      } catch (error) {
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(
          error as string,
        );
        this.stateErrorByNetwork = isNoNetwork;
        sendCustomEvent("fe_event_error_get_defect_all_data", {
          errorMessage: error,
        });
        sendErrorEvent('IRONS', error);
      }
    },
    setSelectedDefectHeaderHistory(headerId: string) {
      if (this.stateDefectHeaderHistory && this.stateDefectHeaderHistory.length > 0) {
        this.stateSelectedHeaderHistory = this.stateDefectHeaderHistory.filter((h) => {
          return h.defectHeaderId == headerId
        })
      }
      return []
    },
    setDetailVersion(createdDate: string): boolean {
      if (!createdDate) {
        this.stateSelectedDetailVersion = {} as DetailHistory
      }
      const found = this.stateSelectedDetailHistory.find((d) => {
        return d.createdDate.substring(0, 15) == createdDate.substring(0, 15)
      })
      if (found) {
        this.stateSelectedDetailVersion = found
        return true
      }
      return false
    },
    resetDetailVersion() {
      this.stateSelectedDetailVersion = this.stateSelectedDetailHistory[0] ?? {} as DetailHistory
    },
    setSelectedDefectDetailHistory(headerId: string) {
      if (this.stateDefectDetailHistory && this.stateDefectDetailHistory.length > 0) {
        this.stateSelectedDetailHistory = this.stateDefectDetailHistory.filter((d) => {
          return d.defectHeaderId == headerId
        })
      }
      return []
    },
    async getDefectsData(workorder: string) {
      this.stateLoading = true;
      try {
        this.setDefectFetched(false);
        await this.getDefectsDataAll(workorder);
        this.setDefectFetched(true);
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error);
        console.error(error);
      }
      this.stateLoading = false;
    },
    async getDefectsDataCBM(workOrder: string, taskKey: string) {
      const body = {
        workOrder: workOrder,
        taskKey: taskKey,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<CBMInfoDetail>> =
          await ApiService.post(
            `${GET_DEFECTS_CBM}`,
            body as AxiosRequestConfig,
          );
        return response.data.result.content;
      } catch (error) {
        sendCustomEvent("fe_event_error_get_defect_cbm", {
          errorMessage: error,
        });
        sendErrorEvent('IRONS', error);
      }
    },
    getDefectDetail(headerId: string) {
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      return found;
    },
    getDefectHeader(headerId: string) {
      const found = this.ApprovalData.DefectHeaders.find((d) => {
        return d.id == headerId;
      });
      return found;
    },
    getDefectGenericHeader(headerId: string) {
      const found = this.ApprovalData.DefectGenericHeaders.find((d) => {
        return d.id == headerId;
      });
      return found;
    },
    getDefectGenericDetail(headerId: string) {
      const found = this.ApprovalData.DefectGenericDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      return found;
    },
    getCrackHeader(headerId: string) {
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id == headerId;
      });
      return found;
    },
    getCrackDetail(headerId: string) {
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      return found;
    },
    getCompleteStatus(headerId): boolean {
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        return found.detail.isComplete ?? true
      }
      return true
    },
    getGenericCompleteStatus(headerId): boolean {
      const found = this.ApprovalData.DefectGenericDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        return found.detail.isComplete ?? true
      }
      return true
    },
    getCrackCompleteStatus(headerId): boolean {
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        return found.detail.isComplete ?? true
      }
      return true
    },
    async setDefectImages(images) {
      const imageObject = await downloadImageAttachments(images, undefined)
      this.ImagesDefect.ImageInfos = imageObject.ImageInfos
      this.ImagesDefect.ImageBlobs = imageObject.ImageBlobs
    },
    async setCrackImages(images) {
      const imageObject = await downloadImageAttachments(images, undefined)
      this.ImagesCrack.ImageInfos = imageObject.ImageInfos
      this.ImagesCrack.ImageBlobs = imageObject.ImageBlobs
    },
    async setDefectGeneralStatus(headerId: string) {
      const header = this.ApprovalData.DefectHeaders.find((h) => {
        return h.id === headerId
      })
      this.stateDefectGeneralStatus = header?.generalStatus ?? ""
    },
    async setGenericDefectGeneralStatus(headerId: string) {
      const header = this.ApprovalData.DefectGenericHeaders.find((h) => {
        return h.id === headerId
      })
      this.stateDefectGeneralStatus = header?.generalStatus ?? ""
    },
    async setCrackGeneralStatus(headerId: string) {
      const header = this.ApprovalData.CrackHeaders.find((h) => {
        return h.id === headerId
      })
      this.stateDefectGeneralStatus = header?.generalStatus ?? ""
    },
    async setDefectData(headerId: string): Promise<string | undefined> {
      const header = this.ApprovalData.DefectHeaders.find((h) => {
        return h.id === headerId;
      });
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      if (found) {
        this.setHeaderId(headerId)
        this.setDetailId(found.id)
        this.setSelectedDefectHeaderHistory(headerId)
        this.setSelectedDefectDetailHistory(headerId)
        const [result] = assignDefectDetail(found.detail)
        this.stateDefectFormData = result
        this.stateDefectFormData.setTitle(header?.taskDesc || "")
        this.stateHeaderStatus = header?.status as string
        const imageObject = await downloadImageAttachments(found.detail.images, undefined)
        this.ImagesDefect.ImageInfos = imageObject.ImageInfos
        this.ImagesDefect.ImageBlobs = imageObject.ImageBlobs
        return found.detail.type
      }
    },
    async setDefectDataGeneric(headerId: string): Promise<string | undefined> {
      const header = this.ApprovalData.DefectGenericHeaders.find((h) => {
        return h.id === headerId;
      });
      const found = this.ApprovalData.DefectGenericDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      if (found) {
        this.setHeaderId(headerId)
        this.setDetailId(found.id)
        this.setSelectedDefectHeaderHistory(headerId)
        this.setSelectedDefectDetailHistory(headerId)
        const [result] = assignDefectDetail(found.detail)
        this.stateDefectFormData = result
        this.stateDefectFormData.setTitle(header?.taskDesc || "")
        this.stateDefectFormStatusSPV = header?.status as string
        this.stateHeaderStatus = header?.status as string
        const imageObject = await downloadImageAttachments(found.detail.images, undefined)
        this.ImagesDefect.ImageInfos = imageObject.ImageInfos
        this.ImagesDefect.ImageBlobs = imageObject.ImageBlobs
        return found.detail.type
      }
    },
    setSMUDefectData(headerId: string): boolean {
      let isFound = false
      const attachmentStore = useAttachmentStore();
      const header = this.ApprovalData.SMUDefectHeaders.find((h) => {
        return h.id === headerId;
      });
      const found = this.ApprovalData.SMUDefectDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      if (found) {
        isFound = true
        this.setHeaderId(headerId);
        this.setDetailId(found.id);
        this.stateHeaderStatus = header?.status as string;
        this.stateDefectSMU = found.detail;
        const promises = [] as Promise<Blob>[];
        this.ImagesDefect.ImageInfos.forEach((f: string | ImageInfo) => {
          let filename = "";
          if (typeof f == "string") {
            filename = f;
          } else {
            filename = f.filename;
          }
          promises.push(
            attachmentStore.downloadAttachment(filename) as Promise<Blob>,
          );
        });
        Promise.all(promises).then((blobs) => {
          blobs.forEach((b) => {
            const blob = new Blob([b], { type: "image/png" });
            this.ImagesDefect.ImageBlobs.push(blob);
          });
        });
      }
      return isFound
    },
    async getDefectImages(id: string, key: string, field: string) {
      const body = {
        id: id,
        keyValue: key,
        propertyName: field,
      };
      const params = {
        ver: "v1",
      };
      let result = [] as string[];
      try {
        const response: AxiosResponse<ApiResponse<string>> =
          await ApiService.post(
            `${GET_DETAIL_FIELD_VALUE}?${new URLSearchParams(
              params,
            ).toString()}`,
            body as AxiosRequestConfig,
          );
        if (!isUndefined(response.data.result.content)) {
          result = response.data.result.content;
        }
      } catch (error) {
        sendCustomEvent("fe_event_error_get_defect_images", {
          errorMessage: error,
        });
        sendErrorEvent('IRONS', error);
      }
      return result;
    },
    setLoadingImages(value: boolean) {
      this.stateLoadDefectImages = value;
    },
    setNewDefectKey() {
      this.stateDefectKey += 1;
    },
    async getDefectPictures(headerId: string) {
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      if (found) {
        this.stateDefectPictures[headerId] = JSON.parse(found.detail.images);
      }
    },
    getCrackPictures(headerId: string) {
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      if (found) {
        this.stateDefectPictures[headerId] = JSON.parse(found.detail.images);
      }
    },
    setDefectNewData(isUpdateAcknowledge = true) {
      const detail = this.ApprovalData.DefectDetails.find((d) => {
        return d.id === this.stateDetailId;
      }) as unknown as Detail;
      if (detail) {
        detail.detail.description = this.DefectFormData.Description.value;
        detail.detail.plannedDuration =
          this.DefectFormData.PlannedDuration.value;
        detail.detail.instruction = this.DefectFormData.Instruction.value;
        detail.detail.priority = this.DefectFormData.Priority;
        detail.detail.parts = JSON.stringify(
          this.DefectFormData.Parts as Part[],
        );
        detail.detail.labours = JSON.stringify(
          this.DefectFormData.Labours as Labour[],
        );
        detail.detail.resources = JSON.stringify(
          this.DefectFormData.Resources.map((r) => {
            return r.value;
          }),
        );
        detail.detail.symptoms = JSON.stringify(
          this.DefectFormData.Symptoms.map((s) => {
            return s.value;
          }),
        );
        detail.detail.causes = JSON.stringify(
          this.DefectFormData.Causes.map((c) => {
            return c.value;
          }),
        );
        detail.detail.images = JSON.stringify(
          this.ImagesDefect?.ImageInfos ?? [],
        );
      }
      const header = this.ApprovalData.DefectHeaders.find((h) => {
        return h.id === this.stateHeaderId;
      }) as unknown as Header;
      if (header) {
        if (isUpdateAcknowledge) {
          header.status = "Acknowledge";
        }
      }
    },
    createDefectDetail() {
      const images = this.ImagesDefect?.ImageInfos ?? [];
      const formattedPartsDataList = this.DefectFormData.Parts.map((item) => {
        const qty = item.qty ? String(parseFloat(item.qty)) : item.qty;

        return {
          ...item,
          qty,
        };
      });
      const formattedLabourDataList = this.DefectFormData.Labours.map(
        (item) => {
          const qty = item.qty ? String(parseFloat(item.qty)) : item.qty;
          const hireEach = item.hireEach
            ? String(parseFloat(item.hireEach))
            : item.hireEach;

          return {
            ...item,
            qty,
            hireEach,
          };
        },
      );
      return {
        type: this.DefectFormData.Type,
        assetNumber: this.DefectFormData.AssetNumber,
        description: this.DefectFormData.Description.value,
        title: this.DefectFormData.Title,
        raisedBy: this.DefectFormData.RaisedBy,
        date: this.DefectFormData.Date,
        plannedDuration: String(
          parseFloat(this.DefectFormData.PlannedDuration.value),
        ),
        instruction: this.DefectFormData.Instruction.value,
        priority: this.DefectFormData.Priority,
        parts: JSON.stringify(formattedPartsDataList as Part[]),
        labours: JSON.stringify(formattedLabourDataList as Labour[]),
        resources: JSON.stringify(
          this.DefectFormData.Resources.map((r) => {
            return r.value;
          }),
        ),
        symptoms: JSON.stringify(
          this.DefectFormData.Symptoms.map((s) => {
            return s.value;
          }),
        ),
        causes: JSON.stringify(
          this.DefectFormData.Causes.map((c) => {
            return c.value;
          }),
        ),
        images: JSON.stringify(images),
        // reference photo
        referencePhoto: this.stateReferencePhoto.id,
        referenceSection: this.stateReferencePhoto.title,
        isComplete: this.DefectFormData.IsComplete,
        requirement: this.DefectFormData.DefectRequirement
      }
    },
    async updateDefectDetail(generic = false) {
      const authStore = useAuthenticationStore();
      let found;
      if (generic) {
        found = this.ApprovalData.DefectGenericDetails.find((d) => {
          return d.id === this.stateDetailId;
        }) as unknown as Detail;
      } else {
        found = this.ApprovalData.DefectDetails.find((d) => {
          return d.id === this.stateDetailId;
        }) as unknown as Detail;
      }
      const detail = this.createDefectDetail();
      const payload = {
        id: this.DetailId,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "detail",
                propertyValue: JSON.stringify(detail),
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
      };
      try {
        this.stateIsError = false;
        const res = await ApiService.post(
          `${UPDATE_DEFECT_DETAIL}`,
          payload as AxiosRequestConfig,
        );
        if (res.data.statusError == 400) {
          this.stateIsError = true;
          return res.data.result.message;
        }
        return "";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_update_defect_detail", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        const eformStore = useEFormStore();
        eformStore.toggleTaskAlreadyUpdatedStatus(true);
        const message = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
        return message;
      }
    },
    async updateDefectAcknowledge(
      params: {
        generic?: boolean;
        smu?: boolean;
        newTitle?: string;
      } = {
        generic: false,
        smu: false,
      },
    ) {
      const authStore = useAuthenticationStore();
      let found;
      if (params.generic) {
        found = this.ApprovalData.DefectGenericHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
      } else if (params.smu) {
        found = this.ApprovalData.SMUDefectHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
      } else {
        found = this.ApprovalData.DefectHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
      }
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "status",
                propertyValue: "Acknowledge",
              },
              {
                propertyName: "approvedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "approvedDate",
                propertyValue: "<<ServerDateTime>>",
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };

      if (params.newTitle) {
        payload.updateParams[0].propertyParams.push({
          propertyName: "taskDesc",
          propertyValue: params.newTitle,
        });
      }

      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.status = "Acknowledge";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_acknowledge_defect", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDownloadHistory(id, type, generic = false) {
      let found;
      if (type == "defect") {
        if (generic) {
          found = this.ApprovalData.DefectGenericHeaders.find((d) => {
            return d.id === id;
          }) as unknown as Header;
        } else {
          found = this.ApprovalData.DefectHeaders.find((d) => {
            return d.id === id;
          }) as unknown as Header;
        }
      } else {
        found = this.ApprovalData.CrackHeaders.find((d) => {
          return d.id === id;
        }) as unknown as Header;
      }
      const authStore = useAuthenticationStore();
      if (!found) return;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "downloadHistory",
                propertyValue: true,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: AESTCurrentDateTime(),
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        if (found.downloadHistory) {
          found.downloadHistory.push({
            downloadBy: {
              id: authStore.user.EmployeeId,
              name: authStore.user.Name,
            },
          });
        } else {
          found.downloadHistory = [
            {
              downloadBy: {
                id: authStore.user.EmployeeId,
                name: authStore.user.Name,
              },
            },
          ];
        }
      } catch (error) {
        sendCustomEvent("fe_event_error_update_donwload_defect_pdf_history", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
      this.stateData.setDetails(this.stateDefectDetails);
    },
    async updateDefectDecline(val, generic = false) {
      const authStore = useAuthenticationStore();
      let found;
      if (generic) {
        found = this.ApprovalData.DefectGenericHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
      } else {
        found = this.ApprovalData.DefectHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
      }
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "status",
                propertyValue: "Decline",
              },
              {
                propertyName: "declineReason",
                propertyValue: val,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: AESTCurrentDateTime(),
              },
              {
                propertyName: "declineBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "declineDate",
                propertyValue: AESTCurrentDateTime(),
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.status = "Decline";
        found.declineReason = val;
        found.declineBy = {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        };
        found.declineDate = AESTCurrentDateTime();
        this.stateHeaderStatus = "Decline";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_decline_defect", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
      this.stateData.setDetails(this.stateDefectDetails);
    },
    async updatePlannerDefectDecline(val, generic = false) {
      const authStore = useAuthenticationStore();
      let found;
      if (generic) {
        found = this.ApprovalData.DefectGenericHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
      } else {
        found = this.ApprovalData.DefectHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
      }
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "plannerStatus",
                propertyValue: "Decline",
              },
              {
                propertyName: "declineReason",
                propertyValue: val,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: AESTCurrentDateTime(),
              },
              {
                propertyName: "declineBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "declineDate",
                propertyValue: AESTCurrentDateTime(),
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.plannerStatus = "Decline";
        found.declineReason = val;
        found.declineBy = {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        };
        found.declineDate = AESTCurrentDateTime();
        this.stateHeaderStatus = "Decline";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_decline_defect_planner", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
      this.stateData.setDetails(this.stateDefectDetails);
    },
    async updateCrackDecline(val) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === this.stateHeaderId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "status",
                propertyValue: "Decline",
              },
              {
                propertyName: "declineReason",
                propertyValue: val,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: AESTCurrentDateTime(),
              },
              {
                propertyName: "declineBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "declineDate",
                propertyValue: AESTCurrentDateTime(),
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.status = "Decline";
        found.declineReason = val;
        found.declineBy = {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        };
        found.declineDate = AESTCurrentDateTime();
        this.stateHeaderStatus = "Decline";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_decline_crack", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
      this.stateData.setDetails(this.stateDefectDetails);
    },
    async updatePlannerCrackDecline(val) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === this.stateHeaderId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "plannerStatus",
                propertyValue: "Decline",
              },
              {
                propertyName: "declineReason",
                propertyValue: val,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: AESTCurrentDateTime(),
              },
              {
                propertyName: "declineBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "declineDate",
                propertyValue: AESTCurrentDateTime(),
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.plannerStatus = "Decline";
        found.declineReason = val;
        found.declineBy = {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        };
        found.declineDate = AESTCurrentDateTime();
        this.stateHeaderStatus = "Decline";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_decline_crack_planner", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
      this.stateData.setDetails(this.stateDefectDetails);
    },
    async updatePlannerDefectAcknowledge(
      params: {
        generic?: boolean;
        smu?: boolean;
        newTitle?: string;
      } = {
        generic: false,
        smu: false,
      },
    ) {
      const authStore = useAuthenticationStore();
      let found;
      if (params.generic) {
        found = this.ApprovalData.DefectGenericHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
      } else if (params.smu) {
        found = this.ApprovalData.SMUDefectHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
      } else {
        found = this.ApprovalData.DefectHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
      }
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "plannerStatus",
                propertyValue: "Acknowledge",
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };

      if (params.newTitle) {
        payload.updateParams[0].propertyParams.push({
          propertyName: "taskDesc",
          propertyValue: params.newTitle,
        });
      }
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.plannerStatus = "Acknowledge";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_acknlowedge_defect_planner", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectFitter(fitter: string, generic = false, userGroup = "") {
      let found;
      if (generic) {
        found = this.ApprovalData.DefectGenericDetails.find((d) => {
          return d.id === this.stateDetailId;
        }) as unknown as Detail;
      } else {
        found = this.ApprovalData.DefectDetails.find((d) => {
          return d.id === this.stateDetailId;
        }) as unknown as Detail;
      }
      const detail = this.createDefectDetail();
      const payload = {
        id: this.DetailId,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "detail",
                propertyValue: JSON.stringify(detail),
              },
              {
                propertyName: "updatedBy",
                propertyValue: fitter,
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: JSON.parse(fitter)
      } as any
      if (userGroup) {
        payload.userGroup = userGroup;
      }
      try {
        this.stateIsError = false;
        const res = await ApiService.post(
          `${UPDATE_DEFECT_DETAIL_FITTER}`,
          payload as AxiosRequestConfig,
        );
        if (userGroup) return;
        let foundHeader;
        if (generic) {
          foundHeader = this.ApprovalData.DefectGenericHeaders.find((d) => {
            return d.id === this.stateHeaderId;
          }) as unknown as Header;
        } else {
          foundHeader = this.ApprovalData.DefectHeaders.find((d) => {
            return d.id === this.stateHeaderId;
          }) as unknown as Header;
        }

        const payloadHeader = {
          id: this.HeaderId,
          updateParams: [
            {
              keyValue: foundHeader.key,
              propertyParams: [
                {
                  propertyName: "workorder",
                  propertyValue: foundHeader.workorder,
                },
                {
                  propertyName: "updatedBy",
                  propertyValue: fitter,
                },
                {
                  propertyName: "updatedDate",
                  propertyValue: "<<ServerDateTime>>",
                },
              ],
            },
          ],
          employee: JSON.parse(fitter),
        };
        try {
          this.stateIsError = false;
          await ApiService.post(
            `${UPDATE_DEFECT_HEADER}`,
            payloadHeader as AxiosRequestConfig,
          );
          return res.data.result.message;
        } catch (error: any) {
          sendCustomEvent("fe_event_error_update_defect_fitter", {
            errorMessage: error,
          });
          updateLoggedInStatusFromAPIResponse(error);
          this.stateIsError = true;
          const message = error.response.data.result.message;
          return message;
        }
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error);
        this.stateIsError = true;
        const message = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
        return message;
      }
    },
    resetErrorStatus() {
      this.stateIsError = false;
      this.stateErrorMessage = "";
    },
    async updateDefectMO(headerId: string, mo: string, generic = false) {
      const authStore = useAuthenticationStore();
      let found;
      if (generic) {
        found = this.ApprovalData.DefectGenericHeaders.find((d) => {
          return d.id === headerId;
        }) as unknown as Header;
      } else {
        found = this.ApprovalData.DefectHeaders.find((d) => {
          return d.id === headerId;
        }) as unknown as Header;
      }
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "defectWorkorder",
                propertyValue: mo,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.defectWorkorder = mo;
      } catch (error: any) {
        sendCustomEvent("fe_event_error_update_defect_mo", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCompleteStatus(key: string, value: boolean) {
      const authStore = useAuthenticationStore();
      const payload = {
        id: key,
        updateParams: [
          {
            keyValue: key,
            propertyParams: [
              {
                propertyName: "isComplete",
                propertyValue: value,
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_DETAIL}`,
          payload as AxiosRequestConfig,
        );
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectDetailSMU(detail: any = {}) {
      const authStore = useAuthenticationStore();
      let updatedDetail = this.stateDefectSMU;
      if (!isEmpty(detail)) {
        updatedDetail = detail;
      }
      const payload = {
        id: this.DetailId,
        updateParams: [
          {
            keyValue: this.DetailId,
            propertyParams: [
              {
                propertyName: "detail",
                propertyValue: JSON.stringify(updatedDetail),
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_DETAIL}`,
          payload as AxiosRequestConfig,
        );
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updateRepairedStatus(
      headerId: string,
      value: string,
      isGeneric = false,
    ) {
      const authStore = useAuthenticationStore();
      let found;
      if (isGeneric) {
        found = this.ApprovalData.DefectGenericHeaders.find((d) => {
          return d.id === headerId;
        }) as unknown as Header;
      } else {
        found = this.ApprovalData.DefectHeaders.find((d) => {
          return d.id === headerId;
        }) as unknown as Header;
      }
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "repairedStatus",
                propertyValue: value,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.repairedStatus = value;
      } catch (error) {
        sendCustomEvent("fe_event_error_update_repaired_status", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectConfirmedStatus(headerId: string, reason = "") {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.DefectNAHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "cbmNAStatus",
                propertyValue: "Confirmed",
              },
              {
                propertyName: "approveReason",
                propertyValue: reason,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
              {
                propertyName: "approvedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "approvedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.cbmNAStatus = "Confirmed";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_update_defect_confirmed_status", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerDefectConfirmedStatus(headerId: string) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.DefectNAHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "plannerCbmNAStatus",
                propertyValue: "Confirmed",
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.plannerCbmNAStatus = "Confirmed";
      } catch (error: any) {
        sendCustomEvent(
          "fe_event_error_update_defect_confirmed_status_planner",
          {
            errorMessage: error,
          },
        );
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCrackConfirmedStatus(headerId: string, reason = "") {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackNAHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "cbmNAStatus",
                propertyValue: "Confirmed",
              },
              {
                propertyName: "approveReason",
                propertyValue: reason,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
              {
                propertyName: "approvedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "approvedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.cbmNAStatus = "Confirmed";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_update_crack_confirmed_status", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerCrackConfirmedStatus(headerId: string) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackNAHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "plannerCbmNAStatus",
                propertyValue: "Confirmed",
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.plannerCbmNAStatus = "Confirmed";
      } catch (error: any) {
        sendCustomEvent(
          "fe_event_error_update_crack_confirmed_status_planner",
          {
            errorMessage: error,
          },
        );
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCBMConfirmedStatus(headerId: string, reason: string) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CBMHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "cbmNAStatus",
                propertyValue: "Confirmed",
              },
              {
                propertyName: "approveReason",
                propertyValue: reason,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
              {
                propertyName: "appSPVBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "appSPVDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.cbmNAStatus = "Confirmed";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_update_cbm_confirmed_status", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerCBMConfirmedStatus(headerId: string, reason: string) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CBMHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "plannerCbmNAStatus",
                propertyValue: "Confirmed",
              },
              {
                propertyName: "plannerApproveReason",
                propertyValue: reason,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
              {
                propertyName: "appPlannerBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "appPlannerDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.plannerCbmNAStatus = "Confirmed";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_update_cbm_confirmed_status_planner", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectDeclineStatus(headerId: string, reason) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.DefectNAHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "cbmNAStatus",
                propertyValue: "Decline",
              },
              {
                propertyName: "declineReason",
                propertyValue: reason,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
              {
                propertyName: "declineBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "declineDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.cbmNAStatus = "Decline";
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerDefectDeclineStatus(headerId: string, reason) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.DefectNAHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "plannerCbmNAStatus",
                propertyValue: "Decline",
              },
              {
                propertyName: "declineReason",
                propertyValue: reason,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
              {
                propertyName: "declineBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "declineDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.plannerCbmNAStatus = "Decline";
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCrackDeclineStatus(headerId: string, reason) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackNAHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "cbmNAStatus",
                propertyValue: "Decline",
              },
              {
                propertyName: "declineReason",
                propertyValue: reason,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
              {
                propertyName: "declineBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "declineDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.cbmNAStatus = "Decline";
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerCrackDeclineStatus(headerId: string, reason) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackNAHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "plannerCbmNAStatus",
                propertyValue: "Decline",
              },
              {
                propertyName: "declineReason",
                propertyValue: reason,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
              {
                propertyName: "declineBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "declineDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.plannerCbmNAStatus = "Decline";
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        this.stateErrorMessage = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
      }
    },
    async setCrackData(headerId: string) {
      const header = this.ApprovalData.CrackHeaders.find((h) => {
        return h.id === headerId;
      });
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      if (found) {
        this.setHeaderId(headerId)
        this.setDetailId(found.id)
        this.setSelectedDefectHeaderHistory(headerId)
        this.setSelectedDefectDetailHistory(headerId)
        this.stateDefectFormStatusSPV = header?.status as string
        this.stateHeaderStatus = header?.status as string
        const [result] = assignCrackDetail(found.detail)
        this.stateCrackFormData = result
        this.stateCrackFormData.setType(found.detail.type)
        await this.setReferencePhoto(found.detail.referenceSection, found.detail.referencePhoto)
        const imageObject = await downloadImageAttachments(found.detail.images, undefined)
        this.ImagesCrack.ImageInfos = imageObject.ImageInfos
        this.ImagesCrack.ImageBlobs = imageObject.ImageBlobs
        return found.detail.type
      }
    },
    setCrackNewData() {
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.id === this.stateDetailId;
      }) as any;
      if (found) {
        found.detail.description = this.CrackFormData.Description.value;
        found.detail.plannedDuration = this.CrackFormData.PlannedDuration.value;
        found.detail.instruction = this.CrackFormData.Instruction.value;
        found.detail.priority = this.CrackFormData.Priority;
        found.detail.parts = JSON.stringify(this.CrackFormData.Parts as Part[]);
        found.detail.labours = JSON.stringify(
          this.CrackFormData.Labours as Labour[],
        );
        found.detail.resources = JSON.stringify(
          this.CrackFormData.Resources.map((r) => {
            return r.value;
          }),
        );
        found.detail.symptoms = JSON.stringify(
          this.CrackFormData.Symptoms.map((s) => {
            return s.value;
          }),
        );
        found.detail.causes = JSON.stringify(
          this.CrackFormData.Causes.map((c) => {
            return c.value;
          }),
        );
        found.detail.previousCracks = JSON.stringify(
          this.CrackFormData.CrackLength,
        );
        found.detail.images = JSON.stringify(
          this.ImagesCrack?.ImageInfos ?? [],
        );
      }
    },
    createCrackDetail() {
      const images = this.ImagesCrack?.ImageInfos ?? [];
      const formattedPartsDataList = this.CrackFormData.Parts.map((item) => {
        const qty = item.qty ? String(parseFloat(item.qty)) : item.qty;

        return {
          ...item,
          qty,
        };
      });
      const formattedLabourDataList = this.CrackFormData.Labours.map((item) => {
        const qty = item.qty ? String(parseFloat(item.qty)) : item.qty;
        const hireEach = item.hireEach
          ? String(parseFloat(item.hireEach))
          : item.hireEach;

        return {
          ...item,
          qty,
          hireEach,
        };
      });
      const formattedCrackLengthDataList = this.CrackFormData.CrackLength.map(
        (item) => {
          const currentCrack = item.currentCrack
            ? String(parseFloat(item.currentCrack))
            : item.currentCrack;

          return {
            ...item,
            currentCrack,
          };
        },
      );
      return {
        type: this.CrackFormData.Type,
        assetNumber: this.CrackFormData.AssetNumber,
        description: this.CrackFormData.Description.value,
        title: this.CrackFormData.Title,
        raisedBy: this.CrackFormData.RaisedBy,
        date: this.CrackFormData.Date,
        plannedDuration: String(
          parseFloat(this.CrackFormData.PlannedDuration.value),
        ),
        instruction: this.CrackFormData.Instruction.value,
        priority: this.CrackFormData.Priority,
        parts: JSON.stringify(formattedPartsDataList as Part[]),
        labours: JSON.stringify(formattedLabourDataList as Labour[]),
        resources: JSON.stringify(
          this.CrackFormData.Resources.map((r) => {
            return r.value;
          }),
        ),
        symptoms: JSON.stringify(
          this.CrackFormData.Symptoms.map((s) => {
            return s.value;
          }),
        ),
        causes: JSON.stringify(
          this.CrackFormData.Causes.map((c) => {
            return c.value;
          }),
        ),
        images: JSON.stringify(images),
        previousCracks: JSON.stringify(formattedCrackLengthDataList),
        // reference photo
        referencePhoto: this.stateReferencePhoto.id,
        referenceSection: this.stateReferencePhoto.title,
        isComplete: this.CrackFormData.IsComplete,
        requirement: this.CrackFormData.DefectRequirement
      }
    },
    async updateCrackDetail() {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.id === this.stateDetailId;
      }) as unknown as Detail;
      const detail = this.createCrackDetail();
      const payload = {
        id: this.DetailId,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "detail",
                propertyValue: JSON.stringify(detail),
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
      };
      try {
        this.stateIsError = false;
        const res = await ApiService.post(
          `${UPDATE_DEFECT_DETAIL}`,
          payload as AxiosRequestConfig,
        );
        if (res.data.statusError == 400) {
          this.stateIsError = true;
          return res.data.result.message;
        }
        return "";
      } catch (error: any) {
        sendCustomEvent("fe_event_error_update_crack_detail", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        const message = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        sendErrorEvent('IRONS', error);
        return message;
      }
    },
    async updateCrackFitter(fitter: string, userGroup = "") {
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.id === this.stateDetailId;
      }) as unknown as Detail;
      const detail = this.createCrackDetail();
      const payload = {
        id: this.DetailId,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "detail",
                propertyValue: JSON.stringify(detail),
              },
              {
                propertyName: "updatedBy",
                propertyValue: fitter,
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: JSON.parse(fitter),
        userGroup: ""
      };
      if (userGroup) {
        payload.userGroup = userGroup;
      }
      try {
        this.stateIsError = false;
        const res = await ApiService.post(
          `${UPDATE_DEFECT_DETAIL_FITTER}`,
          payload as AxiosRequestConfig,
        );
        if (userGroup) return;
        const foundHeader = this.ApprovalData.CrackHeaders.find((d) => {
          return d.id === this.stateHeaderId;
        }) as unknown as Header;
        const payloadHeader = {
          id: this.HeaderId,
          updateParams: [
            {
              keyValue: foundHeader.key,
              propertyParams: [
                {
                  propertyName: "workorder",
                  propertyValue: foundHeader.workorder,
                },
                {
                  propertyName: "updatedBy",
                  propertyValue: fitter,
                },
                {
                  propertyName: "updatedDate",
                  propertyValue: "<<ServerDateTime>>",
                },
              ],
            },
          ],
          employee: JSON.parse(fitter),
        };
        try {
          this.stateIsError = false;
          await ApiService.post(
            `${UPDATE_DEFECT_HEADER}`,
            payloadHeader as AxiosRequestConfig,
          );
          return res.data.result.message;
        } catch (error: any) {
          sendCustomEvent("fe_event_error_update_crack_fitter", {
            errorMessage: error,
          });
          updateLoggedInStatusFromAPIResponse(error);
          this.stateIsError = true;
          const message = error.response.data.result.message;
          sendErrorEvent('IRONS', error);
          return message;
        }
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error);
        this.stateIsError = true;
        const message = convertErrorMessage(
          error?.response?.data?.result?.message ?? `${error}`,
        );
        return message;
      }
    },
    async updateCrackAcknowledge() {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === this.stateHeaderId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "status",
                propertyValue: "Acknowledge",
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
              {
                propertyName: "approvedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "approvedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.status = "Acknowledge";
      } catch (error) {
        sendCustomEvent("fe_event_error_acknowledge_crack", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerCrackAcknowledge() {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === this.stateHeaderId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "plannerStatus",
                propertyValue: "Acknowledge",
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.plannerStatus = "Acknowledge";
      } catch (error) {
        sendCustomEvent("fe_event_error_acknowledge_crack_planner", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCrackMO(headerId: string, mo: string) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "defectWorkorder",
                propertyValue: mo,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.defectWorkorder = mo;
      } catch (error) {
        sendCustomEvent("fe_event_error_update_crack_mo", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCrackRepairedStatus(headerId: string, value: string) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
      const payload = {
        id: found.id,
        updateParams: [
          {
            keyValue: found.key,
            propertyParams: [
              {
                propertyName: "repairedStatus",
                propertyValue: value,
              },
              {
                propertyName: "updatedBy",
                propertyValue: JSON.stringify({
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name,
                }),
              },
              {
                propertyName: "updatedDate",
                propertyValue: "<<ServerDateTime>>",
              },
            ],
          },
        ],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name,
        },
        userGroup: this.stateCurrentUserGroup,
      };
      try {
        this.stateIsError = false;
        await ApiService.post(
          `${UPDATE_DEFECT_HEADER}`,
          payload as AxiosRequestConfig,
        );
        found.repairedStatus = value;
      } catch (error) {
        sendCustomEvent("fe_event_error_update_crack_repaired_status", {
          errorMessage: error,
        });
        updateLoggedInStatusFromAPIResponse(error);
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
    },
    async getReferencePhoto(id) {
      const params = {
        id: id,
        ver: "v1",
      };
      try {
        const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/utility/api/master_attachment/download_by_id`;
        const response: AxiosResponse<Blob> = await ApiService.getBlob(
          GET_IMAGE_API_URL,
          "",
          new URLSearchParams(params).toString(),
        );
        const buffer = response.data;
        const blob = new Blob([buffer]);
        const urlCreator = window.URL || window.webkitURL;
        const bmp = await createImageBitmap(blob);
        this.stateReferencePhoto.dimension = {
          height: bmp.height,
          width: bmp.width,
        };
        return urlCreator.createObjectURL(blob);
      } catch (error) {
        sendCustomEvent("fe_event_error_get_crack_reference_photo", {
          errorMessage: error,
        });
        console.log(error);
        sendErrorEvent('IRONS', error);
        return "";
      }
    },
    async setReferencePhoto(title: string, photoId) {
      this.stateReferencePhoto.title = title;
      this.stateReferencePhoto.blob = await this.getReferencePhoto(photoId);
      this.stateReferencePhoto.id = photoId;
    },
    reset() {
      this.stateLoading = false;
      this.stateData = new DefectApprovalClass();
      this.stateDefectFormData = new DefectYesClass();
      this.stateCrackFormData = new CrackYesClass();
      this.stateIsError = false;
      this.stateHeaderId = "";
      this.stateDetailId = "";
      this.stateDefectFetched = false;
      this.stateHeaderStatus = "";
      // this.stateDefectPictures = {}
      this.stateLoadDefectImages = false;
      this.stateReferencePhoto = {
        title: "",
        blob: "",
        id: "",
        dimension: {} as Dimensions,
      };
      this.stateDefectKey = 1;
    },
    updateHeaderDefect(headerId) {
      const header = this.ApprovalData.DefectHeaders.find((h) => {
        return h.id === headerId;
      });
      this.stateHeaderStatus = !isUndefined(header!.plannerStatus)
        ? header!.plannerStatus
        : "";
    },
    updateHeaderGenericDefect(headerId) {
      const header = this.ApprovalData.DefectGenericHeaders.find((h) => {
        return h.id === headerId;
      });
      this.stateHeaderStatus = !isUndefined(header!.plannerStatus)
        ? header!.plannerStatus
        : "";
    },
    updateHeaderDefectSMU(headerId) {
      const header = this.ApprovalData.SMUDefectHeaders.find((h) => {
        return h.id === headerId;
      });
      this.stateHeaderStatus = !isUndefined(header!.plannerStatus)
        ? header!.plannerStatus
        : "";
    },
    updateHeaderCrack(headerId) {
      const header = this.ApprovalData.CrackHeaders.find((h) => {
        return h.id === headerId;
      });
      this.stateHeaderStatus = !isUndefined(header!.plannerStatus)
        ? header!.plannerStatus
        : "";
    },
  },
});
