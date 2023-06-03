<template>
  <div class="login__ui">
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
// FirebaseUI is not compatible with firebase 9, so we have to use these compat versions.
import { auth, firebase } from "@/core/services/firebaseInitCompat"
import 'firebaseui/dist/firebaseui.css';
import { useUserStore } from '@/core/state/userStore';

var firebaseui = require('firebaseui');
var ui = new firebaseui.auth.AuthUI(auth);

export default {
  name: "login-widget",
  emits: ['error', 'success', 'uiChanged'],
  props: {
    redirectUrl: {
      type: String,
      default: '/',
    }
  },
  computed: {    
    uiConfig() {
      const vm = this;
      return {
        signInFlow: "popup",
        signInOptions: [
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            fullLabel: "Sign in with Google", 
          },          
        ],
        // Terms of service url/callback.
        tosUrl: "/terms",
        // Privacy policy url/callback.
        privacyPolicyUrl: function () {
          return "/privacy";
        },
        signInSuccessUrl: vm.redirectUrl ?? '/',
        callbacks: {
          signInSuccessWithAuthResult: async function(authResult) {
            //update the store now, rather than waiting for the authentication handler
            console.log("signInSuccessWithAuthResult - logged in? " + store.isLoggedIn)
            const store = useUserStore()
            await store.updateAuthUser(authResult);
            console.log("signInSuccessWithAuthResult - logged in now? " + store.isLoggedIn)
            return true;

          },
          // signInFailure callback must be provided to handle merge conflicts which
          // occur when an existing credential is linked to an anonymous user.
          signInFailure: function (error) {
            vm.$emit('error', error);
          },
          uiChanged: function(fromPageId, toPageId) {
            vm.$emit('uiChanged', fromPageId, toPageId);
          }
        },
      };
    },
  },

  mounted() {
    console.log('login-widget: ' + this.redirectUrl);
    ui.start("#firebaseui-auth-container", this.uiConfig);
  },

};

</script>

<style scoped>

#firebaseui-auth-container {
  background-color: white;
  border-radius: 5px;
  width: 300px;
  max-width: 90%;
} 

.login__ui {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mdl-shadow--2dp {
    box-shadow: none;
}

.firebaseui-info-bar {
    margin-top: 20px;
}

/* div.mdl-progress::after {
    display: block;
    color: black;
    content: "Authenticating";
    margin: 20px auto;
    text-align: center;
}

.mdl-progress {
    height: 5px;
} */
</style>

