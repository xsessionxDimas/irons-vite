import { ImageObject } from '@/core/types/intervention/ImageObject';
import { defineStore } from 'pinia'

export const useNewCameraStore = defineStore({
  id: 'cameraStore',
  state: () => {
    return {
      stateIsVisible: false,
      stateCurrentType: '',
      stateImageObjects: {} as ImageObject,
      stateShowCloseButton: true,
      stateIsCameraError: false
    }
  },
  getters: {
    IsVisible: (state) => {
      return state.stateIsVisible
    },
    ImageObjects: (state) => {
      return state.stateImageObjects
    },
    CurrentType: (state) => {
      return state.stateCurrentType
    }
  },
  actions: {
    setIsCameraError(status) {
      this.stateIsCameraError = status
    },
    setCameraVisible(value: boolean) {
      this.stateIsVisible = value
    },
    setCurrentType(type: string) {
      this.stateCurrentType = type
    },
    setShowCloseButton(status: boolean) {
      this.stateShowCloseButton = status
    }
  }
})
