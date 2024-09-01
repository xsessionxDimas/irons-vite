<template>
  <div class="list-group ps-0 mt-5 mb-3">
    <div v-if="!isSelected" class="d-flex flex-column">
      <template v-if="dataList.length > 0">
        <div class="d-flex my-2 align-items-center" >
          <div style="width: 100%;" class="d-flex my-2 align-items-center">
            <el-select
            style="width: 100%;"
            filterable
            remote
            reserve-keyword
            v-model="searchItems"
            placeholder="Search component intervention forms"
            :remote-method="handleSearchItems"
            :loading="loadingSearch"
            @change="handleSelectItemSearch"
            :persistent="false"
            @blur="onBlurSearch"
            size="large">
            <template #prefix>
              <em class="fa fa-search me-1 ms-3"></em>
            </template>
            <el-option v-for="item in searchOption" :key="item.workOrder" :value="item">
              <template #default>
                <div class="d-flex justify-content-between">
                  <span class="label ms-5 intervention-label">
                  {{item.equipmentNumber}} - {{ item.brand }} {{ item.model }} - <span :class="getTextColorClass(item.interventionCode)">
                    {{ item.interventionCode }} {{ item.componentGroup ? ` - ${item.componentGroup}` : ""  }}
                  </span> {{ item.workOrder ? ` - ${item.workOrder}` : "" }} </span>
                  <span class="label item__timestamp">
                    {{ item.interventionDate ?  formatDate(item.interventionDate) : '' }}
                  </span>
                </div>
              </template>
            </el-option>
            </el-select>
          </div>
        </div>

        <div v-if="(searchOption.length == 0 && !isNoData)  && !isSelected ">
          <div v-loading="loading"  element-loading-background="#2d2b39b3">
            <template v-for="item in dataList" :key="item.workOrder">
              <div class="item d-flex flex-fill my-2 align-items-center" @click="onItemClick(item)">
                <div class="d-flex flex-column w-100">
                  <div class="d-flex justify-content-between">
                    <div>
                      <span class="label ms-5 intervention-label">
                        {{item.equipmentNumber}} - {{ item.brand }} {{ item.model }} - <span :class="getTextColorClass(item.interventionCode)">
                          {{ item.interventionCode }} {{ item.componentGroup ? ` - ${item.componentGroup}` : ""  }}
                        </span> {{ item.workOrder ? ` - ${item.workOrder}` : "" }}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span class="label item__timestamp">
                    {{ item.interventionDate ?  formatDate(item.interventionDate) : '' }}
                  </span>
                </div>
              </div>
            </template>
          </div>

          <template v-if="dataList.length > 0">
            <pagination
              :customClassPagination="'custom-pagination'"
              @raise-page-change="handlePaginationChange($event)"
              :class-custom="customPagination"
              :currentPage="pagination.currentPage"
              :totalPage="pagination.totalPage"
              :totalPageSize="pagination.totalPageSize"
              :startPaginationIndex="pagination.startPaginationIndex"
              :endPaginationIndex="pagination.endPaginationIndex" />
          </template>
        </div>
      </template>
      <template v-else>
        <!-- <template> -->
        <div class="d-flex justify-content-center mt-8">
          <template v-if="!loading">
            <h5 style="color: #FFFF">No Data Display</h5>
          </template>
          <template v-else>
            <div v-loading="loading"  element-loading-background="#2d2b39b3"></div>
          </template>
        </div>
      </template>
    </div>
    <div v-else class="d-flex flex-column">
      <div class="pb-2">
        <el-button text class="dark-btn" @click="backToList">
          <inline-svg src="/media/icons/bootstrap-icon/arrow-left-short.svg" width="36" height="36" fill="white" />
          Item selected
        </el-button>
      </div>
      <div class="item d-flex flex-fill my-2 align-items-center">
        <div class="d-flex flex-column w-100">
          <div class="d-flex justify-content-between">
            <div>
              <span class="label ms-5 intervention-label">
                {{selectedItem.equipmentNumber}} - {{ selectedItem.brand }} {{ selectedItem.model }} - <span :class="getTextColorClass(selectedItem.interventionCode)">
                  {{ selectedItem.interventionCode }} {{ selectedItem.componentGroup ? ` - ${selectedItem.componentGroup}` : ""  }}
                </span> {{ selectedItem.workOrder ? ` - ${selectedItem.workOrder}` : "" }}
              </span>
            </div>
            <div>
              <span class="label item__timestamp">
                {{ selectedItem.interventionDate ?  formatDate(selectedItem.interventionDate) : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  defineProps,
  defineEmits,
  watch,
  computed
} from "vue";
import Pagination from "@/components/pager/Pagination.vue";
import PaginationType from "@/core/types/misc/Pagination";

import {
  useInterventionListStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionListStore";

import {
  useInterventionFormStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionFormStore";

import {
  simpleFormatIntShort,
} from "@/core/helpers/date-format";


const listStore = useInterventionListStore();
const formStore = useInterventionFormStore();


const props = defineProps({
  dataList: {
    required: true,
    type: Object,
  },
  loading: {
    required: true,
    type: Boolean,
  },
});

const emits = defineEmits(["onItemClick", "onBackToList"]);

const loadingSearch = ref<boolean>(false);
const searchItems = ref(null);
const querySearch = ref("");
const pagination = computed((): PaginationType => {
  return listStore.pagination;
});
const customPagination = ref("custom-pagination");
const isSelected = computed({
  get() {
    return listStore.isSelectedItem
  },
  // setter
  set(newValue) {
    listStore.setIsSelectedItem(newValue)
  }
});
const selectedItem = computed(() => {
  return listStore.selectedHeaderItem;
})
const isNoData = computed(() => {
  return listStore.searchOption.length == 0 && querySearch.value
})
const searchOption = computed({
  get() {
    return listStore.searchOption
  },
  // setter
  set(newValue) {
    listStore.stateSearchOptions = newValue
  }
});

watch(
  () => {
    return props.dataList;
  },
  (newVal) => {
    isSelected.value = false;
  },
);

/* ref */

const handlePaginationChange = (newPage: number) => {
  listStore.setPage(newPage);
}

/* event handlers */
const formatDate = (date) => {
  const auDateFormat = simpleFormatIntShort(date, "YYYY-MM-DD HH:mm:ss", "DD.MM.YYYY")
  return auDateFormat;
}
const onItemClick = (item) => {
  formStore.setIsFromEquipment(false);
  isSelected.value = true;
  emits("onItemClick", item);
};
const handleSelectItemSearch = (item) => {
  formStore.setIsFromEquipment(false);
  isSelected.value = true;
  searchOption.value = [];
  emits("onItemClick", item);
}
const handleSearchItems = async (query) => {
  if (query) {
    loadingSearch.value = true;
    await listStore.searchItems(query)
    loadingSearch.value = false;
    querySearch.value = query
  } else {
    querySearch.value = ""
    searchOption.value = []
  }
};

const backToList = () => {
  isSelected.value = false;
  searchItems.value = null;
  searchOption.value = [];
  emits("onBackToList")
}
const onBlurSearch = async () => {
  querySearch.value = "";
  setTimeout(() => {
    searchOption.value = [];
  }, 300)
}

const getTextColorClass = (interventionCode = "") => {
  const code = interventionCode ? interventionCode.toLowerCase() : ""
  if (code.includes("normal")) {
    return "text-normal-inv"
  } else if (code.includes("caution")) {
    return "yellow"
  } else {
    return "text-critical"
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/pages/ironportal-monitoring.scss";
@import "@/assets/sass/pages/intervention-label.scss";
</style>

<style lang="scss">
.list-group {
  .option-wrapper {
    position: absolute;
    top: 50px;
    left: 10px;
    width: calc(100% - 24px);
  }

  .el-collapse-item__wrap {
    overflow: visible !important;
  }

  .download-icon {
    &.icon- {
      &red {
        filter: invert(16%) sepia(51%) saturate(7200%) hue-rotate(355deg) brightness(98%) contrast(118%);
      }

      &green {
        filter: invert(74%) sepia(57%) saturate(6500%) hue-rotate(103deg) brightness(93%) contrast(81%);
      }
    }
  }
}

.count-badge {
  background-color: #dc1641;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 10px;
  font-size: 12px;
  color: white;
}
.dark-btn.el-button{
  background: #2D2B39 !important;
  color: white !important;
  border: 0px;
  padding: 0px 1px !important
}
.custom-pagination.el-pager li {
  color: #FFFFFF !important;
}
.custom-pagination.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #18AF4A !important;
}
.custom-pagination.el-pagination.is-background .btn-next:not(:disabled):hover, .el-pagination.is-background .btn-prev:not(:disabled):hover {
    padding: 0;
    background-color: #18AF4A !important;
    color: #FFFFFF !important;
}
.el-pagination.is-background .el-pager li:hover {
    background: transparent;
    color: #18AF4A !important;
}
</style>
