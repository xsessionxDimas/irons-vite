<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-4 my-4">
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.MenuName"
          :value-to="filterData.MenuNameTo"
          label="Menu Name"
          :options="listStore.MenuNameOption"
          @handle-change-from="onMenuNameSelected"
          @handle-change-to="onMenuNameSelectedTo"
       />
      </div>
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.PageName"
          :value-to="filterData.PageNameTo"
          label="Page Name"
          :options="listStore.pageNameOption"
          @handle-change-from="onPageNameSelected"
          @handle-change-to="onPageNameSelectedTo"
       />
      </div>
      <!-- <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.Icon"
          :value-to="filterData.IconTo"
          label="Icon"
          :options="listStore.iconOption"
          @handle-change-from="onIconSelected"
          @handle-change-to="onIconSelectedTo"
       />
      </div> -->
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.MenuType"
          :value-to="filterData.MenuTypeTo"
          label="Menu Type"
          :options="listStore.menuTypeOption"
          @handle-change-from="onMenuTypeSelected"
          @handle-change-to="onMenuTypeSelectedTo"
       />
      </div>
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.Level"
          :value-to="filterData.LevelTo"
          label="Level"
          :options="listStore.levelOption"
          @handle-change-from="onLevelSelected"
          @handle-change-to="onLevelSelectedTo"
       />
      </div>
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.Sequence"
          :value-to="filterData.SequenceTo"
          label="Sequence"
          :options="listStore.sequenceOption"
          @handle-change-from="onSequenceSelected"
          @handle-change-to="onSequenceSelectedTo"
       />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <SwitchInput
          :value="filterData.IsChild"
          label="Is Child"
          name="isChild"
          @handle-change="onIsChildSelected" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <SwitchInput
          :value="filterData.IsMenu"
          label="Is Menu"
          name="IsMenu"
          @handle-change="onIsMenuSelected" />
      </div>
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.ParentId"
          :value-to="filterData.ParentIdTo"
          label="Parent Id"
          :options="listStore.parentIdOption"
          @handle-change-from="onParentIdSelected"
          @handle-change-to="onParentIdSelectedTo"
       />
      </div>
      <div class="w-100 fv-row fv-plugins-icon-container">
        <AutoComplete
          :value-from="filterData.Section"
          :value-to="filterData.SectionTo"
          label="Section"
          :options="listStore.sectionOption"
          @handle-change-from="onSectionSelected"
          @handle-change-to="onSectionSelectedTo"
       />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="secondary" @click="handleReset">Reset</el-button>
        <el-button type="primary" @click="handleFilterClick">Filter</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import AutoComplete from "@/components/inputs/range-inputs/AutoComplete.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from "vue";
import {
  useMenuListStore
} from "@/store/pinia/administration/user-management/menu/useMenuListStore";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/menu/FilterData";
import SwitchInput from "@/components/inputs/SwitchInput.vue";

/* stores */
const listStore = useMenuListStore();
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close"]);

/* refs*/
const isVisible = toRef(props, "visibility");
const filterData: ComputedRef<FilterData> = computed(() => {
  return listStore.filterData;
});

/* handlers */
const handleReset = () => {
  handleCloseModal();
  listStore.resetFilter();
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onMenuNameSelected = (value: string) => {
  listStore.setMenuName(value);
};
const onPageNameSelected = (value: string) => {
  listStore.setPageName(value);
};
const onIconSelected = (value: string) => {
  listStore.setIcon(value);
};
const onMenuTypeSelected = (value: string) => {
  listStore.setMenuType(value);
};
const onLevelSelected = (value: string) => {
  listStore.setLevel(value);
};
const onSequenceSelected = (value: string) => {
  listStore.setSequence(value);
};
const onIsChildSelected = (value: boolean) => {
  listStore.setIsChild(value);
};
const onParentIdSelected = (value: string) => {
  listStore.setParentId(value);
};
const onIsMenuSelected = (value: boolean) => {
  listStore.setIsMenu(value);
};
const onSectionSelected = (value: string) => {
  listStore.setSection(value);
};
const onMenuNameSelectedTo = (value: string) => {
  listStore.setMenuNameTo(value);
};
const onPageNameSelectedTo = (value: string) => {
  listStore.setPageNameTo(value);
};
const onIconSelectedTo = (value: string) => {
  listStore.setIconTo(value);
};
const onMenuTypeSelectedTo = (value: string) => {
  listStore.setMenuTypeTo(value);
};
const onLevelSelectedTo = (value: string) => {
  listStore.setLevelTo(value);
};
const onSequenceSelectedTo = (value: string) => {
  listStore.setSequenceTo(value);
};
const onParentIdSelectedTo = (value: string) => {
  listStore.setParentIdTo(value);
};
const onSectionSelectedTo = (value: string) => {
  listStore.setSectionTo(value);
};
const handleFilterClick = () => {
  const checkMenuName = listStore.lastUsedFilterData.MenuName !== listStore.filterData.MenuName;
  const checkPageName = listStore.lastUsedFilterData.PageName !== listStore.filterData.PageName;
  const checkIcon = listStore.lastUsedFilterData.Icon !== listStore.filterData.Icon;
  const checkMenuType = listStore.lastUsedFilterData.MenuType !== listStore.filterData.MenuType;
  const checkLevel = listStore.lastUsedFilterData.Level !== listStore.filterData.Level;
  const checkIsChild = listStore.lastUsedFilterData.IsChild !== listStore.filterData.IsChild;
  const checkParentId = listStore.lastUsedFilterData.ParentId !== listStore.filterData.ParentId;
  const checkIsMenu = listStore.lastUsedFilterData.IsMenu !== listStore.filterData.IsMenu;
  const checkSection = listStore.lastUsedFilterData.Section !== listStore.filterData.Section;
  const checkSequence = listStore.lastUsedFilterData.Sequence !== listStore.filterData.Sequence;
  const checkMenuNameTo = listStore.lastUsedFilterData.MenuNameTo !== listStore.filterData.MenuNameTo;
  const checkPageNameTo = listStore.lastUsedFilterData.PageNameTo !== listStore.filterData.PageNameTo;
  const checkIconTo = listStore.lastUsedFilterData.IconTo !== listStore.filterData.IconTo;
  const checkMenuTypeTo = listStore.lastUsedFilterData.MenuTypeTo !== listStore.filterData.MenuTypeTo;
  const checkLevelTo = listStore.lastUsedFilterData.LevelTo !== listStore.filterData.LevelTo;
  const checkParentIdTo = listStore.lastUsedFilterData.ParentIdTo !== listStore.filterData.ParentIdTo;
  const checkSectionTo = listStore.lastUsedFilterData.SectionTo !== listStore.filterData.SectionTo;
  const checkSequenceTo = listStore.lastUsedFilterData.SequenceTo !== listStore.filterData.SequenceTo;
  const status = checkMenuName || checkPageName || checkIcon || checkMenuType || checkLevel || checkIsChild || checkParentId || checkIsMenu || checkSequence || checkSection || checkMenuNameTo || checkPageNameTo || checkIconTo || checkMenuTypeTo || checkLevelTo || checkParentIdTo || checkSectionTo || checkSequenceTo;
  emits("handle-close", status);
};
</script>
