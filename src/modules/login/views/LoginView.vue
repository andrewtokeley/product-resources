<template>
  <div class="login-view">
    <h1>{{  heading }}</h1>
    <h2 v-if="explanation">{{  explanation }}</h2>
    <div v-if="error">{{ error }}</div>
    <login-widget v-if="redirectUrl" 
      :redirectUrl="redirectUrl"
      @error="handleError(error)" 
      @success="handleSuccess">
    </login-widget>
    <div class="closing" v-if="!userStore.isLoggedIn">
      <p>
        Signing in will create a new account for first time users. Our website will only be given access to your name and email address.
      </p>
      <base-button :isSecondary="true" @click="$router.go(-1)">No Thanks!</base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/core/components/BaseButton.vue';
import LoginWidget from '../components/LoginWidget.vue';
import { useUserStore } from '@/core/state/userStore';

export default {
  components: { LoginWidget, BaseButton },
  name: "login-view",

  data() {
    return {
      error: null,
      redirectUrl: null,
      heading: 'Sign In',
      explanation: ''
    }
  },
  computed: {
    userStore() {
      const store = useUserStore();
      return store;
    }
  },
  mounted() {
    this.redirectUrl = this.$route.query.redirect ?? "/";
    const action = this.$route.query.action?.toLowerCase();
    if (action) {
      if (action == 'review') {
        this.explanation = "Before you can make that review..."
      }
      if (action == 'recommendation') {
        this.explanation = "Before you can make that recommendation..."
      }
    }
  },

  methods: {
    // handleUIChanged(from, to) {
    //   this.isLoggingIn
    //   console.log(to);
    // },
    handleError(error){
      this.error = error;
    },
    handleSuccess() {
      console.log('success');
      // this.$router.push(this.redirectUrl ?? '/');
    }
  }

};

</script>

<style scoped>

.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
}
h1, h2, p {
  text-align: center;
}
h2 {
  color: var(--prr-mediumgrey)
}

.closing {
  text-align: center;
}

</style>

