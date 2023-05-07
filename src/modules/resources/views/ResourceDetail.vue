<template>
  <modal-dialog 
    :title="viewResource.displayName" 
    :subTitle="viewResource.authorsList"
    :buttonActions="buttonActions"
    :fullscreen="true"
    :isLoading="false"
    :showBackButton="showBackButton"
    @close="handleClose" 
    @buttonClick="handleButtonClick"
    @backButtonClick="handleBackButton"
  >
    <div>
      <view-resource
        :resource="viewResource"
        @changeResource="handleChangeResource">
      </view-resource>
    </div>
  </modal-dialog>  
</template>

<script>
import ModalDialog from '@/core/components/ModalDialog.vue'
import ViewResource from './ViewResource.vue';
import { cloneDeep } from 'lodash';
import { useUserStore } from '@/core/state/userStore'
import { approveResource, getResource, unapproveResource } from '../services/resource-service';
import { Resource } from "@/modules/resources/model/resource"
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
  data() {
    return {
      viewResource: Resource.default(),
      showBackButton: false,
    }
  },

  emits: ["close", "updatedApproval", "addRelated"],
  
  mounted() {
    this.viewResource = cloneDeep(this.resource);
  },

  computed: { 
    approvalError() {
      let validation = this.viewResource.validate();
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
          show: !this.viewResource.approved && this.useUserStore.isAdmin,
        },
        {
          id: 'unpublish',
          title: "Un-Approve",
          align: 'left',
          isSecondary: true,
          show: this.viewResource.approved && this.useUserStore.isAdmin,
        },
        {
          id: 'addRelated',
          title: "Add Related Resource...",
          align: 'left',
          show: this.useUserStore.isAdmin && this.viewResource.parentResourceId == null,
        },
        {
          id: 'view',
          title: this.resource.actionText,
          isPrimary: true,
          show: this.viewResource.resourceUrl != null && this.viewResource.resourceUrl.length > 0
        },
      ]
    }
  },      
  
  methods: {
    handleChangeResource(resource) {
      this.viewResource = resource;
      this.showBackButton = true
    },
    async handleBackButton() {
      this.viewResource = await getResource(this.viewResource.parentResourceId);
    },
    async handleButtonClick(action) {
      if (action.id == 'view') {
        if (this.resource.resourceUrl) {
          window.open(this.viewResource.resourceUrl, '_blank');
        }
      }
      if (action.id == 'publish') {
        await approveResource(this.viewResource.id);
        this.$emit('updatedApproval', true);
      }
      if (action.id == 'unpublish') {
        await unapproveResource(this.viewResource.id);
        this.$emit('updatedApproval', false);
      }
      if (action.id == 'addRelated') {
        this.$emit('addRelated', this.viewResource);
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

