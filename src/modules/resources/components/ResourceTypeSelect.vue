<template>
  <!-- {{  selectedType }} -->
  <base-select
    v-model="local"
    :selectOptions="resourceTypes"
  >
  </base-select>
</template>

<script>  
import BaseSelect from "@/core/components/BaseSelect.vue";
import { useLookupStore } from "@/core/state/lookupStore";

export default {
  name: "resource-type-select",
  components: { BaseSelect },
  props: {
    modelValue: String,
  },
  data() {
    return {
      resourceTypes:[],
    }
  },
  
  async mounted() {
    const store = useLookupStore();
    this.resourceTypes = store.resourceTypes;
  },

  computed: {
    local: {
      get() {
        return this.modelValue ? this.modelValue : 'books';
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  
  // methods: {
  //   update(event) {
  //     var newValue = event.target.value;
  //     this.$emit('update:modelValue', newValue);
  //   }
  // }
}
</script>

<style scoped>

.select {
  max-width: 200px;
} 
</style>