<template>
  <modal-dialog :title="resource.displayName" @close="$emit('close')">
    
    <div>
      <img :class="{ book: isBook}" :src="resource.imageUrl" />
      <p>{{resource.description}}</p>
    </div>

  </modal-dialog>  
</template>

<script>
import ModalDialog from '@/core/components/ModalDialog.vue'

import { getResource } from '@/modules/resources/services/resource-service'
import { Resource } from '@/modules/resources/model/resource'

export default {
  name: 'ResourceDetail',
  components: {
    ModalDialog,
  },
  
  data() {
    return {
      resource: Resource,
    }
  },

  props: {
    resourceId: String,
  },

  emits: ["close"],

  mounted() {
    getResource(this.resourceId).then ( resource => {
      this.resource = resource
    })
  },

  computed: { 
    isBook() {
      if (this.resource.category) {
        return this.resource.category.toLowerCase() == 'book'
      }
      return false;
    },
  }

}

</script>

<style scoped>

img {
  height:112px;
  width: 112px;
  border-radius: 12px;
}

img.book {
  height:215px;
  width: 140px;
}

</style>