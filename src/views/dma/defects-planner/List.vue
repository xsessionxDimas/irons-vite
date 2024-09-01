<template>
  <div class="wrapper d-flex flex-column flex-fill">
     <div class="d-flex justify-content-between align-items-center">
       <p class="page-title">Defect Review</p>
       <div>
         <online-status></online-status>
       </div>
     </div>
     <div class="my-4 px-3"></div>
       <!-- legends -->
       <div class="d-flex flex-row">
       </div>
      <template v-for="defect in defectList" :key="defect.name">
        <ListGroup :dataList="defect" @onItemClick="defectItemClick" :loading="loading" />
      </template>
   </div>
</template>

<script lang="ts" setup>
import {
  onBeforeMount,
  computed,
  ref,
  watch
} from 'vue'
import navigator from '@/core/mixins/navigator'
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import {
  useComponentInterventionDefectSheetStore
} from '@/store/pinia/dma/component-intervention/defect-approval/useComponentInterventionDefectSheetStore'
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form/defects/useDefectsStore'
import {
  useComponentInterventionDefectsStore
} from '@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore'
import { ElLoading } from 'element-plus'
import {
  usePositionListStore
} from '@/store/pinia/administration/organization-unit/position/usePositionListStore'
import OnlineStatus from '@/components/sensors/OnlineStatus.vue'
import ListGroup from "../../../components/e-form/ListGroup.vue"
import {
  ListDefectSheet
} from "@/core/types/entities/dma/defects/ListDefectSheet"
import {
  useInterimDefectSheetStore
} from '@/store/pinia/dma/defect-approval-interim/useInterimDefectSheetStore'
import { isUndefined } from 'lodash'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import {
  useInterimDefectsStore
} from '@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore'

/* helpers */
const { redirectByLink } = navigator();

/* refs */
const loading = ref(false);

/* stores */
const store = useDefectsStore();
const interimStore = useInterimDefectsStore()
const interventionStore = useComponentInterventionDefectsStore();
const defectSheetStore = useDefectSheetStore();
const defectSheetInterimStore = useInterimDefectSheetStore();
const interventionDefectSheetStore = useComponentInterventionDefectSheetStore();
const listStore = usePositionListStore();
const authStore = useAuthenticationStore()

/* computed */
const sheetsEform = computed(() => {
  return defectSheetStore.DefectSheets;
});

const sheetsIntervention = computed(() => {
  return interventionDefectSheetStore.DefectSheets;
});

const sheetsEformInterim = computed(() => {
  return defectSheetInterimStore.DefectSheets;
});

const defectList = computed(() => {
  return [
    {
      name: "Digital Service Forms",
      list: sheetsEform.value,
      options: defectSheetStore.DefectOptions
    },
    {
      name: "Interim Engine Service Forms",
      list: sheetsEformInterim.value,
      options: defectSheetInterimStore.DefectOptions
    },
    {
      name: "Component Intervention Forms",
      list: sheetsIntervention.value,
      options: interventionDefectSheetStore.DefectOptions
    },
  ] as ListDefectSheet[]
});

/* event handlers */
const onItemClickEform = (id: string) => {
  defectSheetStore.setSelectedDefect(id);
  store.reset();
  redirectByLink('/ironforms/defects/detail-planner');
}

const onItemClickEformInterim = (id: string) => {
  defectSheetInterimStore.setSelectedDefect(id);
  interimStore.reset();
  redirectByLink('/ironforms/defects/interim-planner');
}

const onItemClickIntervention = (id: string) => {
  interventionDefectSheetStore.setSelectedDefect(id);
  interventionStore.reset();
  redirectByLink('/ironforms/defects/intervention-planner');
}

const defectItemClick = (item) => {
  if (item.name == defectList.value[0].name) {
    onItemClickEform(item.item.dailyScheduleId)
  } else if (item.name == defectList.value[1].name) {
    onItemClickEformInterim(item.item.dailyScheduleId)
  } else {
    onItemClickIntervention(item.item.interventionId)
  }
}

const employeeId = computed(() => {
  let id = ''
  if (!isUndefined(authStore.user.EmployeeId)) {
    id = authStore.user.EmployeeId
  }
  return id
})

watch(employeeId, async (newVal) => {
  if (newVal != "" && employeeId.value != undefined) {
    await getData()
  }
})

/* life cycles */
onBeforeMount(async () => {
  if (employeeId.value != "" && employeeId.value != undefined) {
    await getData()
  }
});

const getData = async () => {
  loading.value = true;
  const loader = ElLoading.service({
    lock: true,
    text: 'Loading Defect List planner',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  await listStore.getPositionDMA();
  await defectSheetStore.getDefectListsPlanner();
  await defectSheetInterimStore.getDefectListsPlanner();
  await interventionDefectSheetStore.getDefectListsPlanner();
  loader.close();
  loading.value = false;
}

</script><style lang="scss" scoped>
@import "@/assets/sass/pages/defect-review.scss";
</style>

