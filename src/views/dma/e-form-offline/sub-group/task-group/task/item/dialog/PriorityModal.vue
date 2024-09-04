<template>
    <el-dialog v-model="showDialog"
    title='Select defect priority'
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="defect-priority-dialog"
    :width="dialogSize" :show-close="false" @closed="onFormClosed"
        top="30vh" :center="true">
        <div id="priority-wrapper">
           <div class="row p-3 m-1 priority-container" style="background: #f4f6f8; border-radius: 8px">
                <div class="col-3">Priority</div>
                <div class="col-6">Action</div>
                <div class="col-3 text-break">Person Responsible</div>
            </div>
            <div class="row p-3 m-1 priority-container">
                <div class="col-3">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" v-model="priority" value="P1"
                            @change.prevent="onPriorityChange" />
                        <label class="form-check-label"> (P1) Immediate </label>
                    </div>
                </div>
                <div class="col-6 word-breaker">
                    Shall shut machine down and undertake repairs.
                </div>
                <div class="col-3 text-break">Maintenance Supervisor</div>
            </div>
            <div class="row p-3 m-1 priority-container">
                <div class="col-3">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" v-model="priority" value="P2"
                            @change.prevent="onPriorityChange" />
                        <label class="form-check-label"> (P2) Urgent </label>
                    </div>
                </div>
                <div class="col-6 word-breaker">Shall complete within 7 days.</div>
                <div class="col-3 text-break">Maintenance Supervisor</div>
            </div>
            <div class="row p-3 m-1 priority-container">
                <div class="col-3">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" v-model="priority" value="P3"
                            @change.prevent="onPriorityChange" />
                        <label class="form-check-label"> (P3) Routine </label>
                    </div>
                </div>
                <div class="col-6 word-breaker">Shall complete within 60 days.</div>
                <div class="col-3 text-break">Maintenance Planner</div>
            </div>
            <div class="row p-3 m-1 priority-container">
                <div class="col-3">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" v-model="priority" value="P4"
                            @change.prevent="onPriorityChange" />
                        <label class="form-check-label"> (P4) Monitor </label>
                    </div>
                </div>
                <div class="col-6 word-breaker">
                    Shall continue to inspect and monitor for 90 days.
                </div>
                <div class="col-3 text-break">Maintenance Planner</div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer" style="display:block; text-align:right">
                <el-button @click="handleClose" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">Cancel</el-button>
                <el-button class="button-OK-confirmation" type="success" @click.prevent="handleSubmit" style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Continue</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import {
  PriorityEmitParam
} from "@/views/dma/e-form-offline/types/PriorityEmitParam";
import { ref, computed } from "@vue/reactivity";
import { defineProps, defineEmits } from "vue";

const props = defineProps(["show"]);

// eslint-disable-next-line func-call-spacing
const emits = defineEmits<{
  (event: 'close'): void
  (event: 'submit', params: PriorityEmitParam): void
}>()

// refs
const priority = ref("P1");

// computeds

const dialogSize = computed(() => {
  return "70%";
});

const showDialog = computed(() => {
  return props.show;
});

// methods
const handleSubmit = () => {
  emits("submit", {
    priority: priority.value,
    callback: undefined
  });
};

const onPriorityChange = (event) => {
  priority.value = event.target.value;
};

const handleClose = () => {
  emits("close");
};

const onFormClosed = () => {
  priority.value = "P1";
};
</script>

<style lang="scss">
@import "@/assets/sass/pages/defect.form.scss";
.defect-priority-dialog {
    span {
        font-size: 1.2rem;
    }
    .el-dialog__title {
        font-size: 18px  !important;
        font-weight: 800  !important;
    }
}
</style>
