import { addUser, getUser, recordUserLogin } from '@/modules/users/services/user-services';
import { DateTime } from 'luxon';
import { defineStore } from 'pinia'
import { auth } from '@/core/services/firebaseInit'

// auth.onAuthStateChanged(async (authUser) => { 
//   await this.updateAuthUser(authUser);
// });

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
    
    async updateAuthUser(authUser) {
      if (authUser) {
        const token = await authUser.getIdTokenResult();
        this.uid = authUser.uid;
        this.isLoggedIn = true;
        this.email = authUser.email;
        this.isAdmin = token.claims.admin ?? false

        let dbUser = await getUser(authUser.uid);
        if (!dbUser) {
          await addUser(authUser);
        }
        await recordUserLogin(authUser.uid, DateTime.now());
        this.displayName = dbUser.displayName;
        
      } else {
        // the user logged out.
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.displayName = "";
        this.email = "";
      }
      console.log('end');
    },

    // async login(authUser, dbUser) {
    //   if (authUser && dbUser) {
    //     this.uid = dbUser.uid;
    //     this.isLoggedIn = true;
    //     this.displayName = dbUser.displayName;
    //     this.email = authUser.email;
    //     await authUser.getIdTokenResult().then( (result) => {
    //       this.isAdmin = result.claims.admin ?? false
    //     });
    //   } else {
    //     // reset, user is logged out
    //     this.isLoggedIn = false;
    //     this.isAdmin = false;
    //     this.displayName = "";
    //     this.email = "";
    //   }
    // },
  },
})