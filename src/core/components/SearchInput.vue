<template>
  <div class="search-input" :class="{ selected: hasFocus }">
    <base-icon @click="handleSearch()">search</base-icon>
    <input
      ref="input"
      @keypress.enter="handleSearch()"
      @input="validate" 
      @focus="handleFocus()"
      @blur="handleBlur()"
      v-model="value"
      placeholder="Search"/>
    <base-icon @click.stop="handleClear()">close</base-icon>
  </div>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  components: { BaseIcon },

  name: "SearchInput",

  emits: ["update:modelValue", "focus", "blur", "search"],

  mounted() {
    this.$refs.input.focus();
  },

  data() {
    return {
      hasFocus: false,
    }
  },

  props: {
    // The bound value of the input, set by clients using the v-model property
    modelValue: { 
      type: String,
      default: ""
    }
  },
  
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set() {
        // do nothing
      }
    }
  },

  methods: {
    handleClear() {
      this.$emit("update:modelValue","");
      this.$refs.input.focus()
    },
    handleSearch() {
      if (this.value == '' || this.value == null || this.value == undefined) {
        return
      }
      this.$emit('search');
    },
    handleFocus() {
      this.hasFocus = true
      this.$emit('focus')
    },
    handleBlur() {
      this.hasFocus = false
      this.$emit('blur')
    },
    validate(event) {
      let newValue = event.target.value;
      // if (this.options.forceLowerCase) {
      //   newValue = newValue.toLowerCase();
      // }
      this.$emit("update:modelValue", newValue);
    },
  }
}

</script>

<style scoped>

::placeholder {
  color:rgba(60,64,67,0.3);
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
 color: rgba(60,64,67,0.3);
}

::-ms-input-placeholder { /* Microsoft Edge */
 color: rgba(60,64,67,0.3);
}

.search-input {
  display: flex;
  flex-direction: row;
  padding: 5px;
  background: var(--prr-extralightgrey);
  border-radius: 10px;
  margin-right: 20px;
  margin-left: 20px;
}

.search-input.selected {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

input {
  border: none;
  background: transparent;
  font-size: 1.0em;
  flex-grow: 1;
}

input:focus {
  outline: none;
}
</style>