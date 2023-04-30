<template>
  <modal-dialog 
    :title="title" 
    :iconActions="iconActions"
    :buttonActions="buttonActions"
    @close="handleClose" 
    @iconClick="handleIconClick"
    @buttonClick="handleButtonClick"
  >
    <div v-if="!isWorking">
      <div v-if="mode == MODE_EDIT_RESOURCE || mode == MODE_ADD_RESOURCE">
        <edit-resource v-model="editResource"></edit-resource>
      </div>

      <div v-if="mode == MODE_VIEW_RESOURCE">
        <view-resource :resource="resource"></view-resource>
      </div>

      <div v-if="mode == MODE_ADD_RECOMMENDATION">
        <recommend-resource :resource="resource"></recommend-resource>
      </div>

      <div v-if="mode == MODE_NEW_RECOMMENDATION">
        <recommend-resource></recommend-resource>
      </div>
    </div>
  </modal-dialog>  
</template>

<script>
import ModalDialog from '@/core/components/ModalDialog.vue'
import EditResource from "@/modules/resources/views/EditResource"
import ViewResource from './ViewResource.vue';
import RecommendResource from '@/modules/recommendations/views/RecommendResource.vue';

import { cloneDeep } from 'lodash';
import { Resource } from '@/modules/resources/model/resource'
import { getResource, updateResource, addResource, deleteResource } from '../services/resource-service';

export default {
  name: 'resource-modal',
  components: {
    ModalDialog,
    EditResource,
    ViewResource,
    RecommendResource,
  },
  data() {
    return {
      MODE_VIEW_RESOURCE: "viewResource",
      MODE_EDIT_RESOURCE: "editResource",
      MODE_ADD_RESOURCE: "addResource",
      MODE_ADD_RECOMMENDATION: "addRecommendation",
      MODE_NEW_RECOMMENDATION: "newRecommendation",
      mode: 'viewResource',
      isWorking: {
        type: Boolean,
        default: true
      },
      // isEditing: {
      //   type: Boolean,
      //   default: false
      // },
      resource: {
        type: Resource,
        default: Resource.default()
      },
      // this instance will be a copy of the root resource to allow a cancel action
      editResource: {
        type: Resource,
        default: Resource.default()
      }
    }
  },

  props: {
    resourceId: {
      type: String,
      default: null
    },
    initialMode: {
      type: String,
      default: 'view'
    }
  },

  emits: ["close"],

  async mounted() {
    console.log('mount')
    this.isWorking = true;
    this.mode = this.initialMode;
    if (this.mode == this.MODE_VIEW_RESOURCE) {
      this.resource = await getResource(this.resourceId)
    } else {
      if (this.mode == this.MODE_ADD_RESOURCE) {
        this.editResource = Resource.default();
      }
    }
    this.isWorking = false;
  },

  computed: { 
    title() {
      if (this.mode == this.MODE_ADD_RESOURCE) return "New Resource";      
      if (this.mode == this.MODE_EDIT_RESOURCE) return this.editResource.displayName;
      if (this.mode == this.MODE_VIEW_RESOURCE) return this.resource.displayName;
      if (this.mode == this.MODE_NEW_RECOMMENDATION || this.mode == this.MODE_ADD_RECOMMENDATION) return "Recommendation";
      return "";
    },
    iconActions() {
      var actions = [];
      actions.push( {
          id: 'edit',
          iconName: "edit",
          show: this.mode == this.MODE_VIEW_RESOURCE});
      return actions;
    },
    buttonActions() {
      var actions = [];
      if (this.mode == this.MODE_EDIT_RESOURCE || this.mode == this.MODE_ADD_RESOURCE) {
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
      } 
      if (this.mode == this.MODE_VIEW_RESOURCE) {
        actions.push( {
          id: 'delete',
          title: "Delete",
          isDestructive: true,
          show: this.resource
        });
        actions.push( {
          id: 'recommend',
          title: "Recommend...",
          isSecondary: true,
          show: this.resource
        });
        actions.push( {
          id: 'view',
          title: "View...",
          isPrimary: true,
          show: this.resource.resourceUrl
        });
      }
      if (this.mode == this.MODE_ADD_RECOMMENDATION || this.mode == this.MODE_NEW_RECOMMENDATION ) {
        actions.push( {
          id: 'cancel',
          title: "Cancel",
          isSecondary: true,
        });
        actions.push( {
          id: 'saveRecommendation',
          title: "Submit",
          isPrimary: true,
        });
      }
      return actions;
    }
  },

  methods: {
    
    async handleIconClick(action) {
      if (action.id == 'edit') {
        console.log('ddd')
        // take a copy of the resource
        this.editResource = cloneDeep(this.resource)
        // this.isEditing = true;
        this.mode = this.MODE_EDIT_RESOURCE;
      }
    },

    async handleButtonClick(action) {
      if (action.id == 'cancel') {
        if (this.mode == this.MODE_NEW_RECOMMENDATION || this.mode == this.MODE_ADD_RESOURCE) {
          this.$router.push('/');
        } else {
          this.mode = this.MODE_VIEW_RESOURCE;
        }
      } else if (action.id == 'save') {
        if (this.mode == this.MODE_EDIT_RESOURCE) {
          await updateResource(this.editResource);
          this.resource = cloneDeep(this.editResource);
        } else if (this.mode == this.MODE_ADD_RESOURCE) {
          this.resource = await addResource(this.editResource);
        }
        this.mode = this.MODE_VIEW_RESOURCE;
      } else if (action.id == 'view') {
        if (this.resource.resourceUrl) {
          window.open(this.resource.resourceUrl, '_blank');
        }
      } else if (action.id == 'delete') {
        if (this.resource.id) {
          await deleteResource(this.resource.id);
          this.$router.push('/');
        }
      } else if (action.id == 'recommend') {
        if (this.resource) {
          this.mode = this.MODE_ADD_RECOMMENDATION;
        }
      } else if (action.id == 'saveRecommendation') {
        console.log('save'); 
      }
    },

    handleClose() {
      console.log('cl')
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

