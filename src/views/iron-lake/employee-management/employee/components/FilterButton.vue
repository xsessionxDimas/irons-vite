<template>
  <el-popover
    placement="bottom"
    :width="360"
    trigger="click"
    :visible="visible"
  >
    <template #reference>
      <button
        class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md m-0"
        @click="handleFilterClicked"
      >
        <icon name="filter" size="24" />
        Filter
      </button>
    </template>
    <template #default>
      <div class="p-2 d-flex flex-column gap-8">
        <section>
              <p class="m-0 popover-title">Filters</p>
            </section>
        <section class="d-flex flex-column gap-8">
          <el-form
            label-position="top"
            class="ironlake-form d-flex flex-column gap-6"
          >
            <el-form-item>
              <template #label>
                <span>Name</span>
              </template>
              <el-input
                v-model="data.name"
                placeholder="Name"
                @input="(value) => (data.name = value)"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="Position">
              <el-select
                v-model="data.positionId"
                placeholder="Select Position"
                clearable
                filterable
              >
                <el-option
                  v-for="item in roles"
                  :key="item.value"
                  :label="item.label !== '' ? item.label : ' '"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Company">
              <el-select
                v-model="data.company"
                placeholder="Select Company"
                clearable
                filterable
              >
                <el-option
                  v-for="item in companies"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Site">
              <el-select
                v-model="data.siteId"
                placeholder="Select Site"
                clearable
                filterable
                :disabled="userDetail.isHO === 0"
                @change="handleSiteChange"
              >
                <el-option
                  v-for="item in sites"
                  :key="item.value"
                  :label="item.label !== '' ? item.label : ' '"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Vendor">
              <el-select
                v-model="data.vendorId"
                placeholder="Select Vendor"
                clearable
                filterable
              >
                <el-option
                  v-for="item in vendor"
                  :key="item.value"
                  :label="item.label !== '' ? item.label : ' '"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Supervisor">
              <el-select
                v-model="data.supervisorId"
                placeholder="Select Supervisor"
                clearable
                filterable
              >
                <el-option
                  v-for="item in supervisors"
                  :key="item.value"
                  :label="item.label !== '' ? item.label : ' '"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span>Email</span>
              </template>
              <el-input
                v-model="data.email"
                placeholder="Email"
                @input="(value) => (data.email = value)"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="Status">
              <el-select
                v-model="data.isActive"
                placeholder="Select Status"
                filterable
              >
                <el-option
                  v-for="item in isActive"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </section>
        <section class="d-flex justify-content-end gap-3">
              <button
                class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md me-auto"
                @click="onReset"
              >
                Reset
              </button>
              <button
                class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md"
                @click="handleCloseFilter"
              >
                Close
              </button>
              <button
                class="btn btn-btech-secondary btech-md"
                @click="onClick"
              >
                Apply
              </button>
            </section>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import {
  computed,
  defineEmits,
  ref
} from "vue";
import Icon from "@/components/ironlake/Icon.vue";
import {
  useEmployeeListStore
} from "@/store/pinia/administration/organization-unit/employee/useEmployeeListStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { Option } from "element-plus/lib/el-select-v2/src/select.types";
import {
  FilterData
} from "@/core/types/entities/administration/organization-unit/employee/FilterData";

const listStore = useEmployeeListStore();
const authStore = useAuthenticationStore();

const userDetail = computed(() => {
  return authStore.user;
});
const data = ref<FilterData>({
  employeeId: "",
  company: "",
  name: "",
  email: "",
  positionId: null,
  siteId: userDetail.value.isHO === 1 ? "" : userDetail.value.Location,
  vendorId: null,
  supervisorId: "",
  isActive: "",
  ver: "v1",
  page: 1,
  pageSize: 20,
});
defineExpose({
  data
})
const companies = ref([
  { value: "BUMA AU", label: "BUMA AU" },
  { value: "EXTERNAL", label: "EXTERNAL" },
]);
const isActive = ref([
  { value: "", label: "All" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
]);
const rolesExternal = ref([{ value: "Serviceman", label: "Serviceman" }]);

const roles = computed(() => {
  if (data.value.company.toLocaleLowerCase() === "external") {
    return rolesExternal.value;
  } else {
    return listStore.statePositionOption;
  }
});
const sites = computed(() => {
  if (userDetail.value.isHO === 1) {
    return listStore.stateLocationOption;
  } else {
    const site = [] as Option[];
    site.push({
      label: userDetail.value.Location,
      value: userDetail.value.SiteId,
    });
    return site
  }
});
const vendor = computed(() => {
  return listStore.stateVendorOptionFilter;
});
const supervisors = computed(() => {
  return listStore.stateDirectSupervisor;
});
const visible = ref(false);
const handleSiteChange = (value: string) => {
  data.value.supervisorId = "";
  listStore.getLookupDirectSupervisor(value);
  data.value.siteId = value;
};
const handleFilterClicked = () => {
  listStore.getLookupLocation()
  data.value.siteId = userDetail.value.isHO === 0 ? userDetail.value.SiteId : listStore.stateLastUsedFilterData.siteId;
  data.value.company = listStore.stateLastUsedFilterData.company;
  data.value.vendorId = listStore.stateLastUsedFilterData.vendorId;
  data.value.positionId = listStore.stateLastUsedFilterData.positionId;
  data.value.supervisorId = listStore.stateLastUsedFilterData.supervisorId;
  data.value.email = listStore.stateLastUsedFilterData.email;
  data.value.name = listStore.stateLastUsedFilterData.name;
  data.value.isActive = listStore.stateLastUsedFilterData.isActive;
  visible.value = !visible.value
};

const handleCloseFilter = () => {
  data.value.siteId = userDetail.value.isHO === 0 ? userDetail.value.SiteId : listStore.stateLastUsedFilterData.siteId;
  data.value.company = listStore.stateLastUsedFilterData.company;
  data.value.vendorId = listStore.stateLastUsedFilterData.vendorId;
  data.value.positionId = listStore.stateLastUsedFilterData.positionId;
  data.value.supervisorId = listStore.stateLastUsedFilterData.supervisorId;
  data.value.email = listStore.stateLastUsedFilterData.email;
  data.value.name = listStore.stateLastUsedFilterData.name;
  data.value.isActive = listStore.stateLastUsedFilterData.isActive;
  visible.value = !visible.value
}

const emit = defineEmits(["applyFilter"]);
const onClick = () => {
  emit("applyFilter", data);
};
const onReset = () => {
  listStore.getLookupDirectSupervisor(userDetail.value.isHO === 0 ? userDetail.value.Location : "");
  data.value.company = "";
  data.value.vendorId = null
  data.value.positionId = null;
  data.value.supervisorId = "";
  data.value.siteId = userDetail.value.isHO === 0 ? userDetail.value.SiteId : "";
  data.value.email = "";
  data.value.name = "";
  data.value.isActive = "";
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/core/components/mixins/_typography.scss";

.card-table-title {
  @include heading-h6();
  font-weight: 700;
}

.ironlake-input {
  position: relative;
  display: flex;
  line-height: unset;

  :deep(.el-input__inner) {
    padding: 0.5rem 0.75rem;
    padding-left: calc(0.75rem + 1.25rem + 0.75rem);
    font-family: "Public Sans";
    font-size: 0.875rem !important;
    line-height: 1.25rem;
    height: fit-content;
  }

  &::before {
    content: url("../../../../../../public/media/icons/bumaau/search.svg");
    position: absolute;
    top: 0.5rem;
    left: 0.75rem;
    display: inline-flex;
    width: 1.25rem;
    height: 1.25rem;
  }
}

.ironlake-table-toolbar {
  :deep(.el-range-editor) {
    &.el-input__inner {
      padding: 0.5rem 1rem;
      height: unset;
      width: 200px;
      min-height: 0;
      min-width: 200px;

      .el-input__icon {
        line-height: 1.25rem;
        margin: 0;
        color: #01a3ff;

        &.el-range__close-icon {
          display: none;
        }

        &.el-icon-date {
          margin-right: 0.5rem;
          padding: 0;
        }
      }

      &:hover {
        .el-range-input {
          background-color: #e6f6ff;
        }
      }

      .el-range-input {
        height: 1.25rem;
        width: 100%;
        color: #01a3ff;
        font-size: 0.875rem !important;
        line-height: 1.25rem;

        &:hover {
          background-color: #e6f6ff;
        }
      }

      .el-range-separator {
        padding: 0;
        color: #01a3ff;
        line-height: 1.25rem;
        height: auto;
      }
    }
  }
}

.ironlake-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  min-height: 0;
  font-family: "Public Sans";
  font-size: 0.875rem;
  // font-weight: 600;
  line-height: 1.25rem;
}

.popover-title {
  @include paragraph-lg();
  font-weight: 700;
}

.ironlake-form {
  :deep(.el-form-item) {
    margin: 0;
    label {
      padding: 0;
      margin-bottom: 0.375rem;
      @include paragraph-sm();
      font-weight: 700;
    }
    .el-form-item__content {
      .el-input {
        .el-input__inner {
          border-radius: 8px;
          padding: 0.375rem 0.625rem;
          @include paragraph-sm();
        }
      }
      .el-select {
        width: 100%;
        .select-trigger {
          width: 100%;
        }
      }
    }
  }
}
</style>
