import { reformatNumberWithComma } from "@/core/helpers/number-format";
import {
  ComponentInterventionGroup
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGroup";
import { Header } from "@/core/types/entities/dma/defects/Header";
import { Item } from "@/core/types/entities/dma/e-form/Item";
import { Task } from "@/core/types/entities/dma/e-form/Task";
import { ListItem } from "@/core/types/entities/dma/e-form/cbm/list";
import { Group } from "@/core/types/entities/dma/e-form/group";
import {
  Dimensions,
  ImageItem,
  LoadedImageBuffer,
  LoadedImageData,
} from "@/core/types/entities/report/history/historical-eform-dma/ImageItem";
import { Audit } from "@/core/types/intervention/Audit";
import { CBMMappingDetail } from "@/core/types/intervention/CBMMapping";
import { IDetailTask } from "@/core/types/intervention/IDetailTask";
import {
  StringWithValidationState
} from "@/core/types/misc/StringWithValidationState";
import { tableToArray } from "@/database/schema/DatabaseWrapper";
import { db } from "@/database/schema/DexieSchema";
import { ValidTokenNew } from "@/database/schema/ValidTokenNew";
import { router } from "@/router/index";
import {
  isUndefined,
  isEqual,
  cloneDeep,
  floor
} from "lodash";
import { blobToWebP } from "webp-converter-browser";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";
import Compressor from "compressorjs";
import { NoNetworkMessages } from "@/store/enums/ErrorMessagesEnum";
import { trimFileName } from "../../iron-lake/media-library/helper";
import { Defect } from "@/database/schema/Defect";

export const checkMinValue = (formula: ListItem | CBMMappingDetail, value) => {
  let checkMin;
  switch (formula.operatorMin) {
    case "=":
      checkMin = Number(value) == formula.minValue;
      break;
    case "<":
      checkMin = Number(value) < formula.minValue;
      break;
    case ">":
      checkMin = Number(value) > formula.minValue;
      break;
    case "<>":
      checkMin = Number(value) >= formula.minValue;
      break;
    case ">=":
      checkMin = Number(value) >= formula.minValue;
      break;
    case "<=":
      checkMin = Number(value) <= formula.minValue;
      break;
  }
  return checkMin;
};

export const checkMaxValue = (formula: ListItem | CBMMappingDetail, value) => {
  let checkMax;
  switch (formula.operatorMax) {
    case "=":
      checkMax = Number(value) == formula.maxValue;
      break;
    case "<":
      checkMax = Number(value) < formula.maxValue;
      break;
    case ">":
      checkMax = Number(value) > formula.maxValue;
      break;
    case "<>":
      checkMax = Number(value) <= formula.maxValue;
      break;
    case ">=":
      checkMax = Number(value) >= formula.maxValue;
      break;
    case "<=":
      checkMax = Number(value) <= formula.maxValue;
      break;
  }
  return checkMax;
};

export const checkRating = (
  checkMin: boolean,
  checkMax: boolean,
  formula: ListItem | CBMMappingDetail,
) => {
  let rating = "";
  const operatorMin = formula.operatorMin;
  const operatorMax = formula.operatorMax;

  // case >= 9 to <= 100 (but we already use <> as agreed operator)
  const betweenCondition = operatorMin == "<>";
  // case > 9 to <= 100
  const betweenMoreThanMinOperator = operatorMin == ">" && operatorMax == "<=";
  // case >= 9 to < 100
  const betweenLessThanMaxOperator = operatorMin == ">=" && operatorMax == "<";
  // case > 9 to < 100
  const betweenMoreThanMinLessThanMaxOperator =
    operatorMin == ">" && operatorMax == "<";

  if (
    betweenCondition ||
    betweenMoreThanMinOperator ||
    betweenLessThanMaxOperator ||
    betweenMoreThanMinLessThanMaxOperator
  ) {
    if (checkMin && checkMax) {
      rating = formula.cbmRating;
    }
  } else {
    if (checkMin || checkMax) {
      rating = formula.cbmRating;
    }
  }
  return rating;
};

export const checkMinValueNew = (formula: CBMMappingDetail, value: string) => {
  let checkMin;
  switch (formula.operatorMin) {
    case "=":
      checkMin = Number(value) == formula.minValue;
      break;
    case "<":
      checkMin = Number(value) < formula.minValue;
      break;
    case ">":
      checkMin = Number(value) > formula.minValue;
      break;
    case "<>":
      checkMin = Number(value) >= formula.minValue;
      break;
    case ">=":
      checkMin = Number(value) >= formula.minValue;
      break;
    case "<=":
      checkMin = Number(value) <= formula.minValue;
      break;
  }
  return checkMin;
};

export const checkMaxValueNew = (formula: CBMMappingDetail, value: string) => {
  let checkMax;
  switch (formula.operatorMax) {
    case "=":
      checkMax = Number(value) == formula.maxValue;
      break;
    case "<":
      checkMax = Number(value) < formula.maxValue;
      break;
    case ">":
      checkMax = Number(value) > formula.maxValue;
      break;
    case "<>":
      checkMax = Number(value) <= formula.maxValue;
      break;
    case ">=":
      checkMax = Number(value) >= formula.maxValue;
      break;
    case "<=":
      checkMax = Number(value) <= formula.maxValue;
      break;
  }
  return checkMax;
};

export const checkRatingNew = (
  checkMin: boolean,
  checkMax: boolean,
  formula: CBMMappingDetail,
) => {
  let rating = "";
  const operatorMin = formula.operatorMin;
  const operatorMax = formula.operatorMax;

  // case >= 9 to <= 100 (but we already use <> as agreed operator)
  const betweenCondition = operatorMin == "<>";
  // case > 9 to <= 100
  const betweenMoreThanMinOperator = operatorMin == ">" && operatorMax == "<=";
  // case >= 9 to < 100
  const betweenLessThanMaxOperator = operatorMin == ">=" && operatorMax == "<";
  // case > 9 to < 100
  const betweenMoreThanMinLessThanMaxOperator =
    operatorMin == ">" && operatorMax == "<";

  if (
    betweenCondition ||
    betweenMoreThanMinOperator ||
    betweenLessThanMaxOperator ||
    betweenMoreThanMinLessThanMaxOperator
  ) {
    if (checkMin && checkMax) {
      rating = formula.cbmRating;
    }
  } else {
    if (checkMin || checkMax) {
      rating = formula.cbmRating;
    }
  }
  return rating;
};

export const statusBadge = (formStatus, progress = -1) => {
  if (formStatus == "Open") {
    return "Yet to Start";
  } else if (formStatus == "On Progress") {
    if (progress >= 0) {
      return `In Progress - ${progress}%`;
    }
    return `In Progress`;
  } else if (formStatus == "Submited" || formStatus == "Close") {
    return "Submitted";
  }
  return "";
};

export const statusBadgeBasedOnMonitoring = (
  formStatus,
  defectStatus = "",
  progres = 0,
) => {
  if (formStatus == "Open") {
    return "Yet to Start";
  } else if (formStatus == "On Progress") {
    return `In Progress - ${progres}%`;
  } else if (formStatus == "Submited") {
    return "Under Review";
  } else if (formStatus == "Close") {
    if (defectStatus == "Approved (SPV)") {
      return "Final Review";
    } else if (defectStatus == "Completed") {
      return "Closed";
    }
  }
  return "";
};

export const statusBadgeColor = (formStatus) => {
  if (formStatus == "Yet to Start") {
    return "gray";
  } else if (formStatus.includes("In Progress")) {
    return "blue";
  } else if (
    formStatus == "Submitted" ||
    formStatus == "Under Review" ||
    formStatus == "Final Review"
  ) {
    return "green";
  }
  return "";
};

export const sortTaskKeys = (array) => {
  const collator = new Intl.Collator([], { numeric: true });
  return array.sort((a, b) => {
    return collator.compare(a, b);
  });
};

export const formatOwnership = (ownership = "") => {
  let color;
  if (ownership) {
    if (ownership && ownership.toLowerCase() == "buma") {
      color = "green";
    } else {
      color = "red";
    }
    return `<span class='ownership ${color}'>${ownership}</span>`;
  }
  return "";
};

export const checkDozer = (model) => {
  if (!model) {
    return false;
  }
  const conditions = ["D11", "D11T", "D10T", "D10T2"];
  const isDozer = conditions.some((el) => {
    return model.includes(el);
  });
  return isDozer;
};

export const checkLIEBHER = (model) => {
  if (!model) {
    return false;
  }
  const conditions = [
    "LIE R9350",
    "LIE R994B",
    "LIE R9800 MTU",
    "LIE R9800 CUM",
  ];
  const isLIEBHER = conditions.some((el) => {
    return model.includes(el);
  });
  return isLIEBHER;
};

export const checkExcavator = (model) => {
  if (!model) {
    return false;
  }
  const conditions = ["EX8000"];
  const isExcavator = conditions.some((el) => {
    return model.includes(el);
  });
  return isExcavator;
};

export const checkTaskEditSameFitter = (
  updateBy: Audit | null | string,
  employee: Audit,
) => {
  let sameFitter = true;
  if (updateBy && updateBy != "" && employee) {
    if (employee.id != (updateBy as Audit).id) {
      sameFitter = false;
    }
    return sameFitter;
  }
  return sameFitter;
};

export const getTitle = (task: Task | IDetailTask) => {
  if (!task) return "";
  if (task.description) {
    if (task.description != "" && task.description.includes(";")) {
      const captions = [] as string[];
      if (task.description.includes("|")) {
        task.description.split("|").forEach((c) => {
          captions.push(c.split("")[2]);
        });
        return captions.join(", ");
      } else if (task.description != "") {
        return task.description;
      }
    }
  }
  if (!task.items) return "";
  return task.items.length < 5
    ? (task.items[1].value as string)
    : (task.items[2].value as string);
};

export const disabledHyperlink = (ref) => {
  const htmlElement = ref as HTMLElement;
  if (htmlElement) {
    try {
      const showPDFArr = Array.from(
        htmlElement.getElementsByClassName("show-pdf"),
      ) as HTMLAnchorElement[];
      showPDFArr.forEach((element) => {
        element.onclick = (event) => {
          event.preventDefault();
        };
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const spvPrintPDFArr = Array.from(
        htmlElement.getElementsByClassName("spv-print-pdf"),
      ) as HTMLAnchorElement[];
      spvPrintPDFArr.forEach((element) => {
        element.onclick = (event) => {
          event.preventDefault();
        };
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export const onlyNumberResult = (string: string): string => {
  return string.replace(/[^0-9.]/g, "");
};

export const onlyNumber = ($event) => {
  const keyCode = $event.keyCode ? $event.keyCode : $event.which;
  // cek if input has .
  if ($event.target.value.includes(".")) {
    if ($event.target.value.split(".").length >= 2 && keyCode == 46) {
      $event.preventDefault();
    }
  }
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
};

export const locationPreviousCrack = (data) => {
  let string = "";
  if (data.locationId) {
    string += `${data.locationId}. `;
    string += `Crack Length - ${data.locationDesc}`;
  } else {
    const locId = data.locationDesc[0].toUpperCase();
    const pos = data.locationDesc.toString().indexOf(".") + 1;
    string =
      locId +
      data.locationDesc.slice(1, pos) +
      " Crack Length - " +
      data.locationDesc.slice(pos);
  }
  return string;
};

export const generateString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isVowel = (char) => {
  return ["a", "e", "i", "o", "u"].includes(char.toLowerCase());
};

// Merge objects based on the common 'id' property
export function mergeObjects(
  obj1: LoadedImageBuffer[],
  obj2: LoadedImageData[],
  key = "id",
): ImageItem[] {
  const merged: ImageItem[] = [];

  obj1.forEach((item1) => {
    const matchingItem2 = obj2.find((item2) => {
      return item1[key] === item2[key];
    });

    if (matchingItem2) {
      const mergedItem = { ...item1, ...matchingItem2 };
      merged.push(mergedItem);
    }
  });

  return merged;
}

export const validationPlannerApprovalPanel = (defectList: Header[]) => {
  const prioritiesNeedAcknowledgePlanner = ["P3", "P4"];

  return defectList.every((defect) => {
    const defectWOFilled =
      defect.defectWorkorder != null &&
      defect.defectWorkorder !== "" &&
      defect.defectWorkorder !== undefined;
    const spvPlannerDecline =
      defect.status === "Decline" || defect.plannerStatus === "Decline";
    const spvAcknowledge = defect.status === "Acknowledge";
    const plannerAcknowledge =
      !isUndefined(defect.plannerStatus) &&
      defect.plannerStatus === "Acknowledge";
    let acknowledge = spvAcknowledge;

    if (prioritiesNeedAcknowledgePlanner.includes(defect.priority)) {
      acknowledge = plannerAcknowledge;
    }
    // If 'decline' is true, return true.
    // Otherwise:
    //    If priority requires planner:
    //       If SPV has already acknowledged, and planner hasn't approved, and WO is filled -> return false.
    //       If SPV has already acknowledged, and planner hasn't approved, and WO is not filled -> return false.
    //       If SPV has already acknowledged, and planner has approved, and WO is not filled -> return false.
    //       If SPV has already acknowledged, and planner has approved, and WO is filled -> return true.
    //    Else (if no planner is needed):
    //       If SPV has already acknowledged and WO is filled -> return true.
    //       If SPV has already acknowledged and WO is not filled -> return false.
    return spvPlannerDecline || (acknowledge && defectWOFilled);
  });
};

export const validationNAApprovalPanel = (
  defectList: Header[],
  isPlanner = false,
) => {
  return defectList.every((defect) => {
    if (isPlanner) {
      // check na get declined by spv / confirmed by planner (otomatis spv udh confirmed)
      return (
        defect.cbmNAStatus === "Decline" ||
        defect.plannerCbmNAStatus === "Confirmed"
      );
    }
    return (
      defect.cbmNAStatus === "Decline" || defect.cbmNAStatus === "Confirmed"
    );
  });
};

export const filterByPriority = (data, priorities) => {
  return data.filter((e) => {
    return priorities.includes(e.priority);
  });
};

export const checkStatus = (data) => {
  return data.every((e) => {
    return (
      e.status === "Decline" ||
      e.status === "Acknowledge" ||
      e.plannerStatus === "Decline" ||
      e.plannerStatus === "Acknowledge"
    );
  });
};

export function findIndexAndObject<T>(
  array: T[],
  criterion: (element: T) => boolean,
): { index: number; object: T } | null {
  let foundObject: { index: number; object: T } | null = null;

  array.every((element, index) => {
    if (criterion(element)) {
      foundObject = { index, object: element };
      return false; // Stop the loop when a match is found
    }
    return true; // Continue the loop
  });

  return foundObject;
}

export const onlyIntegerInput = ($event) => {
  const keyCode = $event.keyCode ? $event.keyCode : $event.which;
  if (keyCode < 48 || keyCode > 57) {
    $event.preventDefault();
  }
};

export const detailInfoClass = (
  headerId: string,
  headers: Header[],
  isSupervisor: boolean,
  keySupervisorStatus = "status",
  keyPlannerStatus = "plannerStatus",
  isMonitoringPage = false,
  defectStatus = "",
) => {
  let cssClass = "light-yellow color-dark-yellow";
  const header = headers?.find((h) => {
    return h.id === headerId;
  });

  if (!header) {
    return cssClass;
  }

  // Check if keySupervisorStatus is a valid property of Header
  if (!(keySupervisorStatus in header)) {
    return cssClass;
  }
  if (isMonitoringPage) {
    if (defectStatus == "Approved (SPV)") {
      cssClass = header[keyPlannerStatus] ? "light-green color-dark-green" : "light-yellow color-dark-yellow";
    } else {
      cssClass = [
        "Not-Confirm",
        "Submited"
      ].includes(header[keySupervisorStatus]) ? "light-yellow color-dark-yellow" : "light-green color-dark-green";
    }
    return cssClass;
  }

  // Check if keyPlannerStatus is a valid property of Header
  if (!isSupervisor && !(keyPlannerStatus in header)) {
    return cssClass;
  }
  if (isSupervisor) {
    switch (header[keySupervisorStatus]) {
      case "Not-Confirm" || "Submited":
        cssClass = "light-yellow color-dark-yellow";
        break;
      case "Confirmed" || "Acknowledge":
        cssClass = "light-green color-dark-green";
        break;
    }
  } else if (!isSupervisor && header[keyPlannerStatus]) {
    cssClass = "light-green color-dark-green";
  }

  return cssClass;
};

export const detailInfoClassIntervention = (
  headerId: string,
  headers: Defect[],
  keySupervisorStatus = "status",
  keyPlannerStatus = "plannerStatus",
  defectStatus = "",
) => {
  let cssClass = "light-yellow color-dark-yellow";
  const header = headers?.find((h) => {
    return h.id === headerId;
  });

  if (!header) {
    return cssClass;
  }

  if (defectStatus == "Approved (SPV)") {
    cssClass = header[keyPlannerStatus] ? "light-green color-dark-green" : "light-yellow color-dark-yellow";
  } else {
    cssClass = [
      "Not-Confirm",
      "Submited"
    ].includes(header[keySupervisorStatus]) ? "light-yellow color-dark-yellow" : "light-green color-dark-green";
  }
  return cssClass;
};


function areArraysEqualExcludingKeys<T>(
  arr1: T[],
  arr2: T[],
  keysToExclude: string[],
) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((obj1, index) => {
    const obj2 = arr2[index];
    const filteredKeys = Object.keys(obj1 as unknown as Array<keyof T>).filter(
      (key) => {
        return !keysToExclude.some((keyword) => {
          return key.toLowerCase().includes(keyword);
        });
      },
    );

    return filteredKeys.every((key) => {
      if (key == "totalHours") {
        return isEqual(parseFloat(obj1[key]), parseFloat(obj2[key]));
      }
      return isEqual(obj1[key], obj2[key]);
    });
  });
}

export function hasDefectDataChanged<T>(
  watchedFields: string[],
  beforeEditedData: T,
  afterEditedData: T,
): boolean {
  let edited = false;
  const excludeKey = ["error", "valid", "message"];
  if (beforeEditedData && afterEditedData) {
    for (const field of watchedFields) {
      if (field == "labours") {
        // afterEditedData.labours.position is empty -> filled it with beforeEditedData.labour.position (have default value)
        if (
          afterEditedData[field].length == 1 &&
          afterEditedData[field][0].position == ""
        ) {
          afterEditedData[field][0].position =
            beforeEditedData[field][0].position;
        }
      }
      if (
        Array.isArray(beforeEditedData[field]) &&
        Array.isArray(afterEditedData[field])
      ) {
        if (
          !areArraysEqualExcludingKeys(
            beforeEditedData[field] as unknown as T[],
            afterEditedData[field] as unknown as T[],
            excludeKey,
          )
        ) {
          edited = true;
          break;
        }
      } else if (typeof beforeEditedData[field] === "string") {
        if (!isEqual(beforeEditedData[field], afterEditedData[field])) {
          edited = true;
          break;
        }
      }
    }
  }
  return edited;
}

export function calculateProportionalDimensions(
  originalWidth: number,
  originalHeight: number,
  newWidth: number,
): Dimensions {
  const aspectRatio = originalHeight / originalWidth;
  const newHeight = Math.round(aspectRatio * newWidth);

  return {
    width: newWidth,
    height: newHeight,
  };
}

export const convertCalibrationTask = (tasks: Task[]) => {
  const convertedData = cloneDeep(tasks);
  convertedData.forEach((task) => {
    if (task.items[3]?.valueItemType != "comment") {
      task.items.splice(3, 0, {} as Item);
    }
  });
  return convertedData;
};

export const sortTaskDesc = (a, b) => {
  const [aNumber, aSubNumber, aDesc] = a.taskDesc.split(";");
  const [bNumber, bSubNumber, bDesc] = b.taskDesc.split(";");

  // Compare the main number
  if (aNumber !== bNumber) {
    return aNumber - bNumber;
  }

  // Compare sub number
  if (aSubNumber !== bSubNumber) {
    return aSubNumber.localeCompare(bSubNumber);
  }

  // Compare the description
  return aDesc.localeCompare(bDesc);
};

export const markOtherDuplicates = (
  arr: StringWithValidationState[],
  string = "",
) => {
  const countMap = new Map();
  const newArr = [] as StringWithValidationState[];

  for (const obj of arr) {
    if (!countMap.has(obj.value)) {
      countMap.set(obj.value, 1);
    } else {
      countMap.set(obj.value, countMap.get(obj.value) + 1);
    }
  }

  for (const obj of arr) {
    const newObj = { ...obj };
    if (countMap.get(obj.value) > 1 && obj.value !== "") {
      newObj.isValid = false;
      newObj.errorMessage = `Duplicate${string == "" ? "" : ` ${string}`}`;
    }
    newArr.push(newObj);
  }

  return newArr;
};

export const checkTokenExist = async () => {
  const token = (await tableToArray(db, "validTokenNew")) as ValidTokenNew[];
  if (token.length < 1) {
    router.push({ name: "signindma" });
  }
};
export interface ConversionResult {
  file: File;
}

export async function convertToWebP(
  blob: Blob | File,
  quality = 1,
): Promise<ConversionResult> {
  let qualityParameter = 0.1;
  try {
    const bpm = await createImageBitmap(blob);
    let webpBlob = await blobToWebP(blob, {
      quality: quality,
      height: bpm.height,
      width: bpm.width,
    });

    let fileSizeInMB = webpBlob.size / (1024 * 1024); // Convert bytes to MB

    while (fileSizeInMB > 2) {
      if (quality <= qualityParameter) {
        qualityParameter /= 10;
      }
      quality = Math.max(qualityParameter, quality - qualityParameter);

      webpBlob = await blobToWebP(blob, {
        quality: quality,
        height: bpm.height,
        width: bpm.width,
      });

      fileSizeInMB = webpBlob.size / (1024 * 1024); // Recalculate size
    }

    const fileName =
      blob instanceof File ? trimFileName(blob).name : `${Date.now()}.webp`;
    const convertedFile = new File([webpBlob], fileName, {
      type: "image/webp",
    });

    return { file: convertedFile };
  } catch (error) {
    throw new Error("Error converting to WebP");
  }
}

export const getPercentageTaskProgressAllTab = (
  groups: Group[] | ComponentInterventionGroup[],
) => {
  let totalTask = 0;
  let totalDoneTask = 0;
  groups.forEach((val) => {
    if (val.groupName != "DEFECT_IDENTIFIED_SERVICE") {
      totalDoneTask = totalDoneTask + val.doneTask;
      totalTask = totalTask + val.totalTask;
    }
  });
  if (totalTask == 0) {
    return 100;
  }
  return floor((totalDoneTask / totalTask) * 100);
};

export const checkIsSMUOnRange = (params: {
  smu: string | number;
  hmOffset: string | number;
  range: {
    min: string | number;
    max: string | number;
  };
}) => {
  const { smu, hmOffset, range } = params;
  const val = reformatNumberWithComma(smu);
  const minRange = Number(val) + Number(hmOffset) >= Number(range.min);
  const maxRange = Number(val) + Number(hmOffset) <= Number(range.max);
  if (val != "" && minRange && maxRange) {
    return true;
  } else {
    return false;
  }
};

export const isPlanner = () => {
  const authStore = useAuthenticationStore();
  return authStore.user.isPlanner == 1;
};

export const compressImageToTargetSize = (
  imageFile: File,
  targetSize: number,
): Promise<File> => {
  let currentQuality = 1; // Initial quality
  let currentSize = imageFile.size;

  const compressAgain = (file) => {
    currentQuality -= 0.1;
    return new Promise((resolve, reject) => {
      // compress js
      new Compressor(file, {
        quality: currentQuality,
        success(result) {
          currentSize = result.size;
          if (currentSize > targetSize) {
            // If compressed size still exceeds target, compress again
            resolve(compressAgain(result));
          } else {
            // If compressed size is within target, resolve with result
            resolve(result);
          }
        },
        error(err) {
          console.error("Image compression error:", err);
          reject(err);
        },
      });
    });
  };

  return new Promise((resolve, reject) => {
    if (currentSize <= targetSize) {
      // If the original file size is already within the target, resolve with the original file
      resolve(imageFile);
    } else {
      compressAgain(imageFile)
        .then((result) => {
          return resolve(result as File);
        })
        .catch((error) => {
          return reject(error);
        });
    }
  });
};

export const convertErrorMessage = (errorMessageString: string) => {
  if (errorMessageString == NoNetworkMessages.NO_NETWORK) {
    return NoNetworkMessages.NO_NETWORK_VIEW;
  }
  return errorMessageString;
};
