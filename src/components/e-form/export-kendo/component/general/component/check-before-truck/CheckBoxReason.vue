<template>
  <div class="d-flex justify-content-start avoid">
    <div class="p-2 flex-fill">
      <div class="d-flex flex-row align-items-center mb-1">
        <NwImg style="height: 24px; width: 24px;" class="me-3" src="/media/icons/bootstrap-icon/checkbox-marked.svg" v-if="item.value == 'true'" />
        <NwImg style="height: 24px; width: 24px;" class="me-3" src="/media/icons/bootstrap-icon/checkbox-blank-outline.svg" v-else />
        <p class="mb-0">{{ item.caption }}</p>
      </div>
      <template v-if="viewReason != ''">
        <div class="desc-wrapper">
            <p class="desc-wrapper-title">Reason</p>
            <div class="desc-wrapper-content">
              <pre class="desc-wrapper-content-pre">{{ viewReason }}</pre>
            </div>
          </div>
      </template>
      <div class="text-end reason_skip--updateBy">
        {{ timeStamp }}
      </div>
      <template v-if="!lastIndex">
        <div class="border mt-3"></div>
      </template>
    </div>
  </div>
</template>

<script lang='ts' setup>
import {
  defineProps,
  PropType,
  computed
} from 'vue'
import { Item } from '@/core/types/entities/dma/e-form/Item'
import { isUndefined } from 'lodash';

const props = defineProps({
  item: {
    required: true,
    type: Object as PropType<Item>
  },
  reason: {
    required: false,
    type: String,
    default: ""
  },
  lastIndex: {
    type: Boolean,
  },
})

const viewReason = computed(() => {
  if (props.reason) {
    if (props.reason.includes("Other")) {
      return props.reason.split(";;")[1]
    } else {
      return props.reason.split(";;")[0]
    }
  }
  return ""
})

const timeStamp = computed(() => {
  let timeStamp = ''
  if (!isUndefined(props.item.updatedDate) && !isUndefined(props.item.updatedBy?.name)) {
    timeStamp = `${props.item.updatedBy?.name}, ${props.item.updatedDate}`
  }
  return timeStamp
})
</script>
<style lang="scss" scoped>
.desc-wrapper {
    padding: 5px 10px;
    border: 1px solid #e4e6ef;
    background: #eff2f5;
    border-radius: 0.475rem;
  }
  .desc-wrapper-title {
    font-size: 13px;
    color: grey;
    font-family: 'Public sans', sans-serif !important;
  }
  .desc-wrapper-content pre {
    margin-top: 4px;
  }
  .desc-wrapper-content-pre {
    font-size: 13px;
    color: #212b36;
    font-family: 'Public sans', sans-serif !important;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
</style>
