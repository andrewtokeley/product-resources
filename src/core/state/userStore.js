import { recordUserLogin, getUser, addUser } from '@/modules/users/services/user-services';
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
    async setDisplayName(displayName) {
      this.displayName = displayName;
    },

    async updateAuthUser(authUser) {
      
      // successful login
      if (authUser) {
        console.log('auth start')
        // set the state properties
        this.uid = authUser.uid;
        this.isLoggedIn = true;
        this.email = authUser.email;

        // check if they're an admin
        const token = await authUser.getIdTokenResult();
        this.isAdmin = token.claims.admin ?? false

        // see if they've overridden any authuser properties (like displayName)
        let dbUser = await getUser(authUser.uid);
        if (!dbUser) {
          // default the displayName to the authUser
          this.displayName = authUser.displayName;
          await addUser(authUser);
        } else {
          this.displayName = dbUser.displayName;
        }
        console.log('set displayname')
        // record last logged in 
        await recordUserLogin(authUser.uid);
        
      } else {
        // the user logged out, clear all state
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.displayName = "";
        this.email = "";
        
      }
      
    },
  },
})