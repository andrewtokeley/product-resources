<template>
  <div class="login__ui">
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
// FirebaseUI is not compatible with firebase 9, so we have to use these compat versions.
import { auth, firebase } from "@/core/services/firebaseInitCompat"
import 'firebaseui/dist/firebaseui.css';

var firebaseui = require('firebaseui');
var ui = new firebaseui.auth.AuthUI(auth);

export default {
  name: "login-widget",
  emits: ['error', 'success'],
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
        // signInSuccessUrl: '/',
        callbacks: {
          signInSuccessWithAuthResult: function() { //(authResult, redirectUrl)
            // if (vm.redirectUrl) {
            //   console.log("redict")
            //   vm.$router.push(vm.redirectUrl);
            // } else {
            //   console.log("redict - go back")
            //   vm.$router.go(-1);
            // }
            // const user = useUserStore()
            // user.login(authResult, 
            vm.$emit('success');
          },
          // signInFailure callback must be provided to handle merge conflicts which
          // occur when an existing credential is linked to an anonymous user.
          signInFailure: function (error) {
            vm.$emit('error', error);
          },
        },
      };
    },
  },

  mounted() {
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
  margin-top: 100px;
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

