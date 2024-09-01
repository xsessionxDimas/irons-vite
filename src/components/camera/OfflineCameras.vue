<template>
  <el-dialog
    v-model="cameraStore.stateIsVisible"
    fullscreen
    custom-class="outer-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-text="Opening Camera"
      element-loading-background="rgba(0, 0, 0, 0.7)"
      class="d-flex w-100"
      style="position: fixed; top: 0; left: 0; z-index: 11; width: 100%; height: 100%; background: rgba(22, 28, 36, 1);"
    >
      <camera
        v-if="cameraStore.isVisible && !iscameraPreviewing"
        ref="cam"
        autoplay
        @loading="loading"
        @started="started"
        @camera-change="changeCamera"
        @error="error"
      >
        <template v-if="isCameraReady">
          <div
            class="d-flex flex-column justify-content-center align-items-end camera-container"
            style="height: 100%"
          >
            <div v-if="isTimerShown && cameraTimeLeft != 0" class="h-100 text-center d-flex align-items-center justify-content-center timer-container">
              <h1 class="timer-label">{{ cameraTimeLeft }}</h1>
            </div>
            <!-- camera timer cancel button -->
            <div v-if="isTimerStillCounting" class="d-flex flex-column justify-content-center align-items-center camera-tools-container" style="position: relative;">
              <CameraCircleButton @click="handleResetTimer()">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24.4 7.61334C23.88 7.09334 23.04 7.09334 22.52 7.61334L16 14.12L9.48 7.60001C8.96 7.08001 8.12 7.08001 7.6 7.60001C7.08 8.12001 7.08 8.96001 7.6 9.48001L14.12 16L7.6 22.52C7.08 23.04 7.08 23.88 7.6 24.4C8.12 24.92 8.96 24.92 9.48 24.4L16 17.88L22.52 24.4C23.04 24.92 23.88 24.92 24.4 24.4C24.92 23.88 24.92 23.04 24.4 22.52L17.88 16L24.4 9.48001C24.9067 8.97334 24.9067 8.12001 24.4 7.61334Z"
                    fill="white"
                  />
                </svg>
              </CameraCircleButton>
            </div>
            <div
              v-else class="d-flex flex-column justify-content-center align-items-center camera-tools-container" style="position: relative;"
            >
              <template v-if="showCloseButton">
                <div
                  class="d-flex flex-column align-items-center gap-4"
                  style="margin-bottom: 80px;"
                  @click.prevent="closeCamera(true)"
                >
                  <div class="button-ring">
                    <section
                      class="rounded-circle d-flex justify-content-center align-items-center close-camera"
                      style="
                        width: 100%;
                        height: 100%;
                      "
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24.4 7.61334C23.88 7.09334 23.04 7.09334 22.52 7.61334L16 14.12L9.48 7.60001C8.96 7.08001 8.12 7.08001 7.6 7.60001C7.08 8.12001 7.08 8.96001 7.6 9.48001L14.12 16L7.6 22.52C7.08 23.04 7.08 23.88 7.6 24.4C8.12 24.92 8.96 24.92 9.48 24.4L16 17.88L22.52 24.4C23.04 24.92 23.88 24.92 24.4 24.4C24.92 23.88 24.92 23.04 24.4 22.52L17.88 16L24.4 9.48001C24.9067 8.97334 24.9067 8.12001 24.4 7.61334Z"
                          fill="white"
                        />
                      </svg>
                    </section>
                  </div>
                </div>
              </template>
              <div
                class="d-flex flex-column align-items-center gap-4"
                @click.prevent="snapshot"
              >
                <div class="button-ring">
                  <section
                    class="rounded-circle d-flex justify-content-center align-items-center tools-camera"
                    style="
                      background: rgba(255, 72, 66, 1);
                      width: 100%;
                      height: 100%;
                    "
                  >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.6667 6.66667H22.44L20 4H12L9.56 6.66667H5.33333C3.86667 6.66667 2.66667 7.86667 2.66667 9.33333V25.3333C2.66667 26.8 3.86667 28 5.33333 28H26.6667C28.1333 28 29.3333 26.8 29.3333 25.3333V9.33333C29.3333 7.86667 28.1333 6.66667 26.6667 6.66667ZM26.6667 25.3333H5.33333V9.33333H10.7333L13.1733 6.66667H18.8267L21.2667 9.33333H26.6667V25.3333ZM16 10.6667C12.32 10.6667 9.33333 13.6533 9.33333 17.3333C9.33333 21.0133 12.32 24 16 24C19.68 24 22.6667 21.0133 22.6667 17.3333C22.6667 13.6533 19.68 10.6667 16 10.6667ZM16 21.3333C13.8 21.3333 12 19.5333 12 17.3333C12 15.1333 13.8 13.3333 16 13.3333C18.2 13.3333 20 15.1333 20 17.3333C20 19.5333 18.2 21.3333 16 21.3333Z" fill="white"/>
                  </svg>
                  </section>
                </div>
              </div>
              <div
                class="d-flex flex-column align-items-center gap-4"
                @click.prevent="uploadFromGallery"
              >
                <div class="button-ring">
                  <section
                    class="rounded-circle d-flex justify-content-center align-items-center tools-camera"
                    style="
                      width: 100%;
                      height: 100%;
                    "
                  >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M29.3333 21.3334V5.33335C29.3333 3.86669 28.1333 2.66669 26.6667 2.66669H10.6667C9.2 2.66669 8 3.86669 8 5.33335V21.3334C8 22.8 9.2 24 10.6667 24H26.6667C28.1333 24 29.3333 22.8 29.3333 21.3334ZM15.2 16.7067L17.3733 19.6134L20.8133 15.32C21.08 14.9867 21.5867 14.9867 21.8533 15.32L25.8 20.2534C26.1467 20.6934 25.84 21.3334 25.28 21.3334H12C11.4533 21.3334 11.1333 20.7067 11.4667 20.2667L14.1333 16.7067C14.4 16.36 14.9333 16.36 15.2 16.7067ZM2.66667 9.33335V26.6667C2.66667 28.1334 3.86667 29.3334 5.33333 29.3334H22.6667C23.4 29.3334 24 28.7334 24 28C24 27.2667 23.4 26.6667 22.6667 26.6667H6.66667C5.93333 26.6667 5.33333 26.0667 5.33333 25.3334V9.33335C5.33333 8.60002 4.73333 8.00002 4 8.00002C3.26667 8.00002 2.66667 8.60002 2.66667 9.33335Z" fill="white"/>
                  </svg>
                  </section>
                </div>
              </div>
              <div
                class="d-flex flex-column align-items-center gap-4"
                @click.prevent="clickCameraButtonHandler"
              >
                <div class="button-ring">
                  <section
                    class="rounded-circle d-flex justify-content-center align-items-center tools-camera"
                    style="
                      width: 100%;
                      height: 100%;
                    "
                  >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.6667 6.66667H22.44L20.7867 4.86667C20.2933 4.32 19.5733 4 18.8267 4H13.1733C12.4267 4 11.7067 4.32 11.2 4.86667L9.56 6.66667H5.33333C3.86667 6.66667 2.66667 7.86667 2.66667 9.33333V25.3333C2.66667 26.8 3.86667 28 5.33333 28H26.6667C28.1333 28 29.3333 26.8 29.3333 25.3333V9.33333C29.3333 7.86667 28.1333 6.66667 26.6667 6.66667ZM18.2267 23.6C17.5333 23.8533 16.7867 24 16 24C12.32 24 9.33333 21.0133 9.33333 17.3333H6.66667L10 14L13.3333 17.3333H10.6667C10.6667 20.28 13.0533 22.6667 16 22.6667C16.6133 22.6667 17.2133 22.56 17.76 22.36C18.0133 22.2667 18.28 22.32 18.4667 22.5067C18.8133 22.8533 18.68 23.4267 18.2267 23.6ZM22 20.6667L18.6667 17.3333H21.3333C21.3333 14.3867 18.9467 12 16 12C15.3867 12 14.7867 12.1067 14.24 12.3067C13.9867 12.4 13.72 12.3467 13.5333 12.16C13.1867 11.8133 13.32 11.24 13.7733 11.0667C14.4667 10.8133 15.2133 10.6667 16 10.6667C19.68 10.6667 22.6667 13.6533 22.6667 17.3333H25.3333L22 20.6667Z" fill="white"/>
                  </svg>
                  </section>
                </div>
              </div>
              <div :style="`visibility: ${isTimerOptionShown ? 'hidden' : 'visible'}`">
                <CameraCircleButton
                  @click="toggleTimerOptionShown(!isTimerOptionShown)"
                  :bgColor="selectedCameraTimer == 0 ? '' : selectedColor">
                  <svg v-if="selectedCameraTimer == 0" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-4 -2 30 30" fill="none">
                    <path fill="white" d="M24 12c0 6.627-5.373 12-12 12s-12-5.373-12-12h2c0 5.514 4.486 10 10 10s10-4.486 10-10-4.486-10-10-10c-2.777 0-5.287 1.141-7.099 2.977l2.061 2.061-6.962 1.354 1.305-7.013 2.179 2.18c2.172-2.196 5.182-3.559 8.516-3.559 6.627 0 12 5.373 12 12zm-13-6v8h7v-2h-5v-6h-2z"/>
                  </svg>
                  <div v-else class="text-white timer-label">
                    {{ selectedCameraTimer }}
                  </div>
                </CameraCircleButton>
              </div>
              <!-- camera timer option container -->
              <CameraTimerOption :selectedTimer="selectedCameraTimer" v-if="isTimerOptionShown" :timerOption="cameraTImerOptions" @selectTimer="handleChangeCameraTimer"/>
            </div>
          </div>
        </template>
      </camera>
      <section v-if="cameraStore.isVisible && iscameraPreviewing">
        <div class="preview-container">
          <div
            class="d-flex justify-content-center align-items-center"
            style="height: 100%"
          >
            <vue-drawing-canvas
              ref="VueCanvasDrawingOffline"
              v-model:image="drawImageOffline"
              :width="canvasScreenWidthOffline"
              :height="canvasScreenHeightOffline"
              stroke-type="dash"
              line-cap="round"
              line-join="round"
              :eraser="isEraserOffline"
              :lineWidth="lineWidthOffline"
              :color="lineColorOffline"
              :background-image="imagePreviewUrl"
              :initial-image="savedDrawOffline"
              saveAs="png"
              :lock="isLockedDrawOffline"
              :output-width="canvasScreenWidthOffline"
              :output-height="canvasScreenHeightOffline"
            />
          </div>
          <div
            class="d-flex flex-row justify-content-center align-items-center button-container"
            :style="{
              backgroundColor: isLockedDrawOffline ? '' : 'black',
              bottom: isLockedDrawOffline ? '16px' : '0',
            }"
          >
            <div
              v-if="isLockedDrawOffline"
              class="d-flex flex-row gap-4 preview-button-tools"
            >
              <div
                class="d-flex flex-column align-items-center gap-4"
                @click.prevent="backToCapturing"
              >
                <div class="button-ring">
                  <section
                    class="rounded-circle d-flex justify-content-center align-items-center"
                    style="
                      background-color: rgba(157, 154, 154, 0.9);
                      width: 100%;
                      height: 100%;
                    "
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_3476_147612)">
                        <path
                          d="M21.3333 9.33334H19.9999L18.6666 8H13.3333L11.9999 9.33334H10.6666C9.19994 9.33334 7.99994 10.5333 7.99994 12V20C7.99994 21.4667 9.19994 22.6667 10.6666 22.6667H21.3333C22.7999 22.6667 23.9999 21.4667 23.9999 20V12C23.9999 10.5333 22.7999 9.33334 21.3333 9.33334ZM15.9999 18.6667C14.5333 18.6667 13.3333 17.4667 13.3333 16C13.3333 14.5333 14.5333 13.3333 15.9999 13.3333C17.4666 13.3333 18.6666 14.5333 18.6666 16C18.6666 17.4667 17.4666 18.6667 15.9999 18.6667Z"
                          fill="white"
                        />
                        <path
                          d="M12.5999 0.373336C12.0666 0.480003 11.8666 1.12 12.2533 1.49334L16.2666 5.50667C16.6933 5.92 17.3999 5.62667 17.3999 5.04V2.72C23.3333 3.30667 28.1466 7.81334 29.1866 13.6133C29.2933 14.2267 29.8533 14.6533 30.4799 14.6533C31.3066 14.6533 31.9333 13.8933 31.7866 13.08C30.1466 3.85334 21.0533 -1.49333 12.5999 0.373336Z"
                          fill="white"
                        />
                        <path
                          d="M15.7333 26.4933C15.3066 26.0667 14.5999 26.3733 14.5999 26.96V29.28C8.66661 28.6933 3.85327 24.1867 2.81327 18.3867C2.70661 17.7733 2.14661 17.3467 1.51994 17.3467C0.693273 17.3467 0.0666066 18.1067 0.213273 18.92C1.86661 28.1467 10.9599 33.4933 19.4133 31.6267C19.9333 31.5067 20.1466 30.88 19.7599 30.4933L15.7333 26.4933Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3476_147612">
                          <rect width="32" height="32" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </section>
                </div>
                <div class="text-white">Retake Photo</div>
              </div>
              <div
                class="d-flex flex-column align-items-center gap-4"
                @click.prevent="openDescriptionForm"
              >
                <div class="button-ring">
                  <section
                    class="rounded-circle d-flex justify-content-center align-items-center"
                    style="
                      background-color: rgba(33, 43, 54, 1);
                      width: 100%;
                      height: 100%;
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="white"
                    >
                      <path
                        d="M27.1666 2.66669H5.83329C4.36663 2.66669 3.17996 3.86669 3.17996 5.33335L3.16663 29.3334L8.49996 24H27.1666C28.6333 24 29.8333 22.8 29.8333 21.3334V5.33335C29.8333 3.86669 28.6333 2.66669 27.1666 2.66669ZM27.1666 21.3334H7.39329L5.83329 22.8934V5.33335H27.1666V21.3334ZM14.5 18.6667H24.5V16H17.1666L14.5 18.6667ZM19.6466 10.84C19.9133 10.5734 19.9133 10.16 19.6466 9.89335L17.2866 7.53335C17.02 7.26669 16.6066 7.26669 16.34 7.53335L8.49996 15.3734V18.6667H11.7933L19.6466 10.84Z"
                        fill="white"
                      />
                    </svg>
                  </section>
                </div>
                <div class="text-white">Add Description</div>
              </div>
              <div
                class="d-flex flex-column align-items-center gap-4"
                @click.prevent="handleDrawImage"
              >
                <div class="button-ring">
                  <section
                    class="rounded-circle d-flex justify-content-center align-items-center"
                    style="
                      background-color: rgba(33, 43, 54, 1);
                      width: 100%;
                      height: 100%;
                    "
                  >
                    <svg
                      viewBox="0 0 32 32"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                    >
                      <path
                        d="M25.47 13.8533L26.8833 12.44C27.9233 11.4 27.9233 9.70667 26.8833 8.66667L25.0033 6.78667C23.9633 5.74667 22.27 5.74667 21.23 6.78667L19.8167 8.2L25.47 13.8533ZM19.8167 15.7467L10.2167 25.3333H8.33667V23.4533L17.9233 13.8667L19.8167 15.7467ZM17.9233 10.08L5.67 22.3467V28H11.3233L23.5767 15.7467L17.9233 10.08ZM25.67 23.3333C25.67 26.2533 22.2833 28 19.0033 28C18.27 28 17.67 27.4 17.67 26.6667C17.67 25.9333 18.27 25.3333 19.0033 25.3333C21.0567 25.3333 23.0033 24.36 23.0033 23.3333C23.0033 22.7067 22.3633 22.1733 21.3633 21.7333L23.3367 19.76C24.7633 20.6 25.67 21.72 25.67 23.3333ZM6.44334 17.8C5.15 17.0533 4.33667 16.08 4.33667 14.6667C4.33667 12.2667 6.85667 11.16 9.08334 10.1867C10.4567 9.57333 12.3367 8.74667 12.3367 8C12.3367 7.45333 11.2967 6.66667 9.67 6.66667C7.99 6.66667 7.27 7.48 7.23 7.52C6.76334 8.06667 5.92334 8.13333 5.36334 7.68C4.81667 7.22667 4.71 6.41333 5.16334 5.84C5.31 5.65333 6.68334 4 9.67 4C12.6567 4 15.0033 5.76 15.0033 8C15.0033 10.4933 12.43 11.6267 10.15 12.6267C8.89667 13.1733 7.00334 14 7.00334 14.6667C7.00334 15.08 7.57667 15.4667 8.43 15.8133L6.44334 17.8Z"
                        fill="white"
                      />
                    </svg>
                  </section>
                </div>
                <div class="text-white">Draw Photo</div>
              </div>
              <div
                class="ms-auto d-flex flex-column align-items-center gap-4"
                @click.prevent="uploadPhoto"
              >
                <div class="button-ring">
                  <section
                    class="rounded-circle d-flex justify-content-center align-items-center"
                    style="
                      background-color: rgba(24, 175, 74, 1);
                      width: 100%;
                      height: 100%;
                    "
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.7266 21.1666L7.09996 16.54C6.57996 16.02 5.73996 16.02 5.21996 16.54C4.69996 17.06 4.69996 17.9 5.21996 18.42L10.7933 23.9933C11.3133 24.5133 12.1533 24.5133 12.6733 23.9933L26.78 9.88664C27.3 9.36664 27.3 8.52664 26.78 8.00664C26.26 7.48664 25.42 7.48664 24.9 8.00664L11.7266 21.1666Z"
                        fill="white"
                      />
                    </svg>
                  </section>
                </div>
              </div>
            </div>
            <div v-else id="config-wrapper">
              <button class="collapsible-button small-button-ring" @click.stop="() => { isCollapsed = !isCollapsed }">
                <section
                  class="rounded-circle d-flex justify-content-center align-items-center"
                  style="background-color: #18AF4A; width: 100%; height: 100%;">
                  <template v-if="isCollapsed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24"><path d="m12 6.586-8.707 8.707 1.414 1.414L12 9.414l7.293 7.293 1.414-1.414L12 6.586z"/></svg>
                  </template>
                  <template v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24"><path d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z"/></svg>
                  </template>
                </section>
              </button>
              <div
              class="d-flex flex-column gap-4 draw-image-tools"
              :class="boxConfig">
                <section class="flex-fill d-flex flex-row justify-content-between align-items-center">
                  <el-button
                    class="btn btn-outline btn-outline-btech-default btech-lg m-0"
                    @click.prevent="cancelFreeDraw">
                    Cancel
                  </el-button>
                  <p class="m-0 draw-title">Draw Photo</p>
                  <el-button
                    class="btn btn-btech-primary btech-lg m-0"
                    @click.prevent="doneFreeDraw"
                    >Done</el-button>
                </section>
                <section class="flex-fill d-flex flex-row justify-content-between align-items-center">
                  <div class="d-flex gap-4">
                    <p
                      class="tools-item tools-active d-flex align-items-center m-0 px-3 py-2"
                      @click.prevent="VueCanvasDrawingOffline.undo()">
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="me-1">
                        <path
                          d="M8.31055 5.72211C6.54388 5.72211 4.94388 6.38211 3.71055 7.45544L2.45055 6.19544C2.03055 5.77544 1.31055 6.06877 1.31055 6.66211V10.3888C1.31055 10.7554 1.61055 11.0554 1.97721 11.0554H5.70388C6.29721 11.0554 6.59721 10.3354 6.17721 9.91544L4.90388 8.64211C5.83055 7.86877 7.01055 7.38877 8.31721 7.38877C10.4239 7.38877 12.2439 8.61544 13.1105 10.3888C13.2905 10.7621 13.7172 10.9488 14.1105 10.8154C14.5839 10.6621 14.8239 10.1221 14.6105 9.66877C13.4639 7.33544 11.0772 5.72211 8.31055 5.72211Z"
                          fill="white"
                        />
                      </svg>
                      Undo
                    </p>
                    <p
                      class="tools-item tools-active d-flex align-items-center m-0 px-3 py-2"
                      @click.prevent="VueCanvasDrawingOffline.redo()">
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="me-1">
                        <path
                          d="M12.2857 7.45544C11.0524 6.38211 9.4524 5.72211 7.68574 5.72211C4.9124 5.72211 2.52574 7.33544 1.3924 9.67544C1.17907 10.1221 1.41907 10.6554 1.8924 10.8154C2.28574 10.9488 2.7124 10.7621 2.8924 10.3888C3.75907 8.61544 5.57907 7.38877 7.68574 7.38877C8.98574 7.38877 10.1724 7.86877 11.0991 8.64211L9.82574 9.91544C9.40574 10.3354 9.69907 11.0554 10.2924 11.0554H14.0191C14.3857 11.0554 14.6857 10.7554 14.6857 10.3888V6.66211C14.6857 6.06877 13.9657 5.76877 13.5457 6.18877L12.2857 7.45544Z"
                          fill="white"
                        />
                      </svg>
                      Redo
                    </p>
                  </div>
                  <div class="d-flex gap-4">
                    <p
                      class="tools-item m-0 d-flex align-items-center m-0 px-3 py-2"
                      :class="!isEraserOffline ? 'tools-active' : ''"
                      @click.prevent="isEraserOffline = false">
                      <svg
                        width="16"
                        height="17"
                        xmlns="http://www.w3.org/2000/svg"
                        class="me-1">
                        <path
                          d="M5 9.723c-1.107 0-2 .893-2 2 0 .873-.774 1.333-1.334 1.333.613.814 1.66 1.334 2.667 1.334a2.666 2.666 0 0 0 2.666-2.667c0-1.107-.893-2-2-2Zm9.14-6.247-.894-.893a.664.664 0 0 0-.94 0L6.333 8.556l1.833 1.834 5.973-5.974c.26-.26.26-.68 0-.94Z"
                        />
                      </svg>
                      Brush
                    </p>
                    <p
                      class="tools-item m-0 d-flex align-items-center m-0 px-3 py-2"
                      :class="isEraserOffline ? 'tools-active' : ''"
                      @click.prevent="isEraserOffline = true">
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        xmlns="http://www.w3.org/2000/svg"
                        class="me-1">
                        <path
                          d="M13.5365 4.4888L13.8632 3.78214L14.5699 3.45547C14.8299 3.33547 14.8299 2.9688 14.5699 2.8488L13.8632 2.52214L13.5365 1.82214C13.4165 1.56214 13.0499 1.56214 12.9299 1.82214L12.6032 2.5288L11.9032 2.85547C11.6432 2.97547 11.6432 3.34214 11.9032 3.46214L12.6099 3.7888L12.9365 4.4888C13.0499 4.7488 13.4232 4.7488 13.5365 4.4888Z"
                        />
                        <path
                          d="M11.7099 6.5688L9.8232 4.68214C9.5632 4.42214 9.1432 4.42214 8.8832 4.68214L1.42986 12.1288C1.16986 12.3888 1.16986 12.8088 1.42986 13.0688L3.31653 14.9555C3.57653 15.2155 3.99653 15.2155 4.25653 14.9555L11.7032 7.5088C11.9699 7.25547 11.9699 6.8288 11.7099 6.5688ZM9.37653 7.96214L8.43653 7.02214L9.35653 6.10214L10.2965 7.04214L9.37653 7.96214Z"
                        />
                      </svg>
                      Eraser
                    </p>
                  </div>
                </section>
                <section class="flex-fill d-flex flex-row align-items-center">
                  <p class="m-0 me-4" style="color: white">
                    {{ isEraserOffline ? 'Eraser Size' : 'Brush Size' }}
                  </p>
                  <el-slider v-model="lineWidthOffline" class="flex-fill" :min="1" />
                  <p class="m-0 ms-4">{{ lineWidthOffline }}</p>
                </section>
                <section class="flex-fill d-flex flex-row justify-content-start gap-4 position-relative">
                  <el-color-picker
                    v-model="lineColorOffline"
                    show-alpha
                    class="tools-color"
                  />
                  <div
                    class="tools-color"
                    style="background-color: white"
                    @click="changeDrawColor('rgba(255, 255, 255, 1)')"
                  ></div>
                  <div
                    class="tools-color"
                    style="background-color: black"
                    @click="changeDrawColor('rgba(0, 0, 0, 1)')"
                  ></div>
                  <div
                    class="tools-color"
                    style="background-color: rgba(255, 72, 66, 1)"
                    @click="changeDrawColor('rgba(255, 72, 66, 1)')"
                  ></div>
                  <div
                    class="tools-color"
                    style="background-color: rgba(24, 175, 74, 1)"
                    @click="changeDrawColor('rgba(24, 175, 74, 1)')"
                  ></div>
                  <div
                    class="tools-color"
                    style="background-color: rgba(1, 163, 255, 1)"
                    @click="changeDrawColor('rgba(1, 163, 255, 1)')"
                  ></div>
                  <div
                    class="tools-color"
                    style="background-color: rgba(255, 165, 0, 1)"
                    @click="changeDrawColor('rgba(255, 165, 0, 1)')"
                  ></div>
                  <div
                    class="tools-color"
                    style="background-color: rgba(0, 0, 255, 1)"
                    @click="changeDrawColor('rgba(0, 0, 255, 1)')"
                  ></div>
                  <div
                    class="tools-color"
                    style="background-color: rgba(255, 231, 0, 1)"
                    @click="changeDrawColor('rgba(255, 231, 0, 1)')"
                  ></div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
      <dropzone-uploader
        ref="singleUploader"
        :is-multiple="false"
        @on-file-dropped="onDrop"
        @on-file-cancelled="onFileDialogCancel"
      />
      <!-- dropzone -->
      <!-- for testing -->
      <div style="display: none;">
        <template v-if="isCameraReady">
          <div
            class="d-flex flex-column justify-content-center align-items-end camera-container"
            style="height: 100%">
            <div v-if="isTimerShown && cameraTimeLeft != 0" class="h-100 text-center d-flex align-items-center justify-content-center timer-container">
              <h1 data-testid='timer-countdown' class="timer-label">{{ cameraTimeLeft }}</h1>
            </div>
            <!-- camera timer cancel button -->
            <div v-if="isTimerShown && cameraTimeLeft" class="d-flex flex-column justify-content-center align-items-center camera-tools-container" style="position: relative;">
              <CameraCircleButton @click="handleResetTimer()">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24.4 7.61334C23.88 7.09334 23.04 7.09334 22.52 7.61334L16 14.12L9.48 7.60001C8.96 7.08001 8.12 7.08001 7.6 7.60001C7.08 8.12001 7.08 8.96001 7.6 9.48001L14.12 16L7.6 22.52C7.08 23.04 7.08 23.88 7.6 24.4C8.12 24.92 8.96 24.92 9.48 24.4L16 17.88L22.52 24.4C23.04 24.92 23.88 24.92 24.4 24.4C24.92 23.88 24.92 23.04 24.4 22.52L17.88 16L24.4 9.48001C24.9067 8.97334 24.9067 8.12001 24.4 7.61334Z"
                    fill="white"
                  />
                </svg>
              </CameraCircleButton>
            </div>
            <div
              v-else class="d-flex flex-column justify-content-center align-items-center camera-tools-container" style="position: relative;">
              <CameraCircleButton data-testid='timer-button' @click="toggleTimerOptionShown(!isTimerOptionShown)">
                <svg v-if="selectedCameraTimer == 0" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-4 -2 30 30" fill="none">
                  <path fill="white" d="M24 12c0 6.627-5.373 12-12 12s-12-5.373-12-12h2c0 5.514 4.486 10 10 10s10-4.486 10-10-4.486-10-10-10c-2.777 0-5.287 1.141-7.099 2.977l2.061 2.061-6.962 1.354 1.305-7.013 2.179 2.18c2.172-2.196 5.182-3.559 8.516-3.559 6.627 0 12 5.373 12 12zm-13-6v8h7v-2h-5v-6h-2z"/>
                </svg>
                <div v-else class="text-white timer-label">
                  {{ selectedCameraTimer }}
                </div>
              </CameraCircleButton>
              <!-- camera timer option container -->
              <CameraTimerOption data-testid='timer-option' v-if="isTimerOptionShown" :timerOption="cameraTImerOptions" @selectTimer="handleChangeCameraTimer"/>
            </div>
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
  <PhotoDescription
    :is-visible="descriptionFormVisible"
    :description="imageDescription"
    @on-close="handleCloseDescriptionForm"
    @on-save-desc="handleSaveDesc"
  />
  <UploadImageFailureDialog
    :show="showErrorDialog"
    @close="closeShowErrorDialog"
    :imageList="errorImgNameArr"
  />
  <Confirmation :visibility="isCameraErrorPopUpShown"
    caption="Your device camera cannot be opened, please retry or contact your administrator!"
    @on-no-confirm="closeCamera"
    @on-yes-confirm="handleRetryOpenCamera"
    yesLabel="Retry"
    noLabel="Close"
    btnColorNo="background-color: #FFFFFF; color: black;"
    btnColorYes="background-color: #18AF4A; color: white;"
  />
</template>

<script lang="ts" setup>
import {
  useOfflineCameraStore
} from "@/store/pinia/application/useOfflineCameraStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useAttachmentStore
} from "@/store/pinia/dma/e-form-offline/attachments/useAttachmentStore";
import Camera from "simple-vue-camera";
import {
  ref,
  computed,
  watch,
  onUnmounted,
  onMounted
} from "vue";
import { ElLoading } from "element-plus";
import UploadImageFailureDialog from "./UploadImageFailureDialog.vue";
import { db } from "@/database/schema/DexieSchema";
import DropzoneUploader from "./DropzoneUploader.vue";
import PhotoDescription from "@/components/camera/PhotoDescription.vue";
import VueDrawingCanvas from "vue-drawing-canvas";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import {
  convertToWebP
} from "@/store/pinia/dma/e-form/helpers";
import { TaskImages } from "@/database/schema/TaskImages";
import { addRecord } from "@/database/schema/DatabaseWrapper";
import { QueueFileTask } from "@/database/schema/QueueFileTask";
import { AESTShortCurrentDateTime } from "@/core/helpers/date-format";
import CameraTimerOption from "./CameraTimerOption.vue"
import CameraCircleButton from "./CameraCircleButton.vue"
import {
  cameraTImerOptions,
  selectedColor
} from "./camera-timer-helper.ts"
import Confirmation from '@/components/dialog/CameraConfirmation.vue';

const cameraStore = useOfflineCameraStore();
const authStore = useAuthenticationStore();
const attachmentStore = useAttachmentStore();

const cam = ref<InstanceType<typeof Camera>>();
const errorImgNameArr = ref<string[]>([]);
const showErrorDialog = ref(false);
const iscameraPreviewing = ref(false);
const imagePreviewUrl = ref("");
const cameraCount = ref(0);
const blobImage = ref<Blob>();
const isCollapsed = ref(false);
const isCameraReady = ref(false);
const fullscreenLoading = ref(false);
const descriptionFormVisible = ref(false);
const imageDescription = ref("");
const singleUploader = ref<null | { openUploadDialog(): void }>(null);
const isTakePicture = ref(false)
const originalFilename = ref()
const selectedCameraTimer = ref(0)
const cameraTimeLeft = ref(0)
// eslint-disable-next-line no-undef
const timer = ref<Timer>(null)
const isTimerShown = ref(false)
const isTimerOptionShown = ref(false)
// eslint-disable-next-line no-undef
const cameraTimeOutTimer = ref<Timer>(null)
const isTimerStillCounting = ref(false)
const isCameraErrorPopUpShown = ref(false)

const showCloseButton = computed(() => {
  return cameraStore.ShowCloseButton;
});

const boxConfig = computed(() => {
  return isCollapsed.value ? 'collapsed' : 'expanded'
});

const closeShowErrorDialog = () => {
  showErrorDialog.value = false;
  cameraStore.toggleIsVisible(true);
};

const loading = () => {
  isCameraReady.value = false;
};

const error = (error: Error) => {
  console.log("camera err", error);
  cameraStore.setIsCameraError(true);
  fullscreenLoading.value = false
  isCameraErrorPopUpShown.value = true
};

const handleRetryOpenCamera = () => {
  closeCamera()
  setTimeout(() => {
    cameraStore.toggleIsVisible(true)
  }, 100);
}

const toggleCameraReady = (status) => {
  isCameraReady.value = status
}

const started = () => {
  fullscreenLoading.value = false;
  setTimeout(() => {
    isCameraReady.value = true;
  }, 1000);
};

const cameraVisible = computed(() => {
  return cameraStore.isVisible;
});

watch(cameraVisible, (newValue) => {
  if (newValue) {
    fullscreenLoading.value = true;
  }
});

const isCameraClicked = ref(false);

const clickCameraButtonHandler = () => {
  isCameraClicked.value = true;
  changeCamera();
  isCameraClicked.value = false;
};

const changeCamera = async () => {
  if (!isCameraClicked.value) {
    return;
  }
  const devices = await cam.value?.devices(["videoinput"]);
  if (!devices) return;
  const device = devices[cameraCount.value];
  if (cam.value?.currentDeviceID() != device.deviceId) {
    cam.value?.changeCamera(device.deviceId);
  }

  // if reach max to index 0
  if (cameraCount.value + 1 == devices?.length) {
    cameraCount.value = 0;
  } else {
    // change index to +1
    cameraCount.value = cameraCount.value + 1;
  }
  // cam.value?.changeCamera(devices[0].deviceId)
};

const backToCapturing = () => {
  fullscreenLoading.value = true;
  iscameraPreviewing.value = false;
  imageDescription.value = "";
  cameraStore.setImage("");
  cameraStore.setBlob(undefined);
  canvasScreenWidthOffline.value = window.innerWidth;
  canvasScreenHeightOffline.value = window.innerHeight;
  isTakePicture.value = false
  selectedCameraTimer.value = 0;
};

const resizedWidth = ref(0);
const resizedHeight = ref(0);

let maxHeight: number
let maxWidth: number

let takenPicHeight: number;
let takenPicWidth: number;

const getNewDimensions = (width: number, height: number, maxWidth: number, maxHeight: number) => {
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return { width: width * ratio, height: height * ratio };
};

const handleUpdateCanvasHeightAndWidth = () => {
  const { width, height } = getNewDimensions(takenPicWidth, takenPicHeight, window.innerWidth, window.innerHeight);
  canvasScreenWidthOffline.value = Math.floor(width);
  canvasScreenHeightOffline.value = Math.floor(height);
}

const drawBgImage = (imageSrc: string, isTakePhoto) => {
  const image = new Image();
  image.src = imageSrc;

  image.onload = () => {
    if (window.screen.height > window.screen.width) {
      // entah kenapa kalau take photo portrait width dan height kebalik
      // tapi kalau upload tidak terbalik
      takenPicHeight = isTakePhoto ? image.width : image.height;
      takenPicWidth = isTakePhoto ? image.height : image.width;
      handleUpdateCanvasHeightAndWidth();
    } else {
      takenPicHeight = image.height;
      takenPicWidth = image.width;
      handleUpdateCanvasHeightAndWidth();
    }

    VueCanvasDrawingOffline.value.setBackground();
  };
};

const handleChangeCanvasWidth = () => {
  if (!iscameraPreviewing.value) return
  handleUpdateCanvasHeightAndWidth();
  VueCanvasDrawingOffline.value.redraw();
}

onMounted(() => {
  window.addEventListener("resize", handleChangeCanvasWidth);
})

onUnmounted(() => {
  window.removeEventListener("resize", handleChangeCanvasWidth);
})

const handleCheckLandscapePic = (image) => {
  maxWidth = window.innerWidth;
  maxHeight = window.innerHeight;
  resizedWidth.value = image.width;
  resizedHeight.value = image.height;

  compareImageWidthToScreen(image, maxWidth)
  compareImageHeightToScreen(image, maxHeight)
}

const handleCheckPortraitPic = (image) => {
  maxWidth = window.innerHeight;
  maxHeight = window.innerWidth;
  if (!isTakePicture.value) {
    resizedWidth.value = image.width;
    resizedHeight.value = image.height;

    compareImageWidthToScreen(image, maxWidth)
    compareImageHeightToScreen(image, maxHeight)
  } else {
    resizedWidth.value = image.height * 0.9;
    resizedHeight.value = image.width * 0.9;
  }
}

const compareImageWidthToScreen = (image, maxWidth) => {
  if (image.width > maxWidth) {
    resizedWidth.value = maxWidth;
    resizedHeight.value = (maxWidth / image.width) * image.height;
  }
}

const compareImageHeightToScreen = (image, maxHeight) => {
  if (resizedHeight.value > maxHeight) {
    resizedHeight.value = maxHeight;
    resizedWidth.value = (maxHeight / image.height) * image.width;
  }
}

const readjustCanvasSize = (file, isTakePhoto = true) => {
  const reader = new FileReader();
  // Read the file as a data URL
  reader.readAsDataURL(file);
  reader.onload = () => {
    const result = reader.result;
    if (typeof result === "string") {
      drawBgImage(result, isTakePhoto);
    }
  };
};

const onDrop = async (acceptFiles) => {
  errorImgNameArr.value = [];
  const loading = ElLoading.service({
    lock: true,
    text: "Uploading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  let isFilePassValidation = true;
  const validImageTypes = [
    "image/gif",
    "image/jpeg",
    "image/jpg",
    "image/png"
  ];
  if (
    !validImageTypes.includes(acceptFiles[0].type)
  ) {
    isFilePassValidation = false
    errorImgNameArr.value.push(acceptFiles[0].name);
  }
  if (!isFilePassValidation) {
    if (errorImgNameArr.value.length > 0) showErrorDialog.value = true;
  } else {
    originalFilename.value = acceptFiles[0].name
    readjustCanvasSize(acceptFiles[0], false);
    blobImage.value = acceptFiles[0];
    const url = URL.createObjectURL(acceptFiles[0]);
    cameraStore.setImage(url);
    cameraStore.setBlob(acceptFiles[0]);
  }
  loading.close();
};

const snapshot = async () => {
  if (isCameraReady.value) {
    if (selectedCameraTimer.value > 0) {
      isTimerStillCounting.value = true
    }
    toggleTimerOptionShown(false)
    cameraTimeLeft.value = selectedCameraTimer.value;
    isTimerShown.value = true
    startTimer()
    cameraTimeOutTimer.value = setTimeout(async () => {
      isTimerShown.value = false
      iscameraPreviewing.value = false;
      const blob = (await cam.value?.snapshot()) as Blob;
      isTimerStillCounting.value = false;
      blobImage.value = blob;
      readjustCanvasSize(blob)

      // show as preview
      const url = URL.createObjectURL(blob);
      cameraStore.setImage(url);
      cameraStore.setBlob(blob);
      /* save it then close */
      isTakePicture.value = true
    }, selectedCameraTimer.value * 1000)
  }
};

const startTimer = () => {
  if (timer.value) {
    clearInterval(timer.value);
  }

  // Start a new timer
  timer.value = setInterval(() => {
    if (cameraTimeLeft.value > 0) {
      cameraTimeLeft.value--;
    } else {
      clearInterval(timer.value);
    }
  }, 1000);
}

const handleChangeCameraTimer = (val) => {
  selectedCameraTimer.value = val
  toggleTimerOptionShown(false)
}

const toggleTimerOptionShown = (val) => {
  isTimerOptionShown.value = val
}

const handleResetTimer = () => {
  clearTimeout(cameraTimeOutTimer.value);
  clearInterval(timer.value);
  isTimerShown.value = false;
  isTimerStillCounting.value = false
  selectedCameraTimer.value = 0;
  cameraTimeLeft.value = 0;
}

const onFileDialogCancel = () => {
  // do nothing
};

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

const uploadPhoto = async () => {
  doneFreeDraw()
  const loading = ElLoading.service({
    lock: true,
    text: "Uploading Picture",
    background: "rgba(0, 0, 0, 0.7)",
  });

  // upload to blob
  const fileName = generateString(15);

  const payload = new FormData();

  let finalImage = blobImage.value as Blob

  // convert to webp
  try {
    const convertedImage = await convertToWebP(finalImage);
    payload.append("files", convertedImage.file as Blob, `${fileName}.webp`);
    finalImage = convertedImage.file as Blob
  } catch (error: any) {
    console.error(error.message);
    payload.append("files", finalImage as Blob, `${fileName}.png`);
  }

  payload.append("userAccount", authStore.user.Email);
  const taskImage: QueueFileTask = {
    module: 'serviceForm',
    key: cameraStore.stateDumpToLocalInfo.taskKey,
    workorder: cameraStore.stateDumpToLocalInfo.workOrder,
    type: cameraStore.stateDumpToLocalInfo.type,
    fileType: 'webp',
    createdBy: cameraStore.stateDumpToLocalInfo.updatedBy,
    email: cameraStore.stateDumpToLocalInfo.email,
    filename: fileName,
    originalFilename: originalFilename.value ?? fileName,
    blob: finalImage,
    syncStatus: "Pending",
    syncDate: AESTShortCurrentDateTime()
  }
  let promise;
  if (!isOfflineOrSlowInternetConnection()) {
    promise = await attachmentStore.uploadAttachment(payload, authStore.user.Email, taskImage);
  } else {
    promise = await addRecord(db, "pendingTaskFile", taskImage);
  }
  if (promise) {
    Promise.all([promise]).then(() => {
      const image = {
        filename: fileName,
        description: encodeURI(imageDescription.value),
      };
      if (cameraStore.isReplacementCamera) {
        image['type'] = cameraStore.replacementPhotoLength == 0 ? 'cab side' : cameraStore.replacementPosition
        if (cameraStore.replacementPosition == 'cab side') {
          cameraStore.setReplacementPosition('off cab side')
        } else {
          cameraStore.setReplacementPosition('cab side')
        }
        cameraStore.setReplacementPhotoLength(cameraStore.replacementPhotoLength + 1)
      }
      imageDescription.value = "";
      if (cameraStore.IsFromActionDelete) {
        cameraStore.definePhoto(finalImage, image);
      } else {
        cameraStore.addPhoto(finalImage, image);
      }
    });
  }
  loading.close();
  cameraStore.setImage("");
  cameraStore.setBlob(undefined);
  cameraCount.value = 0;
  isTakePicture.value = false;
  originalFilename.value = undefined;
  closeCameraSetAction();
};

const generateString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const uploadFromGallery = () => {
  if (isCameraReady.value && singleUploader.value) {
    singleUploader.value.openUploadDialog();
  }
};

const openDescriptionForm = () => {
  descriptionFormVisible.value = true;
};

const handleCloseDescriptionForm = () => {
  descriptionFormVisible.value = false;
};

const handleSaveDesc = (desc: string) => {
  imageDescription.value = desc;
  descriptionFormVisible.value = false;
};

const closeCamera = (resetActionReset = true) => {
  isCameraErrorPopUpShown.value = false
  if (resetActionReset) {
    cameraStore.setIsActionFromDelete(false);
  }
  cameraStore.toggleIsVisible(false);
  selectedCameraTimer.value = 0;
};

const closeCameraSetAction = () => {
  closeCamera(false);
};

const currentImage = computed(() => {
  return cameraStore.currentImage;
});

watch(currentImage, (newValue) => {
  if (newValue) {
    iscameraPreviewing.value = true;
    imagePreviewUrl.value = newValue;
  } else {
    iscameraPreviewing.value = false;
    imagePreviewUrl.value = "";
  }
});

// Edit with draw image module
const VueCanvasDrawingOffline = ref();
const isLockedDrawOffline = ref(true);
const drawImageOffline = ref("");
const isEraserOffline = ref(false);
const lineWidthOffline = ref(10);
const lineColorOffline = ref("rgba(242, 24, 24, 1)");
const savedDrawOffline = ref([]);
const canvasScreenWidthOffline = ref(window.innerWidth);
const canvasScreenHeightOffline = ref(window.innerHeight);

const handleDrawImage = () => {
  isLockedDrawOffline.value = false;
};

const changeDrawColor = (color: string) => {
  lineColorOffline.value = color;
};

const cancelFreeDraw = () => {
  isLockedDrawOffline.value = true;
  VueCanvasDrawingOffline.value.reset();
};

const doneFreeDraw = () => {
  isLockedDrawOffline.value = true;
  blobImage.value = b64toBlob(drawImageOffline.value.split(",")[1], "image/png")
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/pages/camera.scss";
</style>
