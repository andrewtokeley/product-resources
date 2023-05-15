<template>
  <div class="login">
    <div v-if="showReason">
      <h1>Before you leave that {{ action }}...</h1>
      <hr class="heading-underline" />
      
      <p>Wait, what!? Why do I need to log in?</p>
      <p>There are two reasons.</p>
      <ul>
        <li><b>Real people, real reviews</b> - this site is built on the principle of open sharing. We want reviews and recommendations to be left by, and credited to, real people. 'Anon' is not a PM.</li>
        <li><b>Street Cred</b> - by logging in, your reviews will be linked to eachother and others will be able to see what you're into (or not!) - good karma comes to those who share!</li>
      </ul>
      
    </div>
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

  data() {
    return {
      showReason: false,
      redirectUrl: null,
      action: '',
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
            if (vm.redirectUrl) {
              vm.$router.push(vm.redirectUrl);
            } else {
              vm.$router.go(-1);
            }
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
    if (this.$route.query.reason) {
      this.showReason = true;
    }
    this.action = this.$route.query.action;
    
    const redirect = this.$route.query.redirect;
    if (redirect) {
      this.redirectUrl = redirect;
    } 
    ui.start("#firebaseui-auth-container", this.uiConfig);
  },

};

</script>

<style>
/* .firebaseui-title {
  display: none;
} */
</style>

<style scoped>

h1, p {
  text-align: center;
}

.heading-underline {
  border-bottom: 2px solid var(--prr-green);
  width: 300px;
}
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

div.mdl-progress::after {
    display: block;
    color: black;
    content: "Authenticating";
    margin: 20px auto;
    text-align: center;
}

.mdl-progress {
    height: 5px;
}
</style>

