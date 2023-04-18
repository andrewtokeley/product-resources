<template>
  <modal-dialog :title="resource.displayName" @close="$emit('close')">
    
    <div>
      <img :src="resource.imageUrl" />
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

}

</script>

<style scoped>

img {
  height:215px;
  width: 140px;
}
</style>