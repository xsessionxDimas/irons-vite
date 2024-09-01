import DefectYesClass from "@/core/classes/DefectYesClass";
import { Defect } from "../types/Defect";
import { ImageObject } from "@/core/types/entities/dma/ImageObject"
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import { useAttachmentStore } from "../attachments/useAttachmentStore";
import CrackYesClass from "@/core/classes/CrackYesClass";

export const safelyParseJSON = (jsonString: string | undefined) => {
  try {
    return jsonString ? JSON.parse(jsonString) : [];
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return [];
  }
};

export const assignDefectDetail = (detail: Defect): [DefectYesClass, boolean] => {
  const result = new DefectYesClass();
  result.setAssetNumber(detail.assetNumber);
  result.setPriority(detail.priority);
  result.setRaisedBy(detail.raisedBy);
  result.setDate(detail.date);
  result.setTitle(detail.title);
  result.setDescription(detail.description);
  result.importParts(...safelyParseJSON(detail.parts));
  result.importLabours(...safelyParseJSON(detail.labours));
  result.importResources(...safelyParseJSON(detail.resources));
  result.importSymptoms(...safelyParseJSON(detail.symptoms));
  result.importCauses(...safelyParseJSON(detail.causes));
  result.setPlannedDuration(detail.plannedDuration ?? '');
  result.setInstruction(detail.instruction as string);
  result.setDefectRequirement(detail.requirement as string);
  result.setIsComplete(detail.isComplete ?? false);
  if (detail.type === "NO" && detail.actions) {
    const actions = safelyParseJSON(detail.actions) as string[];
    result.setInstruction(actions.join("\n"));
  }
  const type = detail.type === "YES"
  return [result, type]
}

export const assignCrackDetail = (detail): [CrackYesClass, boolean] => {
  const result = new CrackYesClass();
  result.setAssetNumber(detail.assetNumber);
  result.setPriority(detail.priority);
  result.setRaisedBy(detail.raisedBy);
  result.setDate(detail.date);
  result.setTitle(detail.title);
  result.setDescription(detail.description);
  result.importParts(...safelyParseJSON(detail.parts));
  result.importLabours(...safelyParseJSON(detail.labours));
  result.importResources(...safelyParseJSON(detail.resources));
  result.importSymptoms(...safelyParseJSON(detail.symptoms));
  result.importCauses(...safelyParseJSON(detail.causes));
  result.importPreviousCrack(...safelyParseJSON(detail.previousCracks));
  result.setPlannedDuration(detail.plannedDuration ?? '');
  result.setInstruction(detail.instruction as string);
  result.setDefectRequirement(detail.requirement as string);
  result.setIsComplete(detail.isComplete ?? false);
  if (detail.type === "NO" && detail.actions) {
    const actions = safelyParseJSON(detail.actions) as string[];
    result.setInstruction(actions.join("\n"));
  }
  const type = detail.type === "YES"
  return [result, type]
}

export const downloadImageAttachments = async (stringImages: string, callback: ((...args: []) => void) | undefined): Promise<ImageObject> => {
  const result: ImageObject = {
    Id: 'defect',
    ImageInfos: [],
    ImageBlobs: []
  }
  const attachmentStore = useAttachmentStore()
  result.ImageInfos.push(...safelyParseJSON(stringImages))
  if (result.ImageInfos.length === 0) {
    return result
  }
  const promises = [] as Promise<Blob>[]
  result.ImageInfos.forEach((info: string | ImageInfo) => {
    const filename = typeof info === 'string' ? info : info.filename;
    promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>)
  })
  Promise.all(promises).then((blobs) => {
    blobs.forEach((b) => {
      const blob = new Blob([b], { type: 'image/png' })
      result.ImageBlobs.push(blob)
    })
    if (callback) {
      callback()
    }
  })
  return result
}
