<template>
  <modal-dialog 
    :titleIcon="titleIcon"
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
        @back="handleBackButton"
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
import { useLookupStore } from '@/core/state/lookupStore'
import { getResource } from '../services/resource-service';
import { Resource } from "@/modules/resources/model/resource"
import { ref } from 'vue';

export default {
  name: 'resource-detail',
  components: {
    ModalDialog,
    ViewResource,
  },
  setup() {
    const lookupStore = ref(null);
    const userStore = ref(null);
    lookupStore.value = useLookupStore();
    userStore.value = useUserStore();
    return {
      lookupStore,
      userStore,
    }
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
    this.updateHistory();
  },

  computed: { 
    titleIcon() {
      const type = this.lookupStore.resourceTypes.find ( r => r.key == this.viewResource.resourceType);
      if (type) {
        return type.icon;
      } else {
        return null;
      }
    },
    approvalError() {
      let validation = this.viewResource.validate();
      if (validation) {
        // validation[propName].errorMessage exists, but may change to array for this to be easier 
        return "error"
      }
      return null;
    },
    buttonActions() {
      return [
        {
          id: 'view',
          title: "Check it Out",
          iconName: "open_in_new",
          isPrimary: true,
          show: this.viewResource.resourceUrl != null && this.viewResource.resourceUrl.length > 0
        },
      ]
    }
  },      
  
  methods: {

    async handleChangeResource(resource) {
      this.viewResource = resource;
      this.updateHistory();
      this.showBackButton = true;
    },
    async handleBackButton() {
      this.viewResource = await getResource(this.viewResource.parentResourceId);
      this.updateHistory();
      this.showBackButton = false;
    },
    async handleButtonClick(action) {
      if (action.id == 'view') {
        if (this.viewResource.resourceUrl) {
          window.open(this.viewResource.resourceUrl, '_blank');
        }
      }
    },

    updateHistory() {
      history.pushState(
        {},
        null,
        this.$route.path + '?r=' + encodeURIComponent(this.viewResource.id)
      );
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

