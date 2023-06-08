import { recordUserLogin, getUser, addUser } from '@/modules/users/services/user-services';
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    uid: "",
    isLoggedIn: false,
    isAdmin: false,
    displayName: null,
    jobTitle: null,
    email: null,
  }),

  actions: {
    async setDisplayName(displayName) {
      this.displayName = displayName;
    },

    async setJobTitle(jobTitle) {
      this.jobTitle = jobTitle;
    },

    async updateAuthUser(authUser) {
      
      // successful login
      if (authUser) {
        
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
          this.jobTitle = dbUser.jobTitle;
        }

        // record last logged in 
        await recordUserLogin(authUser.uid);
        
      } else {
        
        // the user logged out, clear all state
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.displayName = null;
        this.jobTitle = null;
        this.email = null;
        
      }
      
    },
  },
})