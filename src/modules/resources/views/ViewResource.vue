<template>
  <div class="view-resource">
    <div class="topblock" :class="{ rectangle: isBook, square : !isBook }" >
      <img class="image" :src="resource.imageUrl" />
      <p>{{resource.description}}</p>
    </div>  
    <div class="recommendations">
      <recommendation-widget 
        v-for="recommendation in recommendations" 
        :key="recommendation.id"
        :recommendation="recommendation">
      </recommendation-widget>
    </div>
    <div class="categories">
      <div v-if="resource.publishedDateFormatted" class="tagGroup">
        <span class="label">Published: </span>
        <span>{{ resource.publishedDateFormatted }}</span>
      </div>
      <div v-if="resource.tags && resource.tags.length > 0" class="tagGroup">
        <span class="label">Categories: </span>
        <a v-for="tag in resource.tags" :key="tag.key" :href="`/tag/${tag.key}`">{{ tag.value }}</a>
      </div>
    </div>

  </div>
</template>

<script>
import { Resource } from "@/modules/resources/model/resource";
import RecommendationWidget from '@/modules/recommendations/components/RecommendationWidget.vue';
import { getRecommendations } from "@/modules/recommendations/services/recommendation-service";

export default {
  components: { RecommendationWidget },
  name: "view-resource",

  props: {
    resource: {
      type: Resource,
      default: Resource.default()
    },
  },

  data() {
    return {
      recommendations: [],
    }
  },

  async mounted() {
    this.recommendations = await getRecommendations(this.resource.id);
  },

  computed: {
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

</style>