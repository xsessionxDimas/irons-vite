<template>
  <div class="d-flex justify-content-between">
    <template v-for="group in groups" :key="group.id">
      <div class="d-flex flex-column m-1 mb-3 stepper-button">
        <div
          class="box-menu text-center p-2 d-flex justify-content-center align-items-center stepper-title"
          :class="[classGenerator(group.groupName)]"
          @click="handleChangeSelectedGroup(group.groupName)"
        >
          <span>{{ group.subGroup[0].name }}</span>
        </div>

        <!-- SHOW TASK INFORMATION -->
        <div
          v-if="infoVisible"
          class="text-center box-pill rounded-pill mt-2 mb-4 stepper-button-info w-100 py-2 cursor-pointer"
          :class="[classGenerator(group.groupName)]"
          @click="handleGoToUnfilledTask()"
        >
          <p class="mb-0">Done 0/0</p>
        </div>
      </div>
    </template>
    <div>
      <button
        class="border-0 mt-10 align-items-center"
        @click="toggleInfoVisibility"
        style="background: transparent"
      >
        <em class="fa" :class="chevronClass"></em>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Group } from "@/core/types/generate-service-sheet/Group";
import {
  useJSONStore
} from "@/store/pinia/dma/generate-service-sheet/useJSONStore";
import { defineProps, PropType, ref } from "vue";

const props = defineProps({
  groups: {
    type: Array as PropType<Group[]>,
    default() {
      return [];
    },
  },
  activeGroup: {
    type: Object as PropType<Group>,
    required: true,
  },
});

const store = useJSONStore();

const chevronClass = ref("fa-chevron-up");
const infoVisible = ref(true);

const handleChangeSelectedGroup = (groupName: string) => {
  store.setTaskGroup(groupName);
};

const handleGoToUnfilledTask = () => {
  // is this needed as well ?
};

const classGenerator = (groupName: string) => {
  return props.activeGroup?.groupName == groupName ? "active" : "";
};

const toggleInfoVisibility = () => {
  infoVisible.value = !infoVisible.value;
  chevronClass.value = infoVisible.value ? "fa-chevron-up" : "fa-chevron-down";
};
</script>

<style scoped>
.box-menu {
  min-height: 80px;
  background: #dfe3e8;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  height: 100%;
}
.box-pill {
  background: #dfe3e8;
  font-size: 12px;
}

.disabled {
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed !important;
}

.active {
  background: #01a3ff;
  color: white;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
