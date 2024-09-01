<template>
  <!--begin::Layout Builder Notice-->
  <div
    v-if="currentUser"
    class="card mb-10"
    id="profile-container"
    style="background: inherit"
  >
    <div class="card-body" style="display: inline-flex">
      <div class="symbol symbol-70px symbol-circle">
        <img
          :src="currentUser.image || '/media/avatars/avatar.png'"
          alt="image"
          style="width: 76px; height: 76px; margin-top: -30px"
       />
      </div>
      <div class="d-flex flex-column" style="margin-left: 10px">
        <div
          class="d-flex align-items-center text-blue-gray mt-25 font-name-lg"
        >
          {{ currentUser.empName }}
        </div>
        <span class="fw-bold card-subtitle gray-100 card-subtitle">{{
          currentUser.positionName
        }}</span>
      </div>
    </div>
    <div class="card mb-10" style="margin: 25px">
      <div class="card-header">
        <h3 class="card-title page-title">Personal Information</h3>
      </div>
      <div class="card-body p-9">
        <div class="row mb-7">
          <div class="col-lg-7">
            <div class="d-flex flex-column">
              <span class="card-subtitle">User Name</span>
              <p class="text-color-dark mt-2">
                {{ currentUser.empName || "-" }}
              </p>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Email</span>
              <p class="text-color-dark mt-2">{{ currentUser.email || "-" }}</p>
            </div>
          </div>
        </div>
        <div class="row mb-7">
          <div class="col-lg-7">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Phone</span>
              <p class="text-color-dark mt-2">{{ currentUser.phone || "-" }}</p>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="d-flex flex-column">
              <span class="card-subtitle">ID</span>
              <p class="text-color-dark mt-2">
                {{ currentUser.employeeID || "-" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mb-10" style="margin: 0px 25px">
      <div class="card-header">
        <h3 class="card-title text-blue-gray page-title">
          Employee Information
        </h3>
      </div>
      <div class="card-body p-9">
        <div class="row mb-7">
          <div class="col-lg-7">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Umur</span>
              <p class="text-color-dark mt-2">{{ currentUser.age || 0 }}</p>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Karyawan/Vendor</span>
              <p class="text-color-dark mt-2">
                {{ currentUser.isInternal ? "Karyawan" : "Vendor" }}
              </p>
            </div>
          </div>
        </div>
        <div class="row mb-7">
          <div class="col-lg-7">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Jabatan</span>
              <p class="text-color-dark mt-2">
                {{ currentUser.positionName || "-" }}
              </p>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Nama Perusahaan</span>
              <p class="text-color-dark mt-2">
                {{ currentUser.companyName || "-" }}
              </p>
            </div>
          </div>
        </div>
        <div class="row mb-7">
          <div class="col-lg-7">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Level</span>
              <p class="text-color-dark mt-2">
                {{ currentUser.empLevelName || "-" }}
              </p>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Department</span>
              <p class="text-color-dark mt-2">
                {{ currentUser.department || "-" }}
              </p>
            </div>
          </div>
        </div>
        <div class="row mb-7">
          <div class="col-lg-7">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Divisi</span>
              <p class="text-color-dark mt-2">
                {{ currentUser.division || "-" }}
              </p>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Fungsi</span>
              <p class="text-color-dark mt-2">
                {{ currentUser.function || "-" }}
              </p>
            </div>
          </div>
        </div>
        <div class="row mb-7">
          <div class="col-lg-7">
            <div class="d-flex flex-column">
              <span class="card-subtitle">Site</span>
              <p class="text-color-dark mt-2">
                {{ currentUser.locationName || "-" }}
              </p>
            </div>
          </div>
          <div class="col-lg-5"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card .card-body {
  padding: 0 2.25rem;
}

#profile-container {
  margin-top: 8vw;
}
</style>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
} from "vue";
import { useMenuStore } from "../store/templates/useMenuStore";
import { useAuthenticationStore } from "../store/pinia/application/useAuthenticationStore";
import { Actions } from "../store/enums/StoreEnums";

export default defineComponent({
  name: "profile",
  components: {},
  setup() {

    const store = useMenuStore();
    const authStore = useAuthenticationStore();
    store[Actions.ACTIVE_PAGE]("Profile");

    const currentUser = computed(() => {
      return authStore.user;
    });

    onBeforeMount(() => {
      store[Actions.SET_BREADCRUMB_ACTION](null);
    });

    return {
      currentUser,
    };
  },
});
</script>
