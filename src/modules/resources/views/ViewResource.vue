<template>
  <div class="view-resource">
    <div>
      <book-card v-if="resource.resourceType.key=='books'" class="card" :showTitle="false" :resource="resource"></book-card>
      <podcast-card v-if="resource.resourceType.key=='podcasts'" class="card" :showTitle="false" :resource="resource"></podcast-card>
      
      <div class="categories">
      <div class="tagGroup">
        <span>Tags: </span>
        <a v-for="tag in resource.tags" :key="tag.key" :href="`/tag/${tag.key}`">{{ tag.value }}</a>
      </div>
      <div class="tagGroup">
        <span>Recommended by: </span>
        <a href="/tag/andrew-tokeley">Andrew Tokeley</a>
      </div>
    </div>  
    
      <p>{{resource.description}}</p>
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
      },
    },

}
</script>

<style scoped>


.card {
  float: left;
  margin-right: 15px;
  margin-bottom: 5px;
}
/* 
img.book {
  height:215px;
  width: 140px;
} */

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