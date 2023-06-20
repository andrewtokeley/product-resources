<template>
  <div class="username-input">
    <span class="label">{{baseUrl}}</span>
    <base-input 
      v-model="value"
      id="username"
      class="input" 
      :options="{inlineErrors: true}"
      :errorMessage="error"
      :validation="{ delay: 300, callback: validateUsername}"
      >
    </base-input>
    <div class="copy-group">
      <base-icon 
        title="Copy to clipboard" 
        class="copy-icon"
        :toolTip="copyTooltip"
        @click="handleCopy">
        content_copy
      </base-icon>
    </div>
  </div>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
import { usernameExists } from '../services/user-services';
import BaseIcon from '@/core/components/BaseIcon.vue';

export default {
  name: 'username-input',
  
  emits: ['update:modelValue', 'valid', 'error'],

  props: {
    modelValue: String,
    options: {},
  },
  data() { 
    return {
      baseUrl: String,
      error: null,
      currentUsername: null,
      copyTooltip: null,
    }
  },

  components: { BaseInput, BaseIcon },  

  mounted() {
    this.baseUrl = window.location.origin;
    this.currentUsername = this.modelValue;
  },

  computed: {
    recommendUrl() {
      return this.baseUrl + '/' + this.value;
    },
    value: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      }
    },
  },

  methods: {
    handleCopy() {
      navigator.clipboard.writeText(this.recommendUrl);
      this.copyTooltip = "Copied!"
      // wait a couple of seconds and clear tooltip
      const vm = this;
      setTimeout(function () {
        vm.copyTooltip = null;
      },1000);
    },
    validateUsername(username) {
      const vm = this;
      return new Promise( (resolve) => {
        if (username == vm.currentUsername) {
          console.log('smaem')
          resolve({ result: true});
          this.$emit('valid');
        } else { 
          usernameExists(username).then ((exists) => {
            if (!exists) {
              resolve({ result: true});
              this.$emit('valid');
            } else {
              resolve({result: false, message: `The username "${username}" is already taken`});
              this.$emit('error');
            }
          })
        }
      })
    },
    // handleUserNameValidation(event) {
    //   const value = event.target.value;
    //   if (value == 'tokes') {
    //     this.error = "name taken"
    //   } else {
    //     this.error = null;
    //   }
    // },
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
  margin-right: 10px;
}

.label {
  padding-bottom: 30px;
  padding-right: 2px;
}
.error {
  padding-left:35px;
  color: var(--prr-red);
}

.copy-icon {
  padding-bottom: 30px;
  padding-right: 2px;
}
</style>