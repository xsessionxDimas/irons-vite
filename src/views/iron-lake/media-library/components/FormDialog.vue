<template>
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    :title="`${
      formStore.isNewForm ? 'Upload' : 'Edit'
    } Media Details`"
    modal-class="ironlake-dialog"
    :width="500"
    :align-center="true"
    :close-on-click-modal="false"
    :show-close="false"
    @close="handleCloseModal()"
    @closed="resetFormDialog()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError"
      />
    </transition>
    <!-- <Alert
      :showAlert="true"
      variant="warning"
      desc="Cannot change media with different format"
    /> -->
    <Form>
      <el-form
        ref="ruleFormRef"
        :model="formItem"
        label-position="top"
        class="ironlake-form-media-library d-flex flex-column gap-6"
      >
        <section class="container p-0" v-if="formStore.isNewForm">
          <div class="row m-0 mt-3 gap-4">
            <div class="col p-0">
              <el-form-item v-if="!formItem.Files" class="position-relative">
                <FileDropZone
                  ref="newFileDrop"
                  accept=".pdf, .jpg, .jpeg, .png, .webp"
                  error-message="Format media allowed: PDF, PNG, JPEG, JPG, WEBP"
                  @handle-upload="handleUpload"
                  :skipSizeValidation="true"
                />
                <div class="file-upload-caption">Format media allowed: PDF, PNG, JPEG, JPG, WEBP</div>
              </el-form-item>
              <template v-else>
                <div class="d-flex align-items-start gap-3">
                  <img src="/media/icons/bumaau/iron-lake/File.png" style="
                      width: 50px;
                      height: 50px;
                  " alt="file" />
                  <div>
                    <div>{{ formItem.Files.name }}</div>
                    <div class="mt-2 alert-filename" v-if="fileNameAlert">{{ fileNameAlert }}</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </section>
        <section class="container p-0">
          <div class="row m-0 gap-4">
            <div class="col p-0">
              <el-form-item>
                <template #label>
                  <span>ID</span>
                </template>
                <el-input
                  v-model="lastId"
                  :disabled="true"
                >
                </el-input>
              </el-form-item>
            </div>
          </div>
        </section>
        <section class="container p-0">
          <div class="row m-0 gap-4">
            <div class="col p-0">
              <el-form-item>
                <template #label>
                  <span class="required">Code</span>
                </template>
                <el-input
                  v-model="formItem.Code"
                  show-word-limit
                  maxlength="100"
                  placeholder="Write your code"
                  :disabled="!formStore.stateIsNewForm || (formStore.stateIsNewForm && !formItem.Files)"
                >
                </el-input>
              </el-form-item>
            </div>
          </div>
        </section>
        <section class="container p-0">
          <div class="row m-0 gap-4">
            <div class="col p-0">
              <el-form-item>
                <template #label>
                  Description
                </template>
                <el-input
                  v-model="formItem.Description"
                  type="textarea"
                  show-word-limit
                  maxlength="255"
                  placeholder="Write your description"
                  :disabled="formStore.stateIsNewForm && !formItem.Files"
                  :autosize="{ minRows: 4, maxRows: 4 }"
                  resize="none"
                >
                </el-input>
              </el-form-item>
            </div>
          </div>
        </section>
        <section class="container p-0">
          <div class="row m-0 gap-4">
            <div class="col p-0">
              <el-form-item>
                <template #label>
                  <span>Format Media</span>
                </template>
                <div>
                  {{ formItem.FileType }}
                </div>
              </el-form-item>
            </div>
          </div>
        </section>
        <section class="container p-0" v-if="!formStore.isNewForm">
          <div class="row m-0 gap-4">
            <div class="col p-0">
              <el-form-item>
                <SwitchInput
                  :value="isNeedNewMedia"
                  label="Replace Media?"
                  name="isRepalce"
                  @handleChange="handleChangeNewMediaSwicth"
                />
              </el-form-item>
            </div>
          </div>
        </section>
        <section class="container p-0" v-if="isNeedNewMedia">
          <div class="row m-0 mt-3 gap-4">
            <div class="col p-0">
              <el-form-item v-if="!formItem.Files">
                <Alert
                  v-model:show-alert="showUploadError"
                  variant="error"
                  desc="Cannot change media with different format"
                />
                <div class="position-relative">
                    <FileDropZone
                    ref="updateFileDrop"
                    accept=".pdf, .jpg, .jpeg, .png, .webp"
                    error-message="Format media allowed: PDF, PNG, JPEG, JPG, WEBP"
                    @handle-upload="handleUpload"
                    :skipSizeValidation="true"
                  />
                  <div class="file-upload-caption">Format media allowed: PDF, PNG, JPEG, JPG, WEBP</div>
                </div>
              </el-form-item>
              <template v-else>
                <div class="d-flex align-items-start gap-3">
                  <img src="/media/icons/bumaau/iron-lake/File.png" style="
                      width: 50px;
                      height: 50px;
                  " alt="file" />
                  <div>
                    <div>{{ formItem.Files.name }}</div>
                    <div class="mt-2 alert-filename" v-if="fileNameAlert">{{ fileNameAlert }}</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </section>
      </el-form>
    </Form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary"
          @click="handleCloseModal(false)"
          :disabled="formStore.loading"
          >Cancel</el-button
        >
        <el-button class="btn btn-btech-secondary" @click="handleSubmitData">
          Submit
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { toRef, computed, ref } from "vue";
import {
  useMediaLibraryFormStore
} from "@/store/pinia/iron-lake/media-library/useMediaLibraryFormStore";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import Alert from "@/components/ironlake/MetronicAlert.vue";
import FileDropZone from '@/components/upload/FileDropZone.vue';
import SwitchInput from "@/components/inputs/SwitchInput.vue";
import {
  getFileType,
  getType,
  trimFileName
} from "@/store/pinia/iron-lake/media-library/helper";
import {
  convertToWebP
} from "@/store/pinia/dma/e-form/helpers";
import { ElLoading } from 'element-plus';
import {
  ILoadingInstance
} from "element-plus/lib/el-loading/src/loading.type";

const formStore = useMediaLibraryFormStore();
const formItem = computed({
  get() {
    return formStore.stateFormItem;
  },
  set(newValue) {
    formStore.stateFormItem = newValue;
  },
});

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const isVisible = toRef(props, "visibility");
const isNeedNewMedia = ref(false)
const showUploadError = ref(false)
const loader = ref<ILoadingInstance>()
const newFileDrop = ref()
const updateFileDrop = ref()

const emits = defineEmits(["handle-close"]);
const handleCloseModal = async (isReload = false) => {
  isNeedNewMedia.value = false
  showUploadError.value = false
  emits("handle-close", isReload);
};
const resetFormDialog = () => {
  formStore.resetFormItem();
  handleResetError();
};

/* computed */
const errors = computed(() => {
  return formStore.errors;
});
const isError = computed(() => {
  return formStore.isError;
});
const lastId = computed(() => {
  if (formStore.stateIsNewForm && formItem.value.Files) {
    return formStore.lastId
  } else if (!formStore.stateIsNewForm) {
    return formItem.value.AttachmentId
  }
  return ''
})

/* validation schema */
const inputValidation = Yup.object().shape({
  Files: Yup.mixed().when(['$isNewForm', '$isNeedNewMedia'], {
    is: (isNewForm, isNeedNewMedia) => {
      return isNewForm || (!isNewForm && isNeedNewMedia)
    },
    then: Yup.mixed().required("File is required"),
    otherwise: Yup.mixed().notRequired()
  }),
  Code: Yup.string().required("Code is required"),
  // Description: Yup.string().required("Description is required"),
});

const handleSubmitData = async () => {
  await inputValidation
    .validate(formItem.value, {
      abortEarly: false,
      context: {
        isNewForm: formStore.isNewForm,
        isNeedNewMedia: isNeedNewMedia.value
      }
    })
    .then(() => {
      formStore.stateIsError = false;
    })
    .catch((error) => {
      formStore.setErrors(error.errors);
    });
  if (isError.value) return;
  formStore.insertData().then((isError) => {
    if (!isError) {
      formStore.resetFormItem();
      handleCloseModal(true);
    }
  });
};
const handleResetError = () => {
  formStore.setErrors([] as string[]);
};

const handleChangeNewMediaSwicth = (value: boolean) => {
  isNeedNewMedia.value = value
  showUploadError.value = false
  formItem.value.Files = null
}

const handleUpload = async (formData: FormData) => {
  const fileInput = formData.get("fileUpload");
  loader.value = ElLoading.service({
    lock: true,
    text: 'Uploading...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  if (fileInput instanceof File) {
    const addCompressedFile = async (file: File) => {
      try {
        const trimmedFile = trimFileName(file);
        const convertedImage = await convertToWebP(trimmedFile);
        formItem.value.Files = convertedImage.file;
      } catch (error: any) {
        formItem.value.Files = file;
      }
    };

    if (formStore.isNewForm) {
      const file = fileInput as File & { path: string; };

      if (file.type.startsWith('image/')) {
        await addCompressedFile(file);
      } else {
        formItem.value.Files = trimFileName(file)
      }

      formItem.value.FileType = file.type.startsWith('image/') ? 'webp' : getFileType(file);
    } else {
      const file = fileInput as File & { path: string; };
      const isImage = file.type.includes("image");

      if (!((getType(formItem.value.FileType.toLowerCase()) == 'Image' && isImage) || (formItem.value.FileType.toLowerCase() == getFileType(file)))) {
        showUploadError.value = true;
      } else {
        if (file.type.startsWith('image/')) {
          await addCompressedFile(file);
        } else {
          formItem.value.Files = trimFileName(file);
        }
        formItem.value.FileType = file.type.startsWith('image/') ? 'webp' : getFileType(file);
      }
    }
  }
  loader.value.close();
};


const fileNameAlert = computed(() => {
  if (formItem.value.Files && formItem.value.Files.name) {
    const name = formItem.value.Files.name;
    if (name.length > 100) {
      return "Successfully uploaded with a file name limited to 100 characters.";
    }
  }
  return null;
});

</script>

<style scoped lang="scss">
@import "@/assets/sass/core/components/mixins/_typography.scss";
.ironlake-form-media-library {
  :deep(.el-form-item) {
    margin: 0;
    label {
      padding: 0;
      margin-bottom: 0.375rem;
      @include paragraph-md();
      font-weight: 700;
    }
    .el-form-item__content {
      .el-input {
        .el-input__inner {
          border-radius: 8px;
          padding: 0.375rem 0.625rem;
          @include paragraph-md();
        }
        &.el-date-editor {
          .el-input__inner {
            padding-left: calc(0.75rem + 25px);
          }
        }
        .el-input__prefix {
          margin-left: 0.375rem;
        }
        .el-input__suffix {
          top: 30px;
        };
      }
      .el-select {
        width: 100%;
        .select-trigger {
          width: 100%;
        }
      }

      .el-textarea {
        .el-textarea__inner {
          border-radius: 8px;
          padding: 0.375rem 0.625rem;
          @include paragraph-md();
        }
        .el-input__count {
          top: 92px;
        }
      }
    }

    .file-upload-caption {
      color: var(--el-color-info);
      font-size: 12px;
      position: absolute;
      top: 53px;
    }
  }
}

.alert-filename {
  color: #54D62C;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>
