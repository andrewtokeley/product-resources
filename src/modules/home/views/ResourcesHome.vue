<template>
  <div class="resources-home">
    <div v-if="isLoading">
      <loading-symbol></loading-symbol>
    </div>
    <div v-else>
      <section class="featured">  
        <template  v-for="recommendation in featured" :key="recommendation.id">
          <Suspense>
            <featured-card class="card" :recommendation="recommendation"></featured-card>
          </Suspense>
        </template>   
      </section>
      
      <section class="featured">
        <book-group heading="Recently Added" headingIcon="new_releases" :isGrouped="false" :resources="recentlyAdded" :includeItemCount="false" :singleRow="true"></book-group>
      </section>

      <section class="featured">
        <book-group heading="Popular Books" headingIcon="import_contacts" headingLink="/type/books" :resources="topBooks" :includeItemCount="false" :singleRow="true"></book-group>
      </section>
      
      <section class="featured">
        <book-group heading="Popular Podcasts"  headingLink="/type/podcasts"  :resources="topPodcasts" :includeItemCount="false" :singleRow="true"></book-group>
      </section>
    </div>
  </div>
</template>

<script>
import FeaturedCard from "@/modules/home/components/FeaturedCard.vue";
import { getFeaturedRecommendations } from '@/modules/recommendations/services/recommendation-service';
import { searchByResourceTypes, getRecentlyAdded } from '@/modules/resources/services/resource-service';
import BookGroup from '@/modules/resources/components/BookGroup.vue';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';

export default {
  name: 'resources-home',
  components: { FeaturedCard, BookGroup, LoadingSymbol },
  data() {
    return {
      featured: [],
      topBooks: [],
      topPodcasts: [],
      recentlyAdded: [],
      isLoading: true,
    }
  },
  async mounted() {
    // this.featured = await getFeaturedRecommendations('podcasts', 2);
    this.isLoading = true;
    this.featured = await getFeaturedRecommendations(2);
    this.topBooks = await searchByResourceTypes(['books'], 5);
    this.topPodcasts = await searchByResourceTypes(['podcasts'], 5);
    this.recentlyAdded = await getRecentlyAdded(5);
    this.isLoading = false;
  }
}
</script>

<style scoped>

.resources-home {
  display:block;
}
.resources-home.loading {
  display:none;
}

section {
  margin-top:30px;
  border-radius: 15px;
  background: var(--prr-extralightgrey);
  overflow: hidden;
  padding: 0px 10px;
}
section.featured {
  width: 100%;
  display:flex;
  justify-content: space-around;
  gap:20px;
  flex-wrap: wrap;
}

</style>