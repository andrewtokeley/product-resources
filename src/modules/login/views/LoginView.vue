<template>
  <div class="login">
    <div class="login__ui">
      <div id="firebaseui-auth-container"></div>
    </div>
  </div>
</template>

<script>
// FirebaseUI is not compatible with firebase 9, so we have to use these compat versions.
import { auth, firebase } from "@/core/services/firebaseInitCompat"
import 'firebaseui/dist/firebaseui.css';

var firebaseui = require('firebaseui');
var ui = new firebaseui.auth.AuthUI(auth);

export default {
  name: "LoginView",
  title: "Login",

  setup() {
    auth.signOut();
  },

  computed: {
    
    uiConfig() {
      const vm = this;
      return {
        //signInFlow: "popup",
        signInOptions: [
          {
            //provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            fullLabel: "Log in with Google",
          }
        ],
        // Terms of service url/callback.
        tosUrl: "/TermsOfService",
        // Privacy policy url/callback.
        privacyPolicyUrl: function () {
          vm.$router.push("/Privacy");
        },
        signInSuccessUrl: '/book',
        callbacks: {
          signInSuccessWithAuthResult: function () { //function (authResult, redirectUrl) {
            vm.$router.push('/');
          },
          // signInFailure callback must be provided to handle merge conflicts which
          // occur when an existing credential is linked to an anonymous user.
          signInFailure: function (error) {
            console.log(error);
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

<style>
.firebaseui-title {
  display: none;
}
</style>

<style scoped>

#firebaseui-auth-container {
  background-color: white;
  border-radius: 5px;
  width: 300px;
  max-width: 90%;
} 

.login {
  height: 100%;
}

.login__ui {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

