<template>
  <modal-dialog 
    :title="resource.displayName" 
    :iconActions="iconActions"
    :buttonActions="buttonActions"
    @close="handleClose" 
    @iconClick="handleIconClick"
  >
    <div v-if="!isWorking">
      <div v-if="isEditing">
        <edit-resource v-model="resource"></edit-resource>
      </div>

      <div v-else>
        <view-resource :resource="resource"></view-resource>
      </div>
    </div>
  </modal-dialog>  
</template>

<script>
import ModalDialog from '@/core/components/ModalDialog.vue'
import EditResource from "@/modules/resources/views/EditResource"
import ViewResource from './ViewResource.vue';

import { Resource } from '@/modules/resources/model/resource'
import { getResource, updateResource } from '../services/resource-service';

export default {
  name: 'resource-modal',
  components: {
    ModalDialog,
    EditResource,
    ViewResource,
  },
  data() {
    return {
      isWorking: {
        type: Boolean,
        default: true
      },
      isEditing: {
        type: Boolean,
        default: false
      },
      resource: {
        type: Resource,
        default: Resource.default()
      },
    }
  },

  props: {
    resourceId: {
      type: String,
      default: null
    },
  },

  emits: ["close"],

  async mounted() {
    this.isWorking = true;
    this.isEditing = false;
    this.resource = await getResource(this.resourceId)
    this.isWorking = false;
  },

  computed: { 
    
    iconActions() {
      var actions = [];
      actions.push( {
          id: 0,
          name: "edit",
          iconName: "edit",
          show: !this.isEditing});
      actions.push( {
          id: 1,
          name: "save",
          iconName: "save",
          show: this.isEditing});
      return actions;
    },
    buttonActions() {
      var actions = [];
      if (this.isEditing) {
        actions.push( {
          id: 0,
          title: "Save",
          isPrimary: true,
        });
        actions.push( {
          id: 0,
            title: "Cancel",
            isPrimary: false,
        });
      } else {
        actions.push( {
          id: 0,
          title: "View on Amazon...",
          isPrimary: true,
        });
      }
      return actions;
    }
  },

  methods: {
    
    async handleIconClick(action) {
      if (action.name == 'save') {
        this.isEditing = false;
        await updateResource(this.resource)
      } else if (action.name == 'edit') {
        this.isEditing = true;
      }
    },

    handleClose() {
      // silently remove the resource id from the url
      history.pushState(
        {},
        null,
        this.$route.path
      );
      this.$emit('close');
    }
  }

}

</script>

