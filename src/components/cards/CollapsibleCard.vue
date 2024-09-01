<template>
    <div class="mt-5 ps-0">
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="equipmentInformationTitleCollapsible">
            <el-collapse-item :title="equipmentInformationTitleCollapsible" name="equipmentInformationTitleCollapsible">
                <div class="d-flex flex-row justify-content-between">
                    <div class="p-2 d-flex flex-row flex-grow-1 bd-highlight">
                        <div class="row w-100">
                            <div class="col-6">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" disabled value="HDKM7819">
                                    <label for="floatingInput">Work Order</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" placeholder="Machine SMU">
                                    <label for="floatingInput2" class="text-nowrap">Machine SMU</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-2 bd-highlight">Flex item 3</div>
                </div>
                <div class="p-2 me-0">
                    <div class="row" style="width:101%">
                        <div class="col-4 pe-0">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" disabled value="HDKM7819">
                                <label for="floatingInput">Unit Number</label>
                            </div>
                        </div>
                        <div class="col-4 pe-0">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" disabled value="HDKM7819">
                                <label for="floatingInput">Actual Service Start</label>
                            </div>
                        </div>
                        <div class="col-4 pe-0">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" disabled value="HDKM7819">
                                <label for="floatingInput">Actual Service Finish</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-2 me-0">
                    <div class="row" style="width:101%">
                        <div class="col-12 pe-0">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" disabled value="e-FORM CAT 777F 2000 Hr Service">
                                <label for="floatingInput">Form</label>
                            </div>
                        </div>
                    </div>
                </div>
                <h4 class="subtitle ps-3">Service Labour Personnel</h4>
                <div class="p-2 me-0">
                    <div class="row" style="width:101%">
                        <div class="col-12 pe-0">
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Floating label select example" placeholder="Select Name">
                                    <option selected disabled>Select name</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                                <label for="floatingInput">Name</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-2 me-0">
                    <div class="row" style="width:101%">
                        <div class="col-6 pe-0">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" disabled value="HDKM7819">
                                <label for="floatingInput">Actual Service Start</label>
                            </div>
                        </div>
                        <div class="col-6 pe-0">
                            <div class="mb-3">
                                <input type="text" class="form-control no-float" disabled value="HDKM7819">
                            </div>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const equipmentInformationTitleCollapsible = ref('Equipment Information')
</script>

<style scoped>
    .form-control,.form-select {
        color: #919EAB;
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
        font-weight: 700;
        font-size: 14px;
        line-height: 22px;
    }

    .no-float {
        height: 48px;
    }

    @media only screen and (max-width: 767px) {
        .no-float {
            height: 44px;
        }
    }
</style>
