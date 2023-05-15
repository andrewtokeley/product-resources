import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    uid: "",
    isLoggedIn: false,
    isAdmin: false,
    displayName: "",
    email: "",
  }),

  actions: {
    
    async login(authUser) {
      if (authUser) {
        this.uid = authUser.uid;
        this.isLoggedIn = true;
        this.displayName = authUser.displayName;
        this.email = authUser.email;
        await authUser.getIdTokenResult().then( (result) => {
          this.isAdmin = result.claims.admin ?? false
        });
      } else {
        // reset
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.displayName = "";
        this.email = "";
      }
    },
  },
})