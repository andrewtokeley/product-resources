<template>
  <div class="view-resource">
    <div :style="{ 'min-height': isBook ? '280px' : '200px' }"  class="topblock" >
      <book-card v-if="resource.resourceType.key=='books'" class="card" :showTitle="false" :resource="resource"></book-card>
      <podcast-card v-if="resource.resourceType.key=='podcasts'" class="card" :showTitle="false" :resource="resource"></podcast-card>
      <p>{{resource.description}}</p>
    </div>  
      
    <div class="categories">
      <div v-if="resource.publishedDateFormatted" class="tagGroup">
        <span>Published: </span>
        <span>{{ resource.publishedDateFormatted }}</span>
      </div>
      <div v-if="resource.tags" class="tagGroup">
        <span>Categories: </span>
        <a v-for="tag in resource.tags" :key="tag.key" :href="`/tag/${tag.key}`">{{ tag.value }}</a>
      </div>
      <div class="tagGroup">
        <span>Recommended by: </span>
        <a href="/tag/andrew-tokeley">Andrew Tokeley</a>
      </div>
    </div>
  </div>
</template>

<script>
import { Resource } from "@/modules/resources/model/resource";
import BookCard from "@/modules/resources/components/BookCard.vue";
import PodcastCard from '@/modules/resources/components/PodcastCard.vue';

export default {
  components: { BookCard, PodcastCard },
  name: "view-resource",

  props: {
    resource: {
      type: Resource,
      default: Resource.default()
    }
  },

  mounted() {
    
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


.card {
  float: left;
  margin-right: 25px;
  margin-bottom: 5px;
}

.topblock.smallImage {
  min-height:200px;
}

.topblock.largeImage {
  min-height:250px;
}

.categories {
  float: left;
}

.categories a {
  margin-right: 10px;
}

.categories .tagGroup {
  margin-bottom: 10px;
}
</style>