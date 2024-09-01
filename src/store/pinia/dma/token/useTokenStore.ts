import { defineStore } from "pinia";

export const useTokenStore = defineStore({
  id: "token",
  state: () => {
    return {
      stateToken: "",
      stateExpired: undefined as undefined | Date
    }
  },
  getters: {
    Token: (state) => {
      return state.stateToken;
    },
    Expired: (state) => {
      return state.stateExpired;
    },
  },
  actions: {
    setToken(token: string) {
      this.stateToken = token;
    },
    setExpired(expired: undefined | Date) {
      this.stateExpired = expired;
    },
    IsStillInInterval(): boolean {
      const now = new Date();
      if (this.stateExpired === undefined) return false;
      const differenceInHour = Math.abs(now.getTime() - (this.stateExpired as Date).getTime()) / 3600000;
      return differenceInHour < 1;
    }
  }
});
