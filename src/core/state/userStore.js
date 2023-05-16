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
    
    async login(authUser, dbUser) {
      if (authUser && dbUser) {
        this.uid = dbUser.uid;
        this.isLoggedIn = true;
        this.displayName = dbUser.displayName;
        this.email = authUser.email;
        await authUser.getIdTokenResult().then( (result) => {
          this.isAdmin = result.claims.admin ?? false
        });
      } else {
        // reset, user is logged out
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.displayName = "";
        this.email = "";
      }
    },
  },
})