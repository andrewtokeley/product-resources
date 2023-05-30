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
    <p>
      Signing in will create a new account for first time users. Our website will only be given access to your name and email address.
    </p>
    <base-button :isSecondary="true" @click="$router.go(-1)">No Thanks!</base-button>
  </div>
</template>

<script>
import BaseButton from '@/core/components/BaseButton.vue';
import LoginWidget from '../components/LoginWidget.vue';

export default {
  components: { LoginWidget, BaseButton },
  name: "login-view",

  data() {
    return {
      error: null,
      redirectUrl: null,
      heading: 'Sign In',
      explanation: '',
    }
  },

  mounted() {
    
    this.redirectUrl = this.$route.query.redirect ?? "/";
    console.log('loginview: ' + this.redirectUrl);
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


</style>

