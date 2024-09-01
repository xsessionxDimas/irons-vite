e<template>
  <div class="row grouping-by-status">
    <div class="col-10">
      <el-menu
        :default-active="selectedHeader"
        class="el-menu-demo d-flex flex-wrap"
        mode="horizontal"
        background-color="#2D2B39"
        text-color="#fff"
        active-text-color="#18AF4A"
        @select="handleSelect"
      >
        <el-menu-item v-for="header in headerList" :key="header" :index="header.label">
          <span v-if="header.label === 'Declined'" style="font-size: 12px;" class="text-white vertical-line"> {{ header.label }} ({{ header.total }})</span>
          <span v-else style="font-size: 12px;" class="text-white">{{ header.label }} ({{ header.total }})</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="col-2 d-flex justify-content-between align-items-center">
      <div></div> <!-- Untuk membuat spasi di sisi kiri -->
      <em class="fa" :class="caretClass" style="color: white;font-size: 1.2em;cursor: pointer;" @click="toggleClick"></em>
    </div>
  </div>
  <div v-if="!toggle">
    <ListGroup
      :loading="isLoading"
      :dataList="dataList"
      @onItemClick="onItemSelected"
      @onBackToList="onBackToList"
    />
  </div>
  </template>

<script lang="ts" setup>
import {
  computed,
  ref,
  onMounted,
  defineEmits
} from 'vue';
import {
  useInterventionListStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionListStore";
import {
  useInterventionFormStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionFormStore";
import ListGroup from "./ListGroup.vue"

import {
  checkSignInStatus,
} from "@/core/helpers/get-user-info"
import { useMsal } from '@/msal/api/useMsal';


const emits = defineEmits(["onBackToList"]);
const { instance } = useMsal()


const listStore = useInterventionListStore();
const formStore = useInterventionFormStore();

const headerList = computed(() => {
  return listStore.headerList;
});
const dataList = computed(() => {
  return listStore.headerListItems;
});

const selectedHeader = computed(() => {
  return listStore.selectedHeader;
});
const isLoading = computed(() => {
  return listStore.loadingHeader;
});

const isSelected = computed({
  get() {
    return listStore.isSelectedItem
  },
  // setter
  set(newValue) {
    listStore.setIsSelectedItem(newValue)
  }
});

const caretClass = ref("fa-chevron-down");
const toggle = ref(false);

onMounted(async () => {
  await checkSignInStatus(instance); // solution for location get undefined in param site when mounted, because location store not set early.
  await listStore.setHeaderDeclined('Declined', 1, true)
  if (selectedHeader.value == "Pending Evaluation") {
    await listStore.setHeaderChange("Pending Evaluation");
  }
})

const handleSelect = async (key: string) => {
  isSelected.value = false;
  listStore.resetAllList();
  formStore.resetFormIntervention();
  listStore.setSelectedHeader(key);
  if (key === 'Declined') {
    await listStore.setHeaderDeclined(key, 1);
  } else {
    await listStore.setPage(1);
  }
}

const onItemSelected = async (item) => {
  listStore.setSelectedHeaderItem(item)
  formStore.resetGeneric()
  await formStore.getDataFromKeyPbi(item.keyPbi)
}
const onBackToList = async () => {
  listStore.resetAllList();
  formStore.resetFormIntervention();
  formStore.resetGeneric(true)
  emits('onBackToList')
}
const toggleClick = () => {
  toggle.value = !toggle.value;
  if (toggle.value) {
    caretClass.value = "fa-chevron-up";
  } else {
    caretClass.value = "fa-chevron-down";
  }
}
</script>

<style lang="scss">
  .grouping-by-status {
    overflow: hidden;
    .el-menu{
      &.el-menu--horizontal {
        border-bottom: none;
      }
    }
    .el-menu-item {
      &.is-active {
        border-color: #18AF4A;
      }
    }
  }
  .vertical-line {
    border-left: 1px solid white;
    // margin-left: 10px; /* Adjust the distance from the left as needed */
    padding-left: 10px; /* Adjust the distance from the left as needed */
  }
</style>

