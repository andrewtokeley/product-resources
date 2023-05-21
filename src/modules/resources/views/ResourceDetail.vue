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
        v-if="!isLoading"
        :resource="viewResource"
        :showUnapprovedReviews="showUnapprovedReviews"
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
  emits: ["close"],
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
    },
    showUnapprovedReviews: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      viewResource: Resource.default(),
      showBackButton: false,
      isLoading: true,
    }
  },

  
  mounted() {
    this.isLoading = true;
    this.viewResource = cloneDeep(this.resource);
    this.updateHistory();
    this.isLoading = false;
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
    buttonActions() {
      return [
        {
          id: 'view',
          title: "Check it Out",
          iconName: "open_in_new",
          isPrimary: true,
        },
        {
          id: 'review',
          title: "Write a Review...",
          isSecondary: true,
          align: 'left',
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
      } else if (action.id == 'review') {
        this.$router.push(`/review/${this.viewResource.id}`);
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

