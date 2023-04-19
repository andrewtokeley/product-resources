<template>
  <div class="header">
    <div class="header__left">
      <a class="onWhite">Books</a>
      <a class="onWhite">Podcasts</a>
      <a class="onWhite">Articles</a>
      <a class="onWhite">Video</a>
    </div>
    
    <div class="header__right">
      <base-button class='header__login' @click="handleLogin">LogIn</base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/core/components/BaseButton'
export default {
  name: 'HeaderBar',
  components: {
    BaseButton
  },
  methods: {
    handleLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

.header {
  /* position: absolute; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 50px;
  padding-right: 50px;
  /* top: 0px;
  left: 0px;
  right: 0px; */
  background: transparent;
  height: 70px;
  width:80%;
}

.header__left, .header__right {
  width: 400px;
}

.header h1 {
  color: var(--prr-blue);
}

.header__login {
  float:right;
  margin-left: 20px;
}
</style>