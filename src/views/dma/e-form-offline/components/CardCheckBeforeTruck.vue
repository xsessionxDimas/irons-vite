<template>
  <template v-if="checkboxes.length > 0">
    <div class="mt-5 ps-0">
      <el-collapse
        v-model="activeTaskGroup"
        class="task-group general-accordion py-1 px-5 mb-3"
      >
        <el-collapse-item :title="title" :name="title">
          <template v-for="(item, index) in checkboxes" :key="item.label">
            <CheckTruckInfo :item="item" v-if="item.itemType == 'html'" />
            <CheckBoxItem :item="item" :index="index" :is-aggrement-checked="isAggrementChecked" v-else-if="item.category != 'skipOtherWash'"/>
            <CheckBoxItemWithDialog :item="item" :last-index="index == checkboxes.length - 1" :is-aggrement-checked="isAggrementChecked" v-else-if="item.category == 'skipOtherWash'"/>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
  </template>
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
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import CheckBoxItem from "./CheckBoxItem.vue";
import CheckTruckInfo from "./CheckTruckInfo.vue";
import CheckBoxItemWithDialog from '@/views/dma/e-form-offline/components/CheckBoxItemWithDialog.vue'
import { isUndefined } from "lodash";
import { checkDozer, checkLIEBHER } from "@/store/pinia/dma/e-form/helpers";

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<Task>,
  },
  isAggrementChecked: {
    type: Boolean,
    default: false,
  },
});

/* stores */
const store = useEFormStore();
const defaultTitle = "WASH AND CHECKS BEFORE MACHINE ENTERS THE WORKSHOP:"
const defaultDozerTitle = "WASH AND CHECK BEFORE MACHINE ENTERS THE WORKSHOP OR SHUTDOWN AREA:"
const defaultLieTitle = "WASH AND CHECK BEFORE MACHINE ENTERS THE SHUTDOWN AREA:"
const activeTaskGroup = ref('')

const checkboxes = computed(() => {
  return store.generalForm.checkBeforeTruck.items
});

const title = computed(() => {
  let titleName = ""
  if (isUndefined(props.data.taskGroupName)) {
    titleName = checkDozer(store.generalForm.modelId) ? defaultDozerTitle : ""
    if (!titleName) {
      titleName = checkLIEBHER(store.generalForm.modelId) ? defaultLieTitle : defaultTitle
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
  return store.generalForm.modelId
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
.label {
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #919eab;
}
</style>
