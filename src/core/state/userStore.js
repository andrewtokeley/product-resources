import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    displayName: "",
  }),

  actions: {
    
    async login(authUser) {
      
      if (authUser) {
        this.isLoggedIn = true
        this.displayName = authUser.displayName
        await authUser.getIdTokenResult().then( (result) => {
          this.isAdmin = result.claims.admin ?? false
        });
      } else {
        this.isLoggedIn = false
        this.isAdmin = false
        this.displayName = ""
      }
    },
  },
})