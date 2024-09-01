<template>
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="titleComp">
        <el-collapse-item :title="title" :name="title">
          <div class="row px-2 item mx-1 w-100 defect-panel-header">
            <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
            <div class="col align-items-center d-flex text-break">Task Description</div>
            <div class="col align-items-center d-flex text-break">Comments</div>
          </div>
          <template v-if="headers.length < 1">
            <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
              <p style="text-align: center;">No data recorded</p>
            </div>
          </template>
          <template v-else v-for="(item) in sortedComment" :key="item.id">
            <div class="item px-2 my-2 mx-1">
              <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ item.taskDesc.split(";")[0] }}</div>
                <div class="col align-items-center d-flex text-break">
                  <span class="text-break defect-identified-task" v-html="displayDesc(item.taskDesc, isIntervention)"></span>
                </div>
                <div class="col align-items-center d-flex text-break">
                  <span class="text-break">{{ item.taskComment }}</span>
                </div>
              </div>
              <div class="row flex-nowrap w-100 flex-row-reverse create-by" v-if="item.updatedBy && item.updatedDate">
                {{ item.updatedBy.name }}, {{ item.updatedDate }}
              </div>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
  ref
} from 'vue'
import { Comment } from '@/core/types/entities/dma/defects/Comment'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { sortTaskDesc } from "@/store/pinia/dma/e-form/helpers"

const props = defineProps({
  headers: {
    required: true,
    type: [] as PropType<Comment[]>
  },
  isIntervention: {
    required: false,
    type: Boolean,
    default: false
  }
})

const title = ref("Comments")
const titleComp = ref("Comments")

const sortedComment = computed(() => {
  return (props.headers || []).sort(sortTaskDesc)
})
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
