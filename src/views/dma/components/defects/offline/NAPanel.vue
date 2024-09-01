<template>
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="titleComp">
        <el-collapse-item :title="title" :name="title">
          <div class="row px-2 item mx-1 w-100 defect-panel-header">
            <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
            <div class="col-4 align-items-center d-flex text-break">Task Description</div>
            <div class="col align-items-center d-flex text-break" v-if="isDefect">Comments</div>
            <div class="col column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-end pe-16">Review Status</div>
          </div>
          <template v-if="headers.length < 1">
            <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
              <p style="text-align: center;">No data recorded</p>
            </div>
          </template>
          <template v-else v-for="(item) in headers" :key="item.id">
            <div class="row px-2 item mx-1 w-100 my-2">
              <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ item.taskNo.replace(';', '') }}</div>
              <div class="col-4 align-items-center d-flex text-break">
                <span class="text-break defect-identified-task" v-html="displayDesc(item.taskDesc)"></span>
              </div>
              <div class="col align-items-center d-flex text-break" v-if="isDefect">
                <span class="text-break">{{ item.commentValue }}</span>
              </div>
              <div :class="[supervisor ? 'col justify-content-end' : 'col-1 justify-content-center']" class="column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex">
                <template v-if="item.plannerCbmNAStatus == 'Decline' || item.cbmNAStatus == 'Decline'">
                  <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red cursor-pointer"
                    @click="showDetail(item)">
                    Declined
                  </div>
                </template>
                <template v-else>
                  <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                    :class="detailInfoClass(item.id, headers, true, 'cbmNAStatus', 'plannerCbmNAStatus')"
                    @click.prevent="showDetail(item)">
                    Detailed Information
                  </div>
                </template>
              </div>
              <div class="row flex-nowrap w-100 flex-row-reverse create-by">
                {{ item.createdBy.name }}, {{ item.createdDate }}
              </div>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <NAForm
    ref="NAFormComponent"
    :view-only="true"
    :visibility="showDetailForm"
    :na-data-header="dataNAHeader"
    :na-data-detail="dataNADetail"
    @close="closeDetail" />
</template>

<script lang="ts" setup>
import {
  defineProps,
  PropType,
  ref,
  computed
} from 'vue'
import { Header } from '@/core/types/entities/dma/defects/Header'
import { Detail } from '@/core/types/entities/dma/defects/Detail'
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsStore'
import NAForm from '@/views/dma/components/defects/NAForm.vue'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { detailInfoClass } from "@/store/pinia/dma/e-form/helpers"

const props = defineProps({
  title: {
    required: true,
    type: String
  },
  isDefect: {
    required: true,
    type: Boolean,
    default: true
  },
  headers: {
    required: true,
    type: [] as PropType<Header[]>
  },
  plannerApprove: {
    required: false,
    type: Boolean,
    default: false
  },
  isDisabled: {
    required: false,
    type: Boolean,
    default: false
  }
})

/* stores */
const store = useDefectsStore()

const loader = ref<Array<boolean>>([])
const titleComp = computed(() => {
  return props.title
})
const dataNAHeader = ref<Header>()
const dataNADetail = ref<Detail>()

props.headers.forEach(() => {
  loader.value.push(false)
})

const supervisor = computed(() => {
  // not planner
  return !props.plannerApprove
})

const showDetailForm = ref(false)
const naReason = ref('')
const naTitle = ref('')

const closeDetail = () => {
  showDetailForm.value = false
}

const showDetail = (item) => {
  dataNAHeader.value = undefined
  dataNADetail.value = undefined
  const headerId = item.id
  let found = store.ApprovalData.DefectNADetails.find((d) => {
    return d.defectHeaderId == headerId
  })
  let foundHeader = item
  if (found) {
    showDetailForm.value = true
    dataNAHeader.value = foundHeader
    dataNADetail.value = found
  } else {
    found = store.ApprovalData.CrackNADetails.find((d) => {
      return d.defectHeaderId == headerId
    })
    if (found) {
      showDetailForm.value = true
      dataNAHeader.value = foundHeader
      dataNADetail.value = found
    }
  }
}
</script>

<style lang="scss">
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}
.vcp__body {
  overflow: inherit !important;
}
.letter-space-hypen {
  letter-spacing: 1.5px;
}
.testing {
  .el-collapse-item__header {
    min-height: min-content;
    height: fit-content;
    margin-bottom: 10px;
  }
}
</style><style lang="scss" scoped>
@import "@/assets/sass/pages/defect.panel.scss";
</style>
