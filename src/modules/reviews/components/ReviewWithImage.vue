<template>
  <div class="review-with-image" >
    <div class="image">
      <resource-image 
        v-if="resource" 
        :show-title="true"
        :resource="resource"
        @click="$emit('click', resource)">
      </resource-image>
    </div>
    <div class="review">
      <review-widget :showBy="false" class="quote" :review="review"></review-widget>
      <div v-if="isOwner" class="action-links">
        <base-link-button @click.stop="handleEdit">Edit</base-link-button>
        <base-link-button @click.stop="handleDelete">Delete</base-link-button>
      </div>
    </div>
  </div>
</template>

<script>
import ResourceImage from '@/modules/resources/components/ResourceImage.vue';
import ReviewWidget from '@/modules/reviews/components/ReviewWidget.vue'
import BaseLinkButton from '@/core/components/BaseLinkButton.vue';
import { Review } from '@/modules/reviews/model/review';
import { Resource } from '@/modules/resources/model/resource';
// import { getResource } from '@/modules/resources/services/resource-service';
import { useUserStore } from '@/core/state/userStore';

export default {
  components: { ReviewWidget, ResourceImage, BaseLinkButton },

  name: 'feature-card',
  
  emits: ['click', 'edit', 'delete'],
  
  data() { 
    return { 
      isLoading: true,
      isOwner: false,
    } 
  },  

  props: {
    resource: {
      type: Resource,
      required: true
    },
    review: {
      type: Review,
      required: true
    },
    showImage: {
      type: Boolean,
      default: false,
    }
  },
  
  async mounted() {
    this.isLoading = true;
    // this.resource = await getResource(this.review.resourceId);
    this.isLoading = false;
    const userStore = useUserStore();
    this.isOwner = userStore.uid == this.review.reviewedByUid;
  },

  methods: {
    handleEdit() {
      this.$emit('edit', this.review);
    },
    handleDelete() {
      this.$emit('delete', this.review);
    }
  }
}

</script>

<style scoped>

.review-with-image {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  overflow: hidden;
  margin-top: 20px;
}

.image {
  width: 20%;
  min-width:180px;
  cursor: pointer;
}
.review {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
}
.quote {
  margin-left: auto;
  margin-right: auto;
}

.heading {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
h1 {
  font-size: var(--prr-font-size-medium);
  font-weight: 600;
  margin: 15px 0px 0px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
h2 {
  text-align: center;
  font-size: var(--prr-font-size-medium);
  color: var(--prr-mediumgrey);
  font-weight: normal;
  margin: 5px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-links {
  visibility: hidden;
}
.review-with-image:hover .action-links {
  visibility: visible;
}
.action-links button {
  margin: 0px 10px;
}

@media only screen and (max-width: 600px) {
  .review-with-image {
    flex-direction: column;
    justify-content: center;
  }

  .image, .review {
    display: flex;
    width:100%;
    justify-content: center;
  }

  .action-links {
    visibility: visible;
  }

}

</style>