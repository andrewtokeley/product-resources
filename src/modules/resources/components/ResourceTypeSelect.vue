<template>
  <!-- {{  selectedType }} -->
  <base-select
    v-model="local"
    :selectOptions="resourceTypes"
  >
  </base-select>
</template>

<script>  
// import { getResourceTypes } from "@/modules/resources/services/lookup-service"
import BaseSelect from "@/core/components/BaseSelect.vue";
import { getResourceTypes } from '../services/lookup-service';

export default {
  name: "resource-type-select",
  components: { BaseSelect },
  props: {
    modelValue: Object,
  },
  data() {
    return {
      resourceTypes:[]
    }
  },
  
  async mounted() {
    this.resourceTypes = await getResourceTypes()
  },

  computed: {
    local: {
      get() {
        return this.modelValue ? this.modelValue : [{key: 'book', value: 'Books'}];
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
 
}
</script>