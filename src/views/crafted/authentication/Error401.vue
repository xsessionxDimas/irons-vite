<template>
  <div class="d-flex flex-column flex-center flex-column-fluid p-10 bg-404">
    <!--begin::Illustration-->
    <img src="/media/logos/sorry.png" alt="" class="mw-100 mb-10 h-lg-150px" />
    <!--end::Illustration-->

    <!--begin::Message-->
    <h1 class="fw-bold heading mb-16px">Cannot access this page</h1>
    <!--end::Message-->
    <p class="mb-24px subtitle">
        You do not have permission to access this page<br/>
        please call your administrator!
    </p>

    <!--begin::Link-->
    <router-link to="/dashboard" class="btn btn-primary"
      >Return Home</router-link
    >
    <!--end::Link-->
  </div>
</template>

<style scoped>
.bg-404 {
  background-color: #f2f3f7 !important;
}

.heading {
  font-weight: 600 !important;
  font-size: 20px;
  line-height: 30px;
  /* identical to box height */

  text-align: center;
  letter-spacing: 0.0015em;

  color: #000000 !important;
}

.mb-16px {
  margin-bottom: 16px;
}

.mb-24px {
  margin-bottom: 24px;
}

.subtitle {
  width: 432px;
  height: 36px;

  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.001em;

  color: #000000;
}

.minus-top {
  margin-top: -10px;
}
</style>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import { useBodyStore } from "../../../store/templates/useBodyStore";
import { Actions } from "../../../store/enums/StoreEnums";

export default defineComponent({
  name: "error-404",
  components: {},
  setup() {
    const store = useBodyStore();

    onMounted(() => {
      store[Actions.ADD_BODY_CLASSNAME]("bg-body");
    });

    onUnmounted(() => {
      store[Actions.REMOVE_BODY_CLASSNAME]("bg-body");
    });
  },
});
</script>
