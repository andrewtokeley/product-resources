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
import { getResourceTypes } from '@/modules/resources/services/lookup-service';

export default {
  name: "resource-type-select",
  components: { BaseSelect },
  props: {
    modelValue: String,
  },
  data() {
    return {
      resourceTypes:[]
    }
  },
  
  async mounted() {
    const lookup = await getResourceTypes()
    this.resourceTypes  = lookup.keyValues;
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