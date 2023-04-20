<template>
  <div class="header">
    <div class="header__left">
      <router-link class="onWhite" to="/book">Books</router-link>
      <router-link class="onWhite" to="/podcast">Podcasts</router-link>
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
  margin-right:50px;
  margin-left:50px;
  /* padding-left: 50px; */
  /* padding-right: 0px; */
  /* top: 0px;
  left: 0px;
  right: 0px; */
  background: transparent;
  height: 70px;
  /* width:100%; */
}

.header__left, .header__right {
  width: 400px;
}

.header h1 {
  color: var(--prr-blue);
}

.header__login {
  float:right;
}
</style>