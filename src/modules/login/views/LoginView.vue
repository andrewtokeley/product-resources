<template>
  <div>
    <h1>Login</h1>
    <base-button @click="handleBack">Back</base-button>
  </div>
</template>

<script>
import BaseButton from '/src/core/components/BaseButton'

export default {
  name: 'loginView',
  components: {
    BaseButton
  },
  methods: {
    handleBack() {
      this.$router.push('/')
    }
  }
}

</script>
