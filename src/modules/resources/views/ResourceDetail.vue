<template>
  <modal-dialog 
    :titleIcon="titleIcon"
    :title="viewResource.displayName" 
    :subTitle="viewResource.authorsList"
    :iconActions="iconActions"
    :buttonActions="buttonActions"
    :fullscreen="true"
    :isLoading="false"
    :showBackButton="showBackButton"
    @close="handleClose" 
    @buttonClick="handleButtonClick"
    @iconClick="handleIconClick"
    @backButtonClick="handleBackButton"
  >
    <div>
      <view-resource
        v-if="!isLoading && reviews"
        :resource="viewResource"
        :reviews="reviews"
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
import { getReviewsForResource } from '@/modules/reviews/services/review-service';
import { Resource } from "@/modules/resources/model/resource"
import { ref } from 'vue';
import { logResourceSelect } from '@/core/services/analytics';

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
      reviews: null,
      showBackButton: false,
      isLoading: true,
    }
  },

  
  async mounted() {
    this.isLoading = true;
    this.viewResource = cloneDeep(this.resource);
    this.reviews = await getReviewsForResource(this.resource.id, this.showUnapprovedReviews);
    this.updateHistory();
    this.isLoading = false;
  },

  computed: { 
    hasReviewed() {
      if (this.reviews) {
        const reviewed = this.reviews.filter( r => r.reviewedByUid == this.userStore.uid);
        return reviewed.length != 0;
      } else {
        return true; // assume they have reviewed so they can't review until we know for sure
      }
      
    },
    titleIcon() {
      const type = this.lookupStore.resourceTypes.find ( r => r.key == this.viewResource.resourceType);
      if (type) {
        return type.icon;
      } else {
        return null;
      }
    },
    iconActions() {
      return [
        {
          id: 'edit',
          iconName: 'edit',
          show: this.userStore.isAdmin,
        }
      ]
    },
    buttonActions() {
      return [
        {
          id: 'view',
          title: this.viewResource.actionText,
          isPrimary: true,
        },
        {
          id: 'review',
          title: "Review...",
          show: !this.hasReviewed,
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

    async handleIconClick(action) {
      if (action.id == 'edit') {
        this.$router.push(`/admin/resources?edit=${this.viewResource.id}`);
      }
    },

    updateHistory() {
      logResourceSelect(this.viewResource);
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

