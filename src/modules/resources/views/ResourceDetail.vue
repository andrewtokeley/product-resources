<template>
  <modal-dialog 
    :title="title" 
    :subTitle="subTitle"
    :iconActions="iconActions"
    :buttonActions="buttonActions"
    :fullscreen="true"
    :isLoading="isWorking"
    @close="handleClose" 
    @iconClick="handleIconClick"
    @buttonClick="handleButtonClick"
  >
    
    <div v-if="mode == MODE_EDIT_RESOURCE || mode == MODE_ADD_RESOURCE">
      <edit-resource v-model="editResource"></edit-resource>
    </div>

    <div v-if="mode == MODE_VIEW_RESOURCE">
      <view-resource :resource="editResource"></view-resource>
    </div>
  
  </modal-dialog>  
</template>

<script>
import ModalDialog from '@/core/components/ModalDialog.vue'
import EditResource from "@/modules/resources/views/EditResource"
import ViewResource from './ViewResource.vue';

import { cloneDeep } from 'lodash';
import { Resource } from '@/modules/resources/model/resource'
import { getResource, updateResource, addResource, deleteResource } from '../services/resource-service';
import { useUserStore } from '@/core/state/userStore'

export default {
  name: 'resource-modal',
  components: {
    ModalDialog,
    EditResource,
    ViewResource,
  },
  data() {
    return {
      MODE_VIEW_RESOURCE: "view",
      MODE_EDIT_RESOURCE: "edit",
      MODE_ADD_RESOURCE: "add",
      mode: 'view',
      isWorking: true,
      editResource: {
        type: Resource,
        default: Resource.default()
      },
    }
  },

  props: {
    resource: {
      type: String,
      default: null
    },
    displayMode: {
      type: String,
      default: 'view'
    }
  },

  emits: ["close"],
  
  async mounted() {
    this.isWorking = true;
    this.mode = this.displayMode;
    if (this.mode == this.MODE_VIEW_RESOURCE) {
      this.editResource = cloneDeep(this.resource);
    } else {
      if (this.mode == this.MODE_ADD_RESOURCE) {
        this.editResource = Resource.default();
      }
    }
    this.isWorking = false;
  },

  computed: { 
    useUserStore() {
      return useUserStore()
    },
    title() {
      if (this.mode == this.MODE_ADD_RESOURCE) return "New Resource";      
      else return this.editResource.displayName;
      // if (this.mode == this.MODE_EDIT_RESOURCE) return this.editResource.displayName;
      // if (this.mode == this.MODE_VIEW_RESOURCE) return this.resource.displayName;
      // return "";

    },
    subTitle() {
      if (this.mode == this.MODE_VIEW_RESOURCE) return this.editResource.authorsList;
      return null;
    },
    iconActions() {
      var actions = [];
      actions.push( {
          id: 'edit',
          iconName: "edit",
          show: this.mode == this.MODE_VIEW_RESOURCE && this.useUserStore.isAdmin}
          );
      return actions;
    },
    buttonActions() {
      var actions = [];
      if (this.mode == this.MODE_EDIT_RESOURCE || this.mode == this.MODE_ADD_RESOURCE) {
        actions.push( {
          id: 'cancel',
          title: "Cancel",
          isSecondary: true,
        });
        actions.push( {
          id: 'save',
          title: "Save",
          isPrimary: true,
        });
        
      } 
      if (this.mode == this.MODE_VIEW_RESOURCE) {
        actions.push( {
          id: 'delete',
          title: "Delete...",
          isDestructive: true,
          show: this.editResource && this.useUserStore.isAdmin,
        });
        actions.push( {
          id: 'view',
          title: this.editResource.actionText,
          isPrimary: true,
          show: this.editResource.resourceUrl
        });
      }
      return actions;
    }
  },

  methods: {
    
    async handleIconClick(action) {
      if (action.id == 'edit') {
        // take a copy of the resource
        //this.editResource = cloneDeep(this.resource)
        // this.isEditing = true;
        this.mode = this.MODE_EDIT_RESOURCE;
      }
    },

    async handleButtonClick(action) {
      if (action.id == 'cancel') {
        if (this.mode == this.MODE_ADD_RESOURCE) {
          this.$router.push('/');
        } else {
          this.mode = this.MODE_VIEW_RESOURCE;
        }
      } else if (action.id == 'save') {
        if (this.mode == this.MODE_EDIT_RESOURCE) {
          await updateResource(this.editResource);
          // this.editResource = cloneDeep(this.editResource);
        } else if (this.mode == this.MODE_ADD_RESOURCE) {
          const id = await addResource(this.editResource);
          this.editResource = await getResource(id);
        }
        this.mode = this.MODE_VIEW_RESOURCE;
      } else if (action.id == 'view') {
        if (this.editResource.resourceUrl) {
          window.open(this.resource.resourceUrl, '_blank');
        }
      } else if (action.id == 'delete') {
        if (this.editResource.id) {
          await deleteResource(this.editResource.id);
          this.$router.push('/');
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

      // if we were editing/adding a resource force the search page to refresh the search results.
      let reload = (this.mode == this.MODE_EDIT_RESOURCE || this.mode == this.MODE_ADD_RESOURCE)
      this.$emit('close', reload);
    }
  }

}

</script>

