import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

export const updateLoggedInStatusFromAPIResponse = (error: any) => {
  try {
    if (error?.message?.includes('Request failed with status code 401')) {
      const authStore = useAuthenticationStore();
      authStore.setLoggedIn(false);
    }
  } catch (error) {
    console.log(error);
  }
}
