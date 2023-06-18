<template>
  <div class="username-input">
    <span class="label">https://topproductresources/</span>
    <base-input 
      v-model="value"
      id="username"
      class="input" 
      :options="{inlineErrors: true}"
      :errorMessage="error"
      :validation="{ delay: 1000, callback: validateUsername}"
      >
    </base-input>
  </div>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
import { usernameExists } from '../services/user-services';

export default {
  name: 'username-input',
  props: {
    modelValue: String,
    options: {},
  },
  data() { 
    return {
      error: null,
    }
  },
  components: { BaseInput },  

  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      }
    },
  },
  methods: {
    validateUsername(username) {
      console.log(username);
      return new Promise( (resolve) => {
        usernameExists(username).then ((exists) => {
          if (!exists) {
            resolve({ result: true});
          } else {
            resolve({result: false, message: `The username "${username}" is already taken`});
          }
        })
      })
    },
    handleUserNameValidation(event) {
      const value = event.target.value;
      if (value == 'tokes') {
        this.error = "name taken"
      } else {
        this.error = null;
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
  width: 300px;
}

.label {
  padding-bottom: 30px;
  padding-right: 2px;
}
.error {
  padding-left:35px;
  color: var(--prr-red);
}
</style>