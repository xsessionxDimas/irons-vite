import {
  ListItem
} from "@/core/types/entities/iron-lake/media-library/ListItem"
import { saveAs } from "file-saver";

export const getType = (fileType: string) => {
  const images = ['jpg', 'jpeg', 'png', 'webp']
  const documents = ['pdf']

  if (images.includes(fileType.toLowerCase())) {
    return `Image`
  } else if (documents.includes(fileType.toLowerCase())) {
    return `Document`
  }
  return null
}
export const getTypeForDownload = (fileType: string) => {
  const images = ['jpg', 'jpeg', 'png', 'webp']
  const documents = ['pdf']

  if (images.includes(fileType.toLowerCase())) {
    return `Image`
  } else if (documents.includes(fileType.toLowerCase())) {
    return `Application`
  }
  return null
}
export const convertToMimeType = (fileType: string, forDownload = false) => {
  const type = fileType.toLowerCase()
  const fileCategory = forDownload ? getTypeForDownload(type) : getType(type)

  if (fileCategory) {
    return `${fileCategory} / ${type.toUpperCase()}`
  }
  return fileType.toUpperCase()
}
export const getFileExtensionFromMimeType = (mimeType: string) => {
  const parts = mimeType.split("/");
  if (parts.length === 2) {
    return parts[1];
  }
  return mimeType;
}
export const removeItemFromArray = (array: ListItem[], predicate: (item: ListItem) => boolean) : ListItem[] => {
  const index = array.findIndex(predicate);
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array
}

// to prevent https://stackoverflow.com/questions/53560991/automatic-file-downloads-limited-to-10-files-on-chrome-browser
export async function saveWithDelay(data, type, fileName, delayMs = 1000) {
  return new Promise((resolve) => {
    // default delay 1000ms -> 1 second
    setTimeout(async () => {
      await saveAs(new Blob([data], { type: type }), fileName);
      resolve(null);
    }, delayMs);
  });
}

export const getFileType = (file: File & { path: string }) => {
  // Get the file extension from the path
  const fileExtensionFromPath = file.path?.split('.').pop()?.toLowerCase() || '';
  // Get the file extension from the MIME type
  const fileExtensionFromType = getFileExtensionFromMimeType(file.type);
  // Compare and decide which one to use
  const fileExtension = fileExtensionFromType === fileExtensionFromPath ? fileExtensionFromType : fileExtensionFromPath;
  return fileExtension
}

export function validateNumberInput(value) {
  return value.replace(/[^\d]/g, ''); // Remove any non-digit characters
}

export const trimFileName = (file: File): File => {
  const maxLength = 100;
  const { name, type, lastModified } = file;
  const extension = name.split('.').pop() || '';
  let trimmedBaseName = name.replace(`.${extension}`, '');

  if (trimmedBaseName.length > maxLength) {
    trimmedBaseName = trimmedBaseName.substring(0, maxLength);
  }

  if (!trimmedBaseName) {
    trimmedBaseName = `${Date.now()}`;
  }

  let trimmedExtension = extension;
  if (type.startsWith('image/')) {
    trimmedExtension = 'webp';
  } else if (type === 'application/pdf') {
    trimmedExtension = 'pdf';
  }

  const trimmedFileName = `${trimmedBaseName}.${trimmedExtension}`;
  return new File([file], trimmedFileName, { type, lastModified });
};
