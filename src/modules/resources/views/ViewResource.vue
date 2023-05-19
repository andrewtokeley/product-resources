<template>
  <div class="view-resource">
    <div class="categories">
      <div v-if="resource.parentResourceName" class="tagGroup singleRow">
        <span class="label">Parent Resource: </span>
        <span><a @click="$emit('back')">{{ resource.parentResourceName }}</a></span>
      </div>
      <div v-if="resource.publishedDateFormatted" class="tagGroup">
        <span class="label">Published: </span>
        <span>{{ resource.publishedDateFormatted }}</span>
      </div>
      <div v-if="resource.tags && resource.tags.length > 0" class="tagGroup">
        <span class="label">Categories: </span>
        <a v-for="tag in resource.tags" :key="tag.key" :href="`/tag/${tag}`">{{ tagDescription(tag) }}</a>
      </div>
    </div>
    <div class="topblock" :class="{ tall: isImageTall, short : !isImageTall }" >
      <resource-image class="image" @click="handleOpenResource(resource)" :resource="resource" :hideActions="true"></resource-image>
      <p>{{resource.description}}</p>
    </div>
    <div v-if="!isLoading">
      <div class="reviews">
        <review-widget 
          v-for="review in reviews" 
          :key="review.id"
          :review="review">
        </review-widget>
      </div>
      <div class="related" v-if="relatedResources?.length > 0">
        <hr class="divider" />
        <h2>Recommended {{ childDescription }}</h2>
        <div v-for="resource in relatedResources" :key="resource.id" @click="$emit('changeResource',resource)">
          <book-card :resource="resource" :preview="true" :showTitle="false" :showDescription="true"></book-card>  
        </div>
      </div>
      <loading-symbol v-if="isLoading" class="loader"></loading-symbol>
    </div>    

  </div>
</template>

<script>
import { Resource } from "@/modules/resources/model/resource";
import ReviewWidget from '@/modules/reviews/components/ReviewWidget.vue';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';

import { getReviewsForResource } from "@/modules/reviews/services/review-service";
import { getRelatedResources } from '../services/resource-service';
import { getTags } from '../services/lookup-service';

export default {
  components: { ReviewWidget, LoadingSymbol },
  name: "view-resource",
  emit: ['changeResource', 'back'],
  props: {
    resource: {
      type: Resource,
      default: Resource.default()
    },
    showUnapprovedReviews: {
      type: Boolean,
      default: false,
    }
  },
  beforeCreate() {
  // this is needed to avoid circular references - the recommend dialog contains the resource image which contains the dialog
  this.$options.components.ResourceImage = require("@/modules/resources/components/ResourceImage.vue").default;
  this.$options.components.BookCard = require("@/modules/resources/components/BookCard.vue").default;
},
  data() {
    return {
      // recommendations: [],
      relatedResources: [],
      tags: [],
      reviews: [],
      isLoading: true,
    }
  },

  async mounted() {
    const lookup = await getTags();
    this.tags = lookup.keyValues;
    this.refreshRelatedData();
  },

  watch: {
    async resource() {
      console.log('here');
      this.refreshRelatedData();
    }
  },
  methods: {
    async refreshRelatedData() {
      this.isLoading = true;
      this.relatedResources = await getRelatedResources(this.resource.id);    
      this.reviews = await getReviewsForResource(this.resource.id, this.showUnapprovedReviews);
      this.isLoading = false;
    },
    tagDescription(key) {
      return this.tags.find( t => t.key == key )?.value;
    },
    handleOpenResource(resource) {
      if (resource.resourceUrl) {
        window.open(resource.resourceUrl, '_blank');
      }
    }
  },
  computed: {
    childDescription() {
      if (this.relatedResources) {
        return this.relatedResources[0].resourceType;
      }
      return null;
    },
    isImageTall() {
        if (this.resource.imageShape == 'portrait') {
          return true;
        }
        return false;
      }
  },

}
</script>

<style scoped>
.topblock.short {
  min-height: 150px;
  margin-bottom: 20px;
}
.topblock.tall {
  min-height: 240px;
  margin-bottom: 20px;
}
.topblock .image {
  float: left;
  /* margin-right: 25px; */
  margin-bottom: 5px;
  margin-right: 15px;
}

.topblock img {
  border-radius: 5px;
  object-fit: cover;
  margin-right: 20px;
  border: 1px solid black;
}

.topblock.short img {
  height:150px;
  width:150px;
}

.topblock.tall img {
  width:150px;
  height:240px;
}
.topblock p {
  white-space: pre-wrap;
}

.tagGroup.singleRow{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.singleRow .label {
  text-overflow: ellipsis;
}

.categories a {
  margin-right: 10px;
}

.categories .tagGroup {
  margin-bottom: 10px;
}

.label {
  color: var(--prr-mediumgrey);
}

.reviews {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
.related h2{
  text-transform:capitalize;
}

.child-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>