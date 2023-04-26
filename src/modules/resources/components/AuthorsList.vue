<template>
  <base-input 
    v-model="local"    
    @input="update"
  ></base-input>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
export default {
  name: "authors-list",
  components: {
    BaseInput,
  },

  emits: ['update:modelValue'],

  props: {
    modelValue: { 
      type: Array,
      default: () => {[]}
    }
  },

  computed: {
    local: {
      get() {
        // while we're binding to an array we want to dispaly and accept comma delimeted string
        return this.modelValue ? this.modelValue.join(',') : "";
      },
      set() {
        // not sure why I need to add a setter here?
      }
    }
  },

  methods: {
    update(event) {
      var newValue = event.target.value;
      this.$emit('update:modelValue', newValue.split(','))
    }
  }
}
</script>BaseInput