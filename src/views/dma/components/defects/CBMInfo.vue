<template>
  <el-dialog v-model="dialogVisible" :custom-class="'crackform dialog-header-noborder'" width="90%" center
    @closed="onFormClosed" @opened="onFormOpened" :destroy-on-close="true">
    <template #title>
      <span class="el-dialog__title" style="text-align: start"></span>
    </template>
    <div>
      <div class="ps-3" v-loading="isLoading">
        <h3>Detailed Information</h3>
        <template v-if="cbmData.appSPVBy">
          <GreenBadgeInfo :message="`${cbmData.appSPVDate} - ${cbmData.appSPVBy.name}`"
            placeholder-message="Approved by Supervisor" />
          <GreenBadgeInfo :message="`${cbmData.approveReason}`" v-if="cbmData.approveReason"
            placeholder-message="Approval Comment" />
        </template>
        <template v-if="cbmData.appPlannerBy">
          <GreenBadgeInfo :message="`${cbmData.appPlannerDate} - ${cbmData.appPlannerBy.name}`"
            placeholder-message="Approved by Planner" />
          <GreenBadgeInfo :message="`${cbmData.plannerApproveReason}`" v-if="cbmData.plannerApproveReason"
            placeholder-message="Approval Comment" />
        </template>
        <template v-if="item && itemValue && replacement && itemRating">
          <div class="d-flex flex-row justify-content-between">
            <!--v-if-->
            <div class="col-1 text-center px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
              <label>No</label>
            </div>
            <div class="col text-start px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Measurement Location</label>
            </div>
            <div class="col-2 text-start px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Previous Value</label>
            </div>
            <div class="col-2 text-start px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Current Value</label>
            </div>
            <div class="col-1 text-start px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>UoM</label>
            </div>
            <div class="col-2 text-start px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Rating</label>
            </div>
          </div>
          <div class="d-flex flex-row justify-content-between">
            <div class="col-1 text-center px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-left: 1px solid rgba(145, 158, 171, 0.24);"
              :style="replacement.rating ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <label>{{ taskNo }}</label>
            </div>
            <div class="col text-start px-2 py-2"
              :style="replacement.rating ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <label>{{ data.taskDesc }}</label>
            </div>
            <div class="col-2 text-start px-2 py-2"
              :style="replacement.rating ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-input size="small" class="dark-text-primary" v-model="item[0].value" :disabled="true" />
            </div>
            <div class="col-2 text-start px-2 py-2"
              :style="replacement.rating ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-input size="small" class="dark-text-primary" v-model="itemValue[0].value" :disabled="true" />
            </div>
            <div class="col-1 text-start px-2 py-2"
              :style="replacement.rating ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <label>{{ data.cbmUom }}</label>
            </div>
            <div class="col-2 text-start px-2 py-2" style="border-right: 1px solid rgba(145, 158, 171, 0.24);"
              :style="replacement.rating ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-input size="small" v-model="itemRating[0].value" :class="itemRating[0].value.toLowerCase()"
                :disabled="true" />
            </div>
          </div>
          <div class="d-flex flex-row justify-content-between" v-if="replacement.rating">
            <div class="col-1 text-center px-2 py-2"
              style="background-color: rgb(249, 250, 251);  border-left: 1px solid rgba(145, 158, 171, 0.24);">
              <label></label>
            </div>
            <div class="col text-start px-2 py-2" style="">
              <label>Replacement</label>
            </div>
            <div class="col-2 text-start px-2 py-2" style="">
              <label></label>
            </div>
            <div class="col-2 text-start px-2 py-2" style="">
              <el-input size="small" class="dark-text-primary" v-model="replacement.measurement" :disabled="true" />
            </div>
            <div class="col-1 text-start px-2 py-2" style="">
              <label>{{ replacement.uom }}</label>
            </div>
            <div class="col-2 text-start px-2 py-2" style=" border-right: 1px solid rgba(145, 158, 171, 0.24);">
              <el-input size="small" class="dark-text-primary" v-model="replacement.rating" :disabled="true"
                :class="replacement.rating.toLowerCase()" />
            </div>
          </div>
          <!-- comment row -->
          <div class="d-flex flex-row justify-content-between" v-if="replacement.rating">
            <div class="col-1 text-center px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-bottom: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
              <label></label>
            </div>
            <div class="col text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Comment</label>
            </div>
            <div class="col-2 text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
              <label></label>
            </div>
            <div class="col-5 text-start px-2 py-2"
              style="border-bottom: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
              <el-input size="small" class="dark-text-primary" v-model="data.commentValue" :disabled="true" />
            </div>
          </div>
        </template>
        <template v-else-if="taskRating == TaskRatingEnum.OIL_COOLED">
          <div class="d-flex flex-row justify-content-between items-center">
            <!--v-if-->
            <div class="col-1 text-center px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
              <label>No</label>
            </div>
            <div class="col text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Measurement Location</label>
            </div>
            <div class="col-2 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Tool</label>
            </div>
            <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>A</label>
            </div>
            <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>B</label>
            </div>
            <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Piston Movement (B-A)</label>
            </div>
            <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>UoM</label>
            </div>
            <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Percent Worn</label>
            </div>
            <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Rating</label>
            </div>
          </div>
          <div class="d-flex flex-row justify-content-between">
            <div class="col-1 text-center px-2 py-2" :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'" style="background-color: rgb(249, 250, 251); border-left: 1px solid rgba(145, 158, 171, 0.24);">
              <label>{{ taskNo }}</label>
            </div>
            <div class="col text-start px-2 py-2" :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <label>{{ data.taskDesc }}</label>
            </div>
            <div class="col-2 text-start px-2 py-2" :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-select size="small" v-model="data.cbmPistonTool" disabled placeholder="Select">
                <el-option
                  v-for="item in [data.cbmPistonTool as string]"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
            <div class="col-1 text-start px-2 py-2" :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-input size="small" class="dark-text-primary" v-model="data.cbmPistonA" :disabled="true" />
            </div>
            <div class="col-1 text-start px-2 py-2" :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-input size="small" class="dark-text-primary" v-model="data.cbmPistonB" :disabled="true" />
            </div>
            <div class="col-1 text-start px-2 py-2" :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-input size="small" class="dark-text-primary" v-model="data.cbmPistonResult" :disabled="true" />
            </div>
            <div class="col-1 text-start px-2 py-2" :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <label>{{ data.cbmUom }}</label>
            </div>
            <div class="col-1 text-start px-2 py-2" :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-input size="small" class="dark-text-primary" v-model="measurement" :disabled="true" />
            </div>
            <div class="col-1 text-start px-2 py-2" style="border-right: 1px solid rgba(145, 158, 171, 0.24);" :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-input size="small" v-model="data.taskValue" :class="data.taskValue.toLowerCase()" :disabled="true" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="d-flex flex-row justify-content-between">
            <!--v-if-->
            <div class="col-1 text-center px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
              <label>No</label>
            </div>
            <div class="col text-start px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Measurement Location</label>
            </div>
            <div class="col-2 text-start px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Measurement Value</label>
            </div>
            <div class="col-1 text-start px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
              <label>UoM</label>
            </div>
            <div class="col-2 text-start px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Rating</label>
            </div>
          </div>
          <div class="d-flex flex-row justify-content-between">
            <div class="col-1 text-center px-2 py-2"
              :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'"
              style="background-color: rgb(249, 250, 251); border-left: 1px solid rgba(145, 158, 171, 0.24);">
              <label>{{ taskNo }}</label>
            </div>
            <div class="col text-start px-2 py-2"
              :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <label>{{ data.taskDesc }}</label>
            </div>
            <div class="col-2 text-start px-2 py-2"
              :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-input size="small" class="dark-text-primary" v-model="measurement" :disabled="true" />
            </div>
            <div class="col-1 text-start px-2 py-2"
              :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <label>{{ data.cbmUom }}</label>
            </div>
            <div class="col-2 text-start px-2 py-2" style="border-right: 1px solid rgba(145, 158, 171, 0.24);"
              :style="data.isCbmAdjusment === 'true' && data.correctedValue ? '' : 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'">
              <el-input size="small" v-model="data.taskValue" :class="data.taskValue.toLowerCase()" :disabled="true" />
            </div>
          </div>
          <!-- adjustment new rating -->
          <div class="d-flex flex-row justify-content-between"
            v-if="data.isCbmAdjusment === 'true' && data.correctedValue">
            <div class="col-1 text-center px-2 py-2"
              style="background-color: rgb(249, 250, 251);  border-left: 1px solid rgba(145, 158, 171, 0.24);">
              <label></label>
            </div>
            <div class="col text-start px-2 py-2" style="">
              <label v-if="taskRating == TaskRatingEnum.MANUAL_CLEANED">After clean</label>
              <label v-else>Adjustment</label>
            </div>
            <div class="col-2 text-start px-2 py-2" style="">
              <label></label>
            </div>
            <div class="col-2 text-start px-2 py-2" style="">
              <el-input size="small" class="dark-text-primary" v-model="data.correctedMeasurement" :disabled="true" />
            </div>
            <div class="col-1 text-start px-2 py-2" style="">
              <label>{{ data.correctedUom }}</label>
            </div>
            <div class="col-2 text-start px-2 py-2" style="border-right: 1px solid rgba(145, 158, 171, 0.24);">
              <el-input size="small" class="dark-text-primary" v-model="data.correctedValue" :disabled="true"
                :class="data.correctedValue.toLowerCase()" />
            </div>
          </div>
          <!-- comment row -->
          <div class="d-flex flex-row justify-content-between"
            v-if="data.isCbmAdjusment === 'true' && data.correctedValue">
            <div class="col-1 text-center px-2 py-2"
              style="background-color: rgb(249, 250, 251); border-bottom: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
              <label></label>
            </div>
            <div class="col text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
              <label>Comment</label>
            </div>
            <div class="col-2 text-start px-2 py-2" style="border-bottom: 1px solid rgba(145, 158, 171, 0.24);">
              <label></label>
            </div>
            <div class="col-5 text-start px-2 py-2"
              style="border-bottom: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
              <el-input size="small" class="dark-text-primary" v-model="data.commentValue" :disabled="true" />
            </div>
          </div>
        </template>
        <h3 class="mt-3">Detail Specs</h3>
        <div v-if="gapFormula.length == 0">
          <table class="table table-bordered" style="width:500px">
            <caption></caption>
            <thead>
              <tr style="background:#70AD47">
                <th scope="col" class="table-header" style="border-right:1px solid white">Rating</th>
                <th scope="col" class="table-header" style="border-right:1px solid white">Value Min</th>
                <th scope="col" class="table-header" style="border-right:1px solid white">Value Max</th>
                <th scope="col" class="table-header">UoM</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in normalFormula" :key="index">
                <tr :class="(index % 2 == 0) ? 'even' : 'odd'">
                  <th scope="row" style="border-right:1px solid white; padding-left:10px">{{ item.cbmRating }}</th>
                  <th scope="row" style="border-right:1px solid white">{{ item.minValueComplete }}</th>
                  <th scope="row" style="border-right:1px solid white">{{ item.maxValueComplete }}</th>
                  <th scope="row">{{ item.uom }}</th>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <template v-if="gapFormula.length > 0">
          <h3 class="mt-3">Previous - Current Gap Rating Spec</h3>
          <table class="table table-bordered" style="width:500px">
            <caption></caption>
            <thead>
              <tr style="background:#70AD47">
                <th scope="col" class="table-header" style="border-right:1px solid white">Rating</th>
                <th scope="col" class="table-header" style="border-right:1px solid white">Value Min</th>
                <th scope="col" class="table-header" style="border-right:1px solid white">Value Max</th>
                <th scope="col" class="table-header">UoM</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in gapFormula" :key="index">
                <tr :class="(index % 2 == 0) ? 'even' : 'odd'">
                  <th scope="row" style="border-right:1px solid white; padding-left:10px">{{ item.cbmRating }}</th>
                  <th scope="row" style="border-right:1px solid white">{{ item.minValueComplete }}</th>
                  <th scope="row" style="border-right:1px solid white">{{ item.maxValueComplete }}</th>
                  <th scope="row">{{ item.uom }}</th>
                </tr>
              </template>
            </tbody>
          </table>
        </template>
        <h3 class="mt-3">Detailed picture</h3>
        <div class="row my-4">
          <div v-for="(img, index) in capturedImage"
            class="col-md-3 fv-row fv-plugins-icon-container p-2 rounded position-relative" :key="img.filename">
            <el-skeleton :loading="loader[index]" animated>
              <template #template>
                <el-skeleton-item variant="image" class='w-100 rounded' style="height: 200px; object-fit: fill" />
              </template>
              <template #default>
                <span style="font-size: 10px; font-weight: 600;"
                  v-if="history?.detail?.rating.includes('REPLACEMENT')">{{ getImageType(img.type) }}</span>
                <div class="bg-secondary">
                  <img :src="getImageUrl(img.filename)" class='w-100 rounded'
                    style="height: 200px; object-fit: contain; cursor: pointer" alt="images"
                    v-if="getImageUrl(img.filename) != undefined" @click="handleShowFullScreen(img.filename)" />
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>
        <template v-if="Object.keys(history).length > 0">
          <template v-if="isCBMAvgTask">
            <CBMAvgHistory :history="history" :taskNo="taskNo" />
          </template>
          <template v-else>
            <History :history="history" :taskRating="taskRating" :taskNo="taskNo"/>
          </template>
        </template>
        <template v-if="!cbmIsConfirmed && !viewOnly">
          <div class="mt-1 py-2" style="word-break: break-word !important;">
            <div class="desc-label">Approval Comment</div>
            <div class="d-flex flex-column">
              <Textarea :value="approveReason ?? ''" :disable-floating="true" name="approveReason" :max="255"
                :is-valid="approveReasonIsValid" :error-message="approveReasonRequiredMessage"
                @handleChange="onApproveReasonChange"></Textarea>
            </div>
            <button class="mt-2 btn btn-success w-100" @click.prevent="onApproveCBM"
              style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Approve</button>
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
  <template v-if="showFullImage">
    <FullScreenDialog :images="imagesFull" :visibility="showFullImage" :image="fullImageShowed"
      @handle-close="closeFullScreenImage" />
  </template>
  <ToastWithIcon :show="successMessageBoxVisible" :message="completeMessage" />
  <MessageBox :show="errorMessageBoxVisible" @close="onOk" :message="errorMessage" icon="/media/svg/dma/alert.svg" />
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  toRef,
  PropType,
  ref,
  computed
} from 'vue'
import { Header } from '@/core/types/entities/dma/defects/Header'
import { useEFormStore } from '@/store/pinia/dma/e-form/useEFormStore'
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form/defects/useDefectsStore'
import { AxiosResponse } from 'axios'
import ApiService from '@/core/services/ApiService'
import { orderBy } from 'lodash'
import FullScreenDialog from '@/components/camera/FullScreenDialog.vue';
import { ImageFull, ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import { KeyValue } from '@/core/types/misc/KeyValue'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'
import {
  formatNumberWithComma,
} from '@/core/helpers/number-format'
import {
  CBMInfoDetail
} from "@/core/types/entities/dma/defects/component-intervention/CBMInfoDetail"
import History from "@/components/e-form/cbm-history/History.vue"
import CBMAvgHistory from "@/components/e-form/cbm-history/cbm-avg/CBMAvgHistory.vue"
import { Item, JSONFieldEnum } from '@/core/types/entities/dma/e-form/Item'
import GreenBadgeInfo from "@/views/dma/components/defects/GreenBadgeInfo.vue"
import Textarea from "@/components/inputs/dma/Textarea.vue"
import {
  DefectConfirmationParams
} from '@/core/types/misc/DefectConfirmationParams'
import ToastWithIcon from "@/components/dialog/ToastWithIcon.vue";
import MessageBox from '@/components/dialog/MessageBox.vue';
import { ElLoading } from 'element-plus'
import { NoNetworkMessages } from '@/store/enums/ErrorMessagesEnum';
import { TaskRatingEnum } from "@/core/types/entities/dma/e-form/Task"
import { CBMTypeEnum } from "@/core/types/entities/dma/e-form/cbm/list"
import IronformConfig from "@/core/config/IronformConfig";


const props = defineProps({
  visibility: {
    required: true,
    type: Boolean,
  },
  cbmIsConfirmed: {
    required: false,
    type: Boolean,
    default: true
  },
  cbmData: {
    required: true,
    type: Object as PropType<Header>,
  },
  cbmDataHistory: {
    required: false,
    type: Object as PropType<CBMInfoDetail>,
    default: null
  },
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  }
});

// eslint-disable-next-line func-call-spacing
const emits = defineEmits<{
  (event: 'closeForm'): void
  (event: 'onApproveCbm', params: DefectConfirmationParams): void
}>()

const store = useEFormStore()
const defectStore = useDefectsStore()
/* refs */
const showFullImage = ref(false)
const keyValues = ref<KeyValue[]>([])
const loader = ref<boolean[]>([])
const images = ref<ImageInfo[]>([])
const imagesFull = ref<ImageFull[]>([])
const fullImageShowed = ref("")
const dialogVisible = toRef(props, "visibility")
const data = toRef(props, "cbmData")
const ratingFormula = ref<any[]>([])
const isLoading = ref(false)
const imageUrls = ref([] as string[])
const item = ref<Item>()
const itemValue = ref<Item>()
const itemRating = ref<Item>()
const replacement = ref<any>()
const approveReason = ref('')
const approveReasonRequiredMessage = ref('')
const approveReasonIsValid = ref(true)
const successMessageBoxVisible = ref(false)
const errorMessageBoxVisible = ref(false)
const errorMessage = ref("")
const completeMessage = "CBM Successfully Confirmed"
const taskRating = ref("");

const measurement = ref("")

const history = computed(() => {
  if (props.cbmDataHistory.historyModified) {
    return props.cbmDataHistory.historyModified
  }
  return {} as any
})

const handleShowFullScreen = (image) => {
  const index = imagesFull.value.findIndex((item) => {
    return item.imgBlob == image
  })
  const imageInfo = imagesFull.value[index]
  if (index > 0) {
    const front = imagesFull.value.slice(index)
    const back = imagesFull.value.slice(0, index)
    imagesFull.value = [...front, ...back]
  }
  fullImageShowed.value = imageInfo.url
  showFullImage.value = true
}

const isCBMAvgTask = computed(() => {
  let cbmAvgStatus = false

  const taskLengthMoreThanOne = (props.cbmDataHistory?.historyModifiedDefault && props.cbmDataHistory?.historyModifiedDefault.length > 1)
  let taskIsAverage = false

  let isTaskHasCBMCalculate = false
  let isTaskHasCBMResult = false
  if (taskLengthMoreThanOne) {
    props.cbmDataHistory?.historyModifiedDefault.forEach((task) => {
      task.items.forEach((item) => {
        if (item.category == "cbmCalculateAvg") {
          isTaskHasCBMCalculate = true
        }
        if (item.categoryItemType == "resultParamRating") {
          isTaskHasCBMResult = true
        }
      })
    })
  }

  if (isTaskHasCBMCalculate && isTaskHasCBMResult) {
    taskIsAverage = true
  }

  if (taskIsAverage) {
    cbmAvgStatus = true
  }
  return cbmAvgStatus
})

const closeFullScreenImage = () => {
  fullImageShowed.value = ""
  showFullImage.value = false
}

const getImageType = (type: string | undefined) => {
  if (!type) return ''
  return type == 'cab side' ? 'Cab Side' : 'Off Cab Side'
}

const normalFormula = computed(() => {
  let filtered = ratingFormula.value.filter((f) => {
    return f.cbmType != 'CBM_GAP' && f.cbmType != CBMTypeEnum.CBM_BRAKE_PACK_PERCENTAGE
  })
  if (taskRating.value == TaskRatingEnum.OIL_COOLED) {
    filtered = filtered.filter((f) => {
      return f.cbmType != CBMTypeEnum.BIRRANA && f.cbmType != CBMTypeEnum.CAT_GAUGE
    })
  }
  return filtered
})
const gapFormula = computed(() => {
  const filtered = ratingFormula.value.filter((f) => {
    return f.cbmType == 'CBM_GAP'
  })
  return filtered
})
const capturedImage = computed(() => {
  return orderBy(images.value, (img) => {
    return img.type
  })
})

/* methods */
const getImageUrl = (filename: string) => {
  const found = keyValues.value.find((k) => {
    return k.key == filename
  })
  return found?.value ?? ''
}
const getUrl = async () => {
  imageUrls.value = []
  if (images.value.length < 1) return
  for (const [index, info] of images.value.entries()) {
    const params = {
      fileUrl: `${info.filename}`,
      ver: 'v1',
    }
    try {
      const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/download_by_url?${new URLSearchParams(params).toString()}`
      const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
      const buffer = response.data
      const blob = new Blob([buffer])
      const urlCreator = window.URL || window.webkitURL
      const url = urlCreator.createObjectURL(blob)
      keyValues.value.push({
        key: info.filename,
        value: url
      })
      imagesFull.value.forEach((img) => {
        if (img.imgBlob == info.filename) {
          img.url = url
        }
      })
      loader.value[index] = false
    } catch (error) {
      console.log('image', error)
    }
  }
}
const onFormClosed = () => {
  emits('closeForm')
};

const taskNo = computed(() => {
  if ((data.value.taskNo.replace(/[^a-z]/gi, "").length > 1)) {
    return data.value.taskNo.replace(';', '').replace(/\D/g, '')
  } else {
    return data.value.taskNo.replace(';', '')
  }
})

const getTask = async () => {
  const items = await store.getTask(props.cbmData.serviceSheetDetailId, props.cbmData.taskId, 'items')
  taskRating.value = await store.getTask(props.cbmData.serviceSheetDetailId, props.cbmData.taskId, JSONFieldEnum.RATING);
  if (taskRating.value == TaskRatingEnum.OIL_COOLED) {
    measurement.value = `${Number(measurement.value) * 100}%`
  }
  item.value = items.filter((x) => {
    return x.categoryItemType == 'previousParamRating'
  })
  itemValue.value = items.filter((x) => {
    return x.categoryItemType == 'paramRating'
  })
  itemRating.value = items.filter((x) => {
    return x.categoryItemType == 'targetRating'
  })
  replacement.value = await store.getTask(props.cbmData.serviceSheetDetailId, props.cbmData.taskId, 'replacement')
}

const onFormOpened = async () => {
  isLoading.value = true
  approveReason.value = ''
  approveReasonIsValid.value = true
  approveReasonRequiredMessage.value = ''
  measurement.value = ""
  if (props.cbmData && props.cbmData.cbmMeasurement) {
    measurement.value = formatNumberWithComma(props.cbmData.cbmMeasurement)
  }
  // need to get task first
  await getTask()
  const formula = store.stateCBMFormulas.filter((x) => {
    return x.taskKey === data.value.taskId
  });
  ratingFormula.value = orderBy(formula, ['uom', 'cbmRating', 'minValue'])
  let raw = [] as any
  if (props.cbmDataHistory?.detailedPicture && props.cbmDataHistory?.detailedPicture.length > 0 && props.cbmDataHistory.historyModified != null) {
    raw = props.cbmDataHistory?.detailedPicture
  } else {
    raw = await defectStore.getDefectImages(data.value.serviceSheetDetailId, data.value.cbmImageKey, data.value.cbmImageProp);
  }
  images.value = stringToImageInfoConvert(raw)
  loader.value = Array.apply(null, Array(images.value.length)).map(function () {
    return true
  })
  imagesFull.value = images.value.map((img) => {
    return {
      imgBlob: img.filename,
      url: '',
      description: img.description
    }
  })
  await getUrl();
  isLoading.value = false;
}

const onApproveReasonChange = (param: {
  value: string
}) => {
  approveReason.value = param.value
  approveReasonRequiredMessage.value = ''
  approveReasonIsValid.value = true
}

const onApproveCBM = () => {
  if (IronformConfig.isSPVPlannerMandatoryInputCommentOnApproveCBM) {
    if (!approveReason.value) {
      approveReasonRequiredMessage.value = 'Approval Comment is required'
      approveReasonIsValid.value = false
      return
    }
  }
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  emits('onApproveCbm', {
    headerId: props.cbmData.id,
    reason: approveReason.value,
    callback: (IsError: boolean, errorText: string) => {
      loader.close()
      if (IsError) {
        errorMessage.value = errorText
        errorMessageBoxVisible.value = true
      } else {
        autoCloseSuccessMessageBox();
      }
    }
  })
}

const onOk = () => {
  errorMessageBoxVisible.value = false
  if (errorMessage.value != NoNetworkMessages.NO_NETWORK_VIEW) {
    onFormClosed()
  }
}

const autoCloseSuccessMessageBox = () => {
  successMessageBoxVisible.value = true
  setTimeout(() => {
    successMessageBoxVisible.value = false
    onOk()
  }, 1000);
}
</script>

<style lang="scss" scoped>
.table-header {
  text-align: center;
  color: #FFFFFF !important;
  font-weight: 500 !important;
}

.desc-label {
  font-size: 13px;
  font-weight: 600;
  border: none;
  min-height: -moz-min-content;
  min-height: min-content;
  line-height: 1.4;
  color: black;
}

.odd {
  background: #D5E3CF
}

.even {
  background: #EAF1E9;
}
</style>
<style lang="scss">
.a {
  .el-input__inner {
    border: 1px solid #18AF4A !important;
    color: #18AF4A !important;
    background-color: rgba(24, 175, 74, .08) !important;
  }
}

.b {
  .el-input__inner {
    border: 1px solid rgba(51, 102, 255, 0.48) !important;
    color: #01a3ff !important;
    background: rgba(51, 102, 255, 0.08) !important;
  }
}

.c {
  .el-input__inner {
    border: 1px solid #FFC107 !important;
    color: #FFC107 !important;
    background-color: rgba(255, 193, 7, 0.08) !important;
  }
}

.x {
  .el-input__inner {
    border: 1px solid rgba(255, 72, 66, 0.48) !important;
    color: #FF4842 !important;
    background-color: rgba(255, 72, 66, 0.08) !important;
  }
}
</style>
