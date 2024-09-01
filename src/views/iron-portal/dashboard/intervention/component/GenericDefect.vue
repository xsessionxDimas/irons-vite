<template>
  <template v-if="loading">
    <el-table
    v-loading="loading"
    element-loading-background="#2d2b39b3"
    :data="[]"
    style="width: 100%"
    :empty-text="'No Data'"
    class="table-row table-dark"
    header-row-class-name="table-header"
    row-class-name="table-row">
      <el-table-column label="Task Description">
      </el-table-column>
      <el-table-column label="Priority" align="center" width="80">
      </el-table-column>
      <el-table-column label="Review Status" align="center" width="170">
      </el-table-column>
      <el-table-column label="Work Order" align="center" width="250">
      </el-table-column>
      <el-table-column label="Repair Status" align="center" width="150">
      </el-table-column>
    </el-table>
  </template>
  <template v-else>
    <div class="row px-2 item mx-1 w-100 defect-panel-header" style="color: #909399; background: #3d3d4b;" v-loading="loading">
      <div class="col align-items-center d-flex text-break">Task Description</div>
      <div class="text-break col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center">Priority</div>
      <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-15-percent column-xl-15-percent align-items-center d-flex justify-content-center" style="padding-left:0">Review Status</div>
      <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" style="padding-left:0">Work Order</div>
      <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important">Repair Status</div>
    </div>
     <!-- items data -->
  <template v-if="headers.length < 1">
    <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
      <p class="el-table__empty-text" style="text-align: center;">No Data</p>
    </div>
  </template>
  <template v-else v-for="item in headers" :key="item.id">
    <div class="item px-2 my-2 mx-1">
      <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
        <div class="col align-items-center d-flex text-break"><span class="text-break" v-html="displayDesc(item.taskDesc ?? '')"></span></div>
        <div class="text-break col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center">
          <template v-if="!isDecline(item)">
            <div class="little-box justify-content-center align-items-center justify-content-center d-flex mx-auto"
            :class="priorityClass(item.priority ?? '')" style="margin-top: 6px;">
                <span class="text-center" style="font-weight:600; color:white">{{ item.priority }}</span>
            </div>
          </template>
        </div>
        <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-15-percent column-xl-15-percent align-items-center d-flex justify-content-center">
          <div v-if="!isDecline(item)" class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center"
            :class="formClassDefectGeneric(item.id as string, headers)"
            @click="showDetail(item)"
            style="font-size: 11px !important;">
            Detailed Information
          </div>
          <div v-else class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red"
            @click="showDetail(item)"
            style="font-size: 11px !important;">
            Declined
          </div>
        </div>
        <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center" :class="item.priority === undefined ? 'invisible' : ''">
          <div class="row">
            <template v-if="!isDecline(item)">
              <div class="pe-0">
                <input type="text" class="form-control mou-input" :value="item.defectWorkorder"
                  disabled />
              </div>
            </template>
          </div>
        </div>
        <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex">
          <template v-if="!isDecline(item)">
            <div class="mx-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center mx-auto" style="margin-top: 6px;cursor: initial"
              :class="repairedClass(item)">
              <img src="/media/svg/dma/icons/Repair.png" alt="" />
            </div>
          </template>
        </div>
      </div>
      <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
        {{ item.createdBy.name }}, {{ item.updatedDate && item.updatedDate != "" ? item.updatedDate : item.createdDate }}
      </div>
    </div>
  </template>
  </template>
</template>

<script lang="ts" setup>
import {
  PropType,
  computed,
  defineProps,
} from 'vue'
import { Defect } from '@/database/schema/Defect'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { cloneDeep } from 'lodash'

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<Defect[]>,
  },
  loading: {
    required: true,
    type: Boolean
  }
})

const emits = defineEmits(["onViewDetailInformation"])

const sortDecline = (a, b) => {
  const ADeclineStatus = Boolean(a.declineReason)
  const BDeclineStatus = Boolean(b.declineReason)
  if (ADeclineStatus < BDeclineStatus) {
    return -1;
  }
  if (ADeclineStatus > BDeclineStatus) {
    return 1;
  }
  return 0;
}

const formClassDefectGeneric = (defectHeaderId: string, headers: Defect[]): string => {
  let cssClass = "light-yellow color-dark-yellow"
  const header = headers?.find((h) => {
    return h.id === defectHeaderId
  })
  if (header) {
    switch (header.status) {
      case "Submited":
        cssClass = "light-yellow color-dark-yellow"
        break
      case "Acknowledge":
        cssClass = "light-green color-dark-green"
        break
    }
    if (header.priority === undefined) {
      cssClass = "light-green color-dark-green"
    }
  }
  return cssClass
}

const priorityClass = (priority: string): string => {
  let priorityClass = ""
  switch (priority) {
    case "P1":
      priorityClass = "red"
      break
    case "P2":
      priorityClass = "gold"
      break
    case "P3":
      priorityClass = "yellow"
      break
    case "P4":
      priorityClass = "green"
      break
  }
  return priorityClass
}

const showDetail = (item: Defect) => {
  emits("onViewDetailInformation", {
    type: 'defectGeneric',
    taskId: item.taskId,
    taskNo: item.taskNo,
    taskDesc: item.taskDesc,
    taskStatus: item.status,
    taskDeclineReason: item.declineReason,
    taskDeclineDate: item.declineDate,
    taskDeclineBy: item.declineBy,
    defectHeaderId: item.id as string
  })
}

const headers = computed(() => {
  const list = cloneDeep(props.listData)
  return list.sort(sortDecline)
})

const repairedClass = (defect: Defect): string => {
  let className = defect.repairedStatus == 'Repaired' ? 'green' : 'red'
  className = !defect.priority ? 'green' : className
  return className
}
const isDecline = (defect: Defect) => {
  return defect.plannerStatus == 'Decline' || defect.status == 'Decline'
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.panel.scss";

.item {
  background: transparent;
  color: white
}
.item:hover {
  background: #3d3d4b;
  cursor: default;
}
</style>
