<template>
  <div class="username-input">
    <span class="label">https://topproductresources/</span>
    <base-input 
      class="input" 
      :options="options"
      :errorMessage="error"
      @input="handleUserNameValidation">
    </base-input>
    <span class="error">{{  error  }}</span>
  </div>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'

export default {
  name: 'username-input',
  props: {
    options: {},
  },
  data() { 
    return {
      error: null,
    }
  },
  components: { BaseInput },  
  methods: {
    handleUserNameValidation(event) {
      const value = event.target.value;
      if (value == 'tokes') {
        this.error = "name taken"
      } 
    },
  }
}
</script>

<style scoped>
.username-input {
  display:flex;
  flex-direction: row;
  align-items: center;
}

.input {
  width: 200px;
  padding-top: 10px;
}

.error {
  padding-left:35px;
  color: var(--prr-red);
}
</style>