<template>
  <div class="login-view">
    <h1>{{  heading }}</h1>
    <p v-if="explaination">{{  explaination }}</p>
    <div v-if="error">{{ error }}</div>
    <login-widget 
      @error="handleError(error)" 
      @success="handleSuccess">
    </login-widget>
  </div>
</template>

<script>
import { useUserStore } from '@/core/state/userStore';
import LoginWidget from '../components/LoginWidget.vue';

export default {
  components: { LoginWidget },
  name: "login-view",

  data() {
    return {
      error: null,
      redirectUrl: '/',
      heading: 'Sign In',
      explaination: '',
    }
  },
  computed: {
    store() {
      return useUserStore();
    }
  },

  mounted() {
    this.redirectUrl = this.$route.query.redirect ?? "/";
    const action = this.$route.query.action?.toLowerCase();
    if (action) {
      if (action == 'review') {
        this.explaination = "Before you make that review..."
      }
      if (action == 'recommendation') {
        this.explaination = "Before you make that recommendation..."
      }
    }
  },

  methods: {
    handleError(error){
      this.error = error;
    },
    handleSuccess() {
      console.log('success');
      this.$router.push(this.redirectUrl ?? '/');
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

