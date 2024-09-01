import { getCurrentInstance } from "vue";
import { elapsedTime } from "@/core/helpers/timer";
import {
  FirebasePageVisitDurationParam
} from "../types/misc/firebase-report-function-params/FirebasePageVisitDurationParam";
import {
  FirebasePageVisitParam
} from "../types/misc/firebase-report-function-params/FirebasePageVisitParam";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

const authStore = useAuthenticationStore();

export const sendFirebasePageVisitDurationAnalyticsReport = ({
  startTime,
  pageName,
  eventName,
}: FirebasePageVisitDurationParam) => {
  const internalInstance = getCurrentInstance();
  const analytics =
    internalInstance?.appContext.config.globalProperties.$config;
  const payload = {
    nik: authStore.user.EmployeeId,
    email: authStore.user.Email,
    jobtitle: authStore.user.Position,
    site: authStore.user.Location,
    page: pageName,
    duration: elapsedTime(startTime),
  };
};

export const sendFirebasePageVisitAnalyticsReport = ({
  pageName,
}: FirebasePageVisitParam) => {
  const internalInstance = getCurrentInstance();
  const analytics =
    internalInstance?.appContext.config.globalProperties.$config;
  const payload = {
    nik: authStore.user.EmployeeId,
    email: authStore.user.Email,
    jobtitle: authStore.user.Position,
    site: authStore.user.Location,
    page: pageName,
    counter: 1,
  };
};
