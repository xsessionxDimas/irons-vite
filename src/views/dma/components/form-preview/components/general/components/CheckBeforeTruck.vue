<template>
  <template v-if="data.items.length > 0">
    <div class="mt-5 ps-0">
      <el-collapse
        v-model="activeTaskGroup"
        class="task-group general-accordion py-1 px-5 mb-3"
      >
        <el-collapse-item
          :title="title"
          :name="title"
        >
          <template v-for="(item, index) in data.items" :key="item.key">
            <CheckTruckInfo :item="item" v-if="item.itemType == 'html'" />
            <CheckBoxItem :item="item" :index="index" :is-aggrement-checked="false" v-else-if="item.category != 'skipOtherWash'"/>
            <CheckBoxItemWithDialog :item="item" :last-index="index == data.items.length - 1" :is-aggrement-checked="false" v-if="item.category == 'skipOtherWash'"/>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
  </template>
</template>

<script lang="ts" setup>
import {
  ref,
  defineProps,
  PropType,
  onMounted,
  watch,
  computed
} from "vue";
import { Task } from "@/core/types/entities/dma/e-form/Task";
import CheckBoxItem from '@/views/dma/e-form/components/CheckBoxItem.vue'
import CheckBoxItemWithDialog from '@/views/dma/e-form/components/CheckBoxItemWithDialog.vue'
import { General } from "@/core/types/entities/dma/e-form/general/General";
import { checkDozer, checkLIEBHER } from "@/store/pinia/dma/e-form/helpers";
import { isUndefined } from "lodash";
import CheckTruckInfo from "@/views/dma/e-form/components/CheckTruckInfo.vue";

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<Task>,
  },
  general: {
    required: true,
    type: Object as PropType<General>
  }
});

const defaultTitle = "WASH AND CHECKS BEFORE MACHINE ENTERS THE WORKSHOP:"
const defaultDozerTitle = "WASH AND CHECK BEFORE MACHINE ENTERS THE WORKSHOP OR SHUTDOWN AREA:"
const defaultLieTitle = "WASH AND CHECK BEFORE MACHINE ENTERS THE SHUTDOWN AREA:"
const activeTaskGroup = ref('')

const title = computed(() => {
  let titleName = ""
  if (isUndefined(props.data.taskGroupName)) {
    titleName = checkDozer(props.general.modelId) ? defaultDozerTitle : ""
    if (!titleName) {
      titleName = checkLIEBHER(props.general.modelId) ? defaultLieTitle : defaultTitle
    }
    return titleName
  }
  return props.data.taskGroupName
})

const checkTitle = () => {
  activeTaskGroup.value = title.value
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

<style scoped>
.form-control,
.form-select {
  color: #919eab;
}
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}
.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}
.subtitle {
  font-style: normal;
  font-size: 12px;
  color: #919eab;
}
.form-check-input:checked {
  background-color: #18af4a;
  border-color: #18af4a;
}
</style>
