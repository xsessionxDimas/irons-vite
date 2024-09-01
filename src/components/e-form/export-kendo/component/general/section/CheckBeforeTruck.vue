<template>
    <div class="report mb-4" v-if="data && data.items.length > 0">
      <div class="report_section">
        <div class="report_section_header">
          <h4 class="title ps-3">{{ title }}</h4>
          <h6 class="subtitle ps-3"></h6>
        </div>
      </div>
      <div class="report_body">
        <template v-for="[index, item] in data.items.entries()" :key="item.key">
          <Information :item="item" v-if="item.itemType == 'html'" />
          <CheckBox :item="item" v-else-if="item.category != 'skipOtherWash'"/>
          <CheckBoxReason :item="item" :last-index="index == data.items.length - 1" v-else-if="item.category == 'skipOtherWash'" :reason="item.reason" />
        </template>
      </div>
    </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
  ref,
  onMounted,
  watch
} from "vue";
import { Task } from "@/core/types/entities/dma/e-form/Task";
import { General } from "@/core/types/entities/dma/e-form/general/General";
import { checkDozer, checkLIEBHER } from "@/store/pinia/dma/e-form/helpers";
import { isUndefined } from "lodash";
import Information from "../component/check-before-truck/Information.vue";
import CheckBox from "../component/check-before-truck/CheckBox.vue";
import CheckBoxReason from "../component/check-before-truck/CheckBoxReason.vue";

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<Task>
  },
  general: {
    required: true,
    type: Object as PropType<General>,
  },
});

const title = ref('')

const data = computed(() => {
  return props.data
})

const defaultTitle = "WASH AND CHECKS BEFORE MACHINE ENTERS THE WORKSHOP:"
const defaultDozerTitle = "WASH AND CHECK BEFORE MACHINE ENTERS THE WORKSHOP OR SHUTDOWN AREA:"
const defaultLieTitle = "WASH AND CHECK BEFORE MACHINE ENTERS THE SHUTDOWN AREA:"

const checkTitle = () => {
  if (data.value) {
    if (isUndefined(data.value.taskGroupName)) {
      const isDozer = checkDozer(props.general.modelId)
      title.value = isDozer ? defaultDozerTitle : ""
      if (!title.value) {
        title.value = checkLIEBHER(props.general.modelId) ? defaultLieTitle : defaultTitle
      }
    } else {
      title.value = data.value.taskGroupName
    }
  }
}

onMounted(() => {
  checkTitle()
})

watch(() => {
  return props.general?.modelId
}, () => {
  checkTitle()
})
</script>
<style lang="scss" scoped>
  .title {
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
  }
  .subtitle {
      font-style: normal;
      font-size: 12px;
      color:#919EAB;
  }
</style>
