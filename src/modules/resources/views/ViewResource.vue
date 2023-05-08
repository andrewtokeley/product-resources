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
        <a v-for="tag in resource.tags" :key="tag.key" :href="`/tag/${tag.key}`">{{ tag.value }}</a>
      </div>
    </div>
    <div class="topblock" :class="{ rectangle: isBook, square : !isBook }" >
      <img class="image" :src="resource.imageUrl ?? resource.parentResourceImageUrl" />
      <p>{{resource.description}}</p>
    </div>  
    <div class="recommendations">
      <recommendation-widget 
        v-for="recommendation in recommendations" 
        :key="recommendation.id"
        :recommendation="recommendation">
      </recommendation-widget>
    </div>
    <template v-if="relatedResources?.length > 0">
      <h2>Popular {{ childDescription }}</h2>
      <div v-for="resource in relatedResources" :key="resource.id" 
        class="related"
        @click="$emit('changeResource', resource)">
        <h3>{{ resource.displayName }}</h3>
        <p class="child-description">{{resource.description}}</p>
      </div>
    </template>

  </div>
</template>

<script>
import { Resource } from "@/modules/resources/model/resource";
import RecommendationWidget from '@/modules/recommendations/components/RecommendationWidget.vue';
import { getRecommendations } from "@/modules/recommendations/services/recommendation-service";
import { getRelatedResources } from '../services/resource-service';

export default {
  components: { RecommendationWidget },
  name: "view-resource",
  emit: ['changeResource', 'back'],
  props: {
    resource: {
      type: Resource,
      default: Resource.default()
    },
  },

  data() {
    return {
      recommendations: [],
      relatedResources: [],
    }
  },

  watch: {
    async resource() {
      this.recommendations = await getRecommendations(this.resource.id);
      this.relatedResources = await getRelatedResources(this.resource.id);    
    }
  },

  computed: {
    childDescription() {
      if (this.relatedResources) {
        return this.relatedResources[0].resourceType.value + 's';
      }
      return null;
    },
    isBook() {
        if (this.resource.resourceType) {
          return this.resource.resourceType.key == 'books'
        }
        return false;
      }
  },

}
</script>

<style scoped>
.topblock.square {
  min-height: 150px;
  margin-bottom: 20px;
}
.topblock.rectangle {
  min-height: 240px;
  margin-bottom: 20px;
}
.topblock .image {
  float: left;
  /* margin-right: 25px; */
  margin-bottom: 5px;
}

.topblock img {
  border-radius: 5px;
  object-fit: cover;
  margin-right: 20px;
  border: 1px solid black;
}

.topblock.square img {
  height:150px;
  width:150px;
}

.topblock.rectangle img {
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

.recommendations {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
/* .recommendation {
  width:50%;
  margin: 20px 0px 40px 0px;
} */
.related {
  background: var(--prr-extralightgrey);
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 15px;
  cursor: pointer;
}

.child-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>