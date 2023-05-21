<template>
  <div class="login-view">
    <h1>{{  heading }}</h1>
    <p v-if="explanation">{{  explanation }}</p>
    <div v-if="error">{{ error }}</div>
    <login-widget v-if="redirectUrl" 
      :redirectUrl="redirectUrl"
      @error="handleError(error)" 
      @success="handleSuccess">
    </login-widget>
  </div>
</template>

<script>
import LoginWidget from '../components/LoginWidget.vue';

export default {
  components: { LoginWidget },
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
        this.explanation = "Before you make that review..."
      }
      if (action == 'recommendation') {
        this.explanation = "Before you make that recommendation..."
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

<style>
/* .firebaseui-title {
  display: none;
} */
</style>

<style scoped>

h1, p {
  text-align: center;
}


</style>

