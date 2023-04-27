<template>
  <modal-dialog 
    :title="resource.displayName" 
    :iconActions="iconActions"
    :buttonActions="buttonActions"
    @close="handleClose" 
    @iconClick="handleIconClick"
    @buttonClick="handleButtonClick"
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
import { getResource, updateResource, addResource } from '../services/resource-service';

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
    mode: {
      type: String,
      default: 'view'
    }
  },

  emits: ["close"],

  async mounted() {

    this.isWorking = true;
    this.isEditing = this.mode == 'view' ? false : true;
    if (this.mode != 'add') {
      this.resource = await getResource(this.resourceId)
    } else {
      this.resource = Resource.default();
    }
    this.isWorking = false;
  },

  computed: { 
    
    iconActions() {
      var actions = [];
      actions.push( {
          id: 'edit',
          iconName: "edit",
          show: !this.isEditing});
      return actions;
    },
    buttonActions() {
      var actions = [];
      if (this.isEditing) {
        actions.push( {
          id: 'save',
          title: "Save",
          isPrimary: true,
        });
        actions.push( {
          id: 'cancel',
          title: "Cancel",
          isSecondary: true,
        });
      } else {
        actions.push( {
          id: 'delete',
          title: "Delete",
          isDestructive: true,
          show: this.resource.resourceUrl
        });
        actions.push( {
          id: 'view',
          title: "View...",
          isPrimary: true,
          show: this.resource.resourceUrl
        });
      }
      return actions;
    }
  },

  methods: {
    
    async handleIconClick(action) {
      if (action.id == 'edit') {
        this.isEditing = true;
      }
    },

    async handleButtonClick(action) {
      
      if (action.id == 'cancel') {
        this.isEditing = false;
      } else if (action.id == 'save') {
        if (this.resource.id) {
          await updateResource(this.resource)
        } else {
          this.resource = await addResource(this.resource)
        }
        this.isEditing = false;
      } else if (action.id == 'view') {
        if (this.resource.resourceUrl) {
          window.open(this.resource.resourceUrl, '_blank');
        }
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

