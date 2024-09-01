<template>
  <div class="div">
    <template v-if="listStore.list.length < 1">
      <div class="row py-10 px-2 my-10 justify-content-center text-center w-100">
        <template v-if="!loading">
          <!-- <button @click="handlePreviewForm()">click</button> -->
          <h5 style="color: #919EAB;">No Data Display</h5>
        </template>
      </div>
    </template>
    <template v-else>
      <template v-if="listStore.options">
          <filter-input
            :options="listStore.options"
            @handle-select-fitter="handleSelectFitter"
            drop-down-placeholder="Search Service Sheet"
          />
      </template>
      <div
        v-for="(item, index) in displayData"
        :key="item.dailyScheduleId"
        class="row p-2 m-3 bg-light monitoring-item"
        @click="handlePreviewForm(item)"
      >
        <div class="col">
          {{ index + 1}}. {{ item.unitNumber }} - {{ item.brand }} {{ item.equipmentModel }} - {{ item.psType }} Hour Service - {{ item.workOrder }}
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ElLoading } from "element-plus";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  usePreviewFormStore
} from "@/store/pinia/dma/preview-form/usePreviewFormStore";
import { last } from 'lodash'
import { computed } from "@vue/reactivity";
import {
  useApprovalListStore
} from "@/store/pinia/dma/approval/useApprovalListStore";
import { List } from "@/core/types/entities/dma/approval/List";
import { useRouter } from "vue-router";
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore";
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form/defects/useDefectsStore";
import FilterInput from "@/components/e-form/filter-input/Index.vue";
import { onMounted, ref, watch } from "vue";

const authStore = useAuthenticationStore();
const previewFormStore = usePreviewFormStore();
const listStore = useApprovalListStore();
const store = useDefectsStore();
const formStore = useEFormStore();
const router = useRouter();

const displayData = ref<List[]>([])

const loading = computed(() => {
  return listStore.listLoading
})

const handlePreviewForm = async (item: List) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Generating Form",
    background: "rgba(0, 0, 0, 0.7)",
  });
  previewFormStore.setModelAndPsTypeId(`${item.brand} ${item.equipmentModel}`, item.psType.toString(), item.workOrder, item.unitNumber);
  // previewFormStore.setModelAndPsTypeId(`Komatsu 930E-4-HPI`, '2000', '100000001');
  await previewFormStore.postGenerateServiceSheet(authStore.user.EmployeeId, authStore.user.Name, authStore.user.SiteId);
  const defectIdentified = last(previewFormStore.groups);
  if (defectIdentified) {
    previewFormStore.setSelectedGroup(defectIdentified.id);
    await previewFormStore.updateGroupByParam(defectIdentified.groupName);
  }
  await store.getDefectsData(item.workOrder.toString());
  formStore.setModelAndPsTypeId('', item.psType.toString(), '', item.equipmentModel, '');
  await formStore.getEhmsRating();
  loading.close();
  router.push({ name: 'approvalpreview' })
};

const handleSelectFitter = (value) => {
  const selectedIndex = listStore.options.findIndex((val) => {
    return val.value == value
  })
  if (selectedIndex >= 0) {
    displayData.value = [listStore.list[selectedIndex]]
  }
}

watch(() => {
  return listStore.list
}, (newVal) => {
  displayData.value = newVal
}, { deep: true })

onMounted(() => {
  displayData.value = listStore.list
})
</script>

<style lang="scss">
.monitoring-item {
  border-radius: 12px;
  :hover {
    cursor: pointer;
  }
  .item__desc {
    font-weight: 400;
    font-size: 14px;
    color: #212b36;
  }
  .item__timestamp {
    text-align: right;
    font-weight: 400;
    font-size: 14px;
    color: #637381;
  }
}
</style>
