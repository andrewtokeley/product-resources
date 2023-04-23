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
      placeholder="Search for resources"/>
    <base-icon @click="handleClear()">close</base-icon>
  </div>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  components: { BaseIcon },

  name: "SearchInput",

  emits: ["update:modelValue", "focus", "blur", "search"],

  data() {
    return {
      hasFocus: false,
    }
  },

  props: {
    // The bound value of the input, set by clients using the v-model property
    modelValue: String,
  },
  
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set() {
        // don't want to do anything here because we only want to let the client know about the value
        // change after it's successfully been validated/saved asynchronously (see validation())
        // We still need an empty implementation so the value property is writable though
      }
    }
  },

  methods: {
    handleClear() {
      this.$emit("update:modelValue","");
      // this.$emit("search")
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
  margin-right: 40px;
}

.search-input.selected {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

input {
  border: none;
  background: transparent;
  font-size: 1.0em;
}

input:focus {
  outline: none;
}
</style>