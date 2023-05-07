<template>
  <modal-dialog 
    :title="resource.displayName" 
    :subTitle="resource.authorsList"
    :buttonActions="buttonActions"
    :fullscreen="true"
    :isLoading="false"
    @close="handleClose" 
    @buttonClick="handleButtonClick"
  >
    <div>
      <view-resource :resource="resource"></view-resource>
    </div>
  </modal-dialog>  
</template>

<script>
import ModalDialog from '@/core/components/ModalDialog.vue'
import ViewResource from './ViewResource.vue';

import { useUserStore } from '@/core/state/userStore'
import { approveResource, unapproveResource } from '../services/resource-service';

export default {
  name: 'resource-modal',
  components: {
    ModalDialog,
    ViewResource,
  },
  props: {
    resource: {
      type: Object,
      default: null
    }
  },

  emits: ["close", "updatedApproval"],
  
  computed: { 
    approvalError() {
      let validation = this.resource.validate();
      if (validation) {
        // validation[propName].errorMessage exists, but may change to array for this to be easier 
        return "error"
      }
      return null;
    },
    useUserStore() {
      return useUserStore()
    },
    buttonActions() {
      return [
        {
          id: 'publish',
          title: "Approve",
          align: 'left',
          disabled: this.approvalError?.length > 0,
          show: !this.resource.approved && this.useUserStore.isAdmin,
        },
        {
          id: 'unpublish',
          title: "Un-Approve",
          align: 'left',
          isSecondary: true,
          show: this.resource.approved && this.useUserStore.isAdmin,
        },
        {
          id: 'view',
          title: this.resource.actionText,
          isPrimary: true,
          show: this.resource.resourceUrl != null && this.resource.resourceUrl.length > 0
        },
      ]
    }
  },      
  
  methods: {
    
    async handleButtonClick(action) {
      console.log('ggg')
      if (action.id == 'view') {
        if (this.resource.resourceUrl) {
          window.open(this.resource.resourceUrl, '_blank');
        }
      }
      if (action.id == 'publish') {
        await approveResource(this.resource.id);
        this.$emit('updatedApproval', true);
      }
      if (action.id == 'unpublish') {
        await unapproveResource(this.resource.id);
        this.$emit('updatedApproval', false);
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

