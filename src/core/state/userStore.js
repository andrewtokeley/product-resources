import { addUser, getUser, recordUserLogin } from '@/modules/users/services/user-services';
import { DateTime } from 'luxon';
import { defineStore } from 'pinia'

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
      console.log('updateAuthUser started');
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
        console.log('updateAuthUser store updated with authenticated');
      } else {
        // the user logged out.
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.displayName = "";
        this.email = "";
        console.log('updateAuthUser store updated with anon user');
      }
      console.log('updateAuthUser ended');
    },
  },
})