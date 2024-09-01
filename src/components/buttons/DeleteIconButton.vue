<template>
  <el-tooltip
    class="box-item"
    effect="dark"
    :content="translate('DELETE', t, te)"
    placement="top"
  >
    <div
      v-if="isDialog"
      class="btn btn-small btn-icon duotune-icon px-2 my-5"
      @click="handleModalToggle"
    >
      <span class="svg-icon svg-icon-1x">
        <inline-svg src="/media/svg/tables/delete-icon-button.svg" />
      </span>
    </div>
    <div
      v-else
      class="btn btn-small btn-icon duotune-icon px-2 my-5"
      :class="{ disabled: isDisabled, hideBtn: isHide }"
      @click="showDialog"
    >
      <a
        href="javascript:void(0)"
        @click="changePage"
        :disabled="isDisabled"
        class="d-flex align-items-center"
        v-if="routeName"
      >
        <span class="svg-icon svg-icon-1x">
          <inline-svg src="/media/svg/tables/delete-icon-button.svg" />
        </span>
      </a>
      <span class="svg-icon svg-icon-1x" v-else>
        <inline-svg src="/media/svg/tables/delete-icon-button.svg" />
      </span>
    </div>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { Mutations } from "@/store/enums/PageEnum";
import { translate } from "@/core/helpers/language";
import { useI18n } from "vue-i18n";

export default defineComponent({
  props: {
    routeName: String,
    isDisabled: Boolean,
    isHide: Boolean,
    isDialog: Boolean,
  },
  emits: ["show-dialog"],
  setup(props, { emit }) {
    const store = useStore();
    const { t, te } = useI18n();
    const changePage = () => {
      store.commit(Mutations.SET_PAGE, props.routeName);
    };
    const handleModalToggle = () => {
      emit("show-dialog", null);
    };
    const showDialog = () => {
      emit("show-dialog");
    };
    return {
      changePage,
      handleModalToggle,
      translate,
      t,
      te,
      showDialog,
    };
  },
});
</script>

<style lang="scss" scoped>
.disabled {
  opacity: 1;
  &:hover {
    cursor: not-allowed;
  }
}
.hideBtn {
  display: none;
}
</style>
