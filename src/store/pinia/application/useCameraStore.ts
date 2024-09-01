import {
  stringToImageInfoConvert
} from "@/core/helpers/string-to-imageinfo-converter";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import { ImageObject } from "@/core/types/entities/dma/ImageObject";
import { defineStore } from "pinia";

export const useCameraStore = defineStore({
  id: "camera",
  state: () => {
    return {
      stateIsVisible: false,
      stateImageObjects: [] as Array<ImageObject>,
      stateCurrentObject: {} as ImageObject,
      stateShowCloseButton: true,
      stateIsCameraError: false,
      stateImage: '',
      stateBlob: undefined as Blob | undefined,
      stateIsActionFromDelete: false,
      stateIsReplacement: false,
      stateReplacementTool: '',
      stateReplacementPhotoLength: 0,
      stateReplacementPosition: 'cab side'
    }
  },
  getters: {
    isVisible: (state) => {
      return state.stateIsVisible;
    },
    currentImage: (state) => {
      return state.stateImage
    },
    currentBlob: (state) => {
      return state.stateBlob
    },
    ImageObjects: (state) => {
      return state.stateImageObjects;
    },
    Current: (state) => {
      return state.stateCurrentObject;
    },
    ShowCloseButton: (state) => {
      return state.stateShowCloseButton
    },
    IsFromActionDelete: (state) => {
      return state.stateIsActionFromDelete
    },
    isReplacementCamera: (state) => {
      return state.stateIsReplacement;
    },
    replacementTool: (state) => {
      return state.stateReplacementTool;
    },
    replacementPhotoLength: (state) => {
      return state.stateReplacementPhotoLength;
    },
    replacementPosition: (state) => {
      return state.stateReplacementPosition
    }
  },
  actions: {
    setImage(src: string) {
      this.stateImage = src
    },
    setBlob(blob: Blob | undefined) {
      this.stateBlob = blob
    },
    resetImage() {
      this.stateImage = 's'
    },
    setIsCameraError(status) {
      this.stateIsCameraError = status
    },
    setShowCloseButton(status: boolean) {
      this.stateShowCloseButton = status
    },
    setCurrent(id: string) {
      const exists = this.stateImageObjects.find((i) => {
        return i.Id === id;
      });
      if (!exists) {
        this.stateImageObjects.push({
          Id: id,
          ImageInfos: [] as string[],
          ImageBlobs: [] as Blob[]
        });
      }
      this.stateCurrentObject = this.stateImageObjects.find((i) => {
        return i.Id === id;
      }) as ImageObject;
    },
    setIsActionFromDelete(status: boolean) {
      this.stateIsActionFromDelete = status
    },
    toggleIsVisible(value: boolean, id: string | null = null) {
      if (id) {
        this.setCurrent(id);
      }
      if (value) {
        this.stateIsCameraError = false
      }
      this.stateIsVisible = value;
    },
    setUploadedFiles(files: ImageInfo[], blobs: Blob[], id: string | null = null) {
      if (id) {
        this.setCurrent(id);
      }
      this.stateCurrentObject.ImageInfos = stringToImageInfoConvert(this.stateCurrentObject.ImageInfos)
      this.stateCurrentObject.ImageInfos = this.stateCurrentObject.ImageInfos.concat(files);
      this.stateCurrentObject.ImageBlobs = this.stateCurrentObject.ImageBlobs.concat(blobs);
    },
    setIsReplacementCamera(value) {
      this.stateIsReplacement = value
    },
    setReplacementTool(value: string) {
      this.stateReplacementTool = value
    },
    setReplacementPhotoLength(value) {
      this.stateReplacementPhotoLength = value
    },
    setReplacementPosition(value) {
      this.stateReplacementPosition = value
    },
    addPhoto(blob: Blob, image: ImageInfo) {
      this.stateCurrentObject.ImageInfos = stringToImageInfoConvert(this.stateCurrentObject.ImageInfos)
      this.stateCurrentObject.ImageBlobs.push(blob);
      this.stateCurrentObject.ImageInfos.push(image);
    },
    definePhoto(blob: Blob, image: ImageInfo) {
      this.stateCurrentObject.ImageInfos = stringToImageInfoConvert(this.stateCurrentObject.ImageInfos)
      this.stateCurrentObject.ImageBlobs = [blob];
      this.stateCurrentObject.ImageInfos = [image];
    },
    clearCurrent() {
      this.stateCurrentObject.ImageBlobs = [];
      this.stateCurrentObject.ImageInfos = [];
    },
    clearImageById(id) {
      const selectedImage = this.stateImageObjects.find((i) => {
        return i.Id === id
      })
      if (!selectedImage) {
        return
      }
      selectedImage.ImageBlobs = []
      selectedImage.ImageInfos = []
    },
    reset() {
      this.stateIsVisible = false;
      this.stateImageObjects = [];
      this.stateCurrentObject = {} as ImageObject
      this.stateIsActionFromDelete = false
    }
  }
});
