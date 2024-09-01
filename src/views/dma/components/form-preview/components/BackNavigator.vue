<template>
  <div class="row align-items-center pe-0">
    <div class="px-0 mx-0 d-flex flex-column" :class="[formName? 'col-4': 'col']">
      <h1 class="mb-0 d-flex align-items-center">
        <template v-if="!hideBackBtnComp">
          <button type="button" class="btn btn-link" @click="handleClickBack" v-if="componentRouterPush">
            <em class="fa fa-chevron-left" style="margin-right: 10px;"></em>
          </button>
        </template>
        {{ title }}
      </h1>
      <div class="d-flex" v-if="showApprovalHistory">
        <template v-if="!hideBackBtnComp">
          <button type="button" style="visibility: hidden;" class="btn btn-link">
            <em class="fa fa-chevron-left"></em>
          </button>
        </template>
        <h6 style="font-weight: 400; color: gray">Approved by {{ approveHistory }}</h6>
      </div>
    </div>
    <div class="col-8 text-end title-form-detail" v-if="formName">
      <h4 class="form-name" v-html="InterventionForm"></h4>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps } from "vue"
import { useRoute, useRouter } from "vue-router";
import {
  statusBadge,
  statusBadgeColor
} from "@/store/pinia/dma/e-form/helpers"

const props = defineProps({
  title: {
    required: true,
    type: String
  },
  formName: {
    required: false,
    type: String
  },
  componentRouterPush: {
    required: true,
    type: String
  },
  formStatus: {
    required: false,
    type: String,
    default: ''
  },
  percentageProgress: {
    required: false,
    type: Number,
    default: 0
  },
  approveHistory: {
    required: false,
    type: String
  },
  defectStatus: {
    required: false,
    type: String,
    default: ''
  },
  showStatus: {
    required: false,
    type: Boolean,
    default: true
  },
  hideBackBtnComp: {
    type: Boolean,
    required: false,
    default: false
  }
})

const router = useRouter()
const route = useRoute()

const showApprovalHistory = computed(() => {
  let isVisible = true
  if (!props.approveHistory) isVisible = false
  if (props.defectStatus != 'Completed') isVisible = false
  return isVisible
})

const InterventionForm = computed(() => {
  const status = statusBadge(props.formStatus, props.percentageProgress)
  const badge = `<span class='status-badge p-1 ${statusBadgeColor(status)}'>${status}</span>`
  if (props.showStatus) {
    return `<span>${badge} ${props.formName}</span>`
  }
  return `<span>${props.formName}</span>`
})
const handleClickBack = () => {
  router.push({ name: props.componentRouterPush })
}
</script>

<style lang="scss" scoped>
  .title-form-detail {
    font-weight: 400;
    font-size: 14px;
    color: #212B36;
  }
  .btn {
    &.btn-link {
      font-size: 20px;
      color: black;
    }
  }
.form-name {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: right;
}
</style>
<style>
 .yellow {
    color: #CC9A06;
  }
  .red {
    color: #FF4842;
  }
  .green {
    color: #54D62C;
  }
</style>
