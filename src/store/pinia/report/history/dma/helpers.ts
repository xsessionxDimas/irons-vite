import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import {
  useGeneralFormStore
} from '@/store/pinia/dma/e-form/useGeneralFormStore'
import { getUTCOffsetDate } from "@/core/helpers/date-format"
import { UserInfo } from "@/database/schema/UserInfo"
import {
  CrackYesDetail,
  CrackYesDetailRaw,
  DefectYesDetail,
  DefectYesDetailRaw,
  ReferencePhoto
} from "@/core/types/entities/dma/e-form/defects/DefectCrackYesDetail"
import {
  ApprovalData
} from "@/core/types/entities/dma/e-form/defects/ApprovalData";
import {
  useHistoricalEformDmaStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaStore';
import { isEmpty } from "lodash"
import { Header } from "@/core/types/entities/dma/defects/Header"
import {
  DownloadHistory
} from "@/core/types/entities/dma/defects/DownloadHistory"
import { StatusHistory } from "@/core/types/intervention/StatusHistory"

export const getTimeStampPDF = (): string => {
  const authStore = useAuthenticationStore()
  const generalStore = useGeneralFormStore()

  const loggedInUser = authStore.user.Name
  const timeServer = getUTCOffsetDate(generalStore.stateTimeZone)
  return `${loggedInUser}, at ${timeServer} (${generalStore.stateTimeZoneDesc})`
}

export const userLogin = (): UserInfo => {
  const authStore = useAuthenticationStore()
  return authStore.user
}

export const parseJson = (obj: DefectYesDetailRaw | CrackYesDetailRaw, keysToParse: string[]): DefectYesDetail | CrackYesDetail => {
  for (const key in obj) {
    if (keysToParse.includes(key)) {
      try {
        obj[key] = JSON.parse(obj[key]);
      } catch (e) {
        console.log(e);
      }
    }
  }

  return obj
}

const filenamePDFFormat = (data, dataFinalDescription = "") => {
  const historicalEformStore = useHistoricalEformDmaStore()
  if (historicalEformStore.IsIntervention) {
    const titleForm = data.form ?? ""
    const defectWorkorder = data.header.defectWorkorder ? ` WO ${data.header.defectWorkorder}` : "";
    historicalEformStore.setFileName(`${titleForm}${defectWorkorder}`) // If WO exist, print WO
  } else {
    const taskDesc = data.taskDesc ?? data.header.taskDesc
    const finalDescription = (() => {
      if (data.generic) {
        const taskDescSliced = taskDesc.length <= 20 ? taskDesc : taskDesc.slice(0, 20);
        return taskDescSliced
      } else {
        const taskDescFinal = taskDesc.includes(";") ? taskDesc.split(";")[2] : taskDesc;
        const taskDescSliced = taskDescFinal.slice(0, 20);
        return taskDescSliced
      }
    })()
    const descriptionSliced = dataFinalDescription.length <= 20 ? dataFinalDescription : dataFinalDescription.slice(0, 20);
    const defectWorkorder = data.header.defectWorkorder ? ` ${data.header.defectWorkorder}` : "";
    historicalEformStore.setFileName(`${data.unitNumber} ${finalDescription} ${descriptionSliced}${defectWorkorder}`) // If WO exist, print WO
  }
}

export const prepareDownloadableData = (data: {
  header: Header,
  detail: DefectYesDetailRaw | CrackYesDetailRaw,
  referencePhoto?: ReferencePhoto,
  serialNumber: string,
  approvalData: Pick<ApprovalData, 'approvedBy' | 'approvedDate'>,
  ownership: string,
  unitNumber: string,
  taskDesc?: string,
  form?: string,
  generic?: boolean
}): boolean => {
  try {
    const historicalEformStore = useHistoricalEformDmaStore()
    // reference photo
    if ('referencePhoto' in data.detail && data.referencePhoto && !isEmpty(data.referencePhoto)) {
      historicalEformStore.setReferencePhoto(data.referencePhoto)
    }

    // parsing
    const keysToParse = [
      "parts",
      "labours",
      "resources",
      "symptoms",
      "causes",
      "images",
    ];
    if ('previousCracks' in data.detail) {
      keysToParse.push("previousCracks")
    }
    const dataFinal = parseJson(data.detail, keysToParse)

    // set data to download
    historicalEformStore.setDefectDetailDownload(dataFinal)
    // add additional data
    historicalEformStore.setSerialNumber(data.serialNumber)
    historicalEformStore.setOwnerShip(data.ownership)
    historicalEformStore.setApprovalDefectDownload({
      approvedBy: data.header.approvedBy,
      approvedDate: data.header.approvedDate
    })
    historicalEformStore.setTimeStamp(getTimeStampPDF())

    // filename
    filenamePDFFormat(data, dataFinal.description)

    return true
  } catch (error) {
    return false
  }
}

export const checkDownloadStatus = (downloadHistoryList: DownloadHistory[]): boolean => {
  const authStore = useAuthenticationStore()
  if (downloadHistoryList.length > 0) {
    const findDownloadHistory = downloadHistoryList.find((e) => {
      return e.downloadBy.id == authStore.user.EmployeeId
    })
    if (findDownloadHistory) return true
  }
  return false
}

type InterventionData = {
  sampleStatus: string;
  equipment: string;
  sapWorkOrder: string;
};

export const titlePdfIntervention = (data: InterventionData): string => {
  return `${data.sampleStatus} Intervention ${data.equipment} ${data.sapWorkOrder}`
}


type Status = "Submited" | "Close" | "Approved (SPV)" | "Completed";
export const getStatusInfo = (
  statusHistory: StatusHistory[],
  targetStatus: Status | Status[]
): { name: string; date: string } => {
  const status = statusHistory.find((status) => {
    if (Array.isArray(targetStatus)) {
      return targetStatus.includes(status.status as Status);
    } else {
      return status.status === targetStatus;
    }
  });
  return {
    name: status?.updatedBy?.name ?? "",
    date: status?.updatedDate ?? ""
  };
};

