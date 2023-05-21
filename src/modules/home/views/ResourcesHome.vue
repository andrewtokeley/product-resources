<template>
  <div class="resources-home">
    <div v-if="isLoading">
      <loading-symbol></loading-symbol>
    </div>
    <div v-else>
      <section class="featured clearbackground">  
        <featured-card 
        v-for="review in featured" :key="review.id"
        :review="review"
        class="card" 
        :recommendation="recommendation"
        @click="handleViewDetail"></featured-card>
      </section>
      
      <section class="featured">
        <book-group   
        heading="Recently Added" 
        headingIcon="new_releases" 
        :isGrouped="false" 
        :resources="recentlyAdded" 
        :includeItemCount="false" 
        :singleRow="true"
        @click="handleViewDetail"></book-group>
      </section>

      <section class="featured">
        <book-group 
        heading="Popular Books" 
        headingIcon="import_contacts" 
        headingLink="/type/books" 
        :isGrouped="false" 
        :resources="topBooks" 
        :includeItemCount="false" 
        :singleRow="true"
        @click="handleViewDetail"></book-group>
      </section>
      
      <section class="featured">
        <book-group 
        heading="Popular Podcasts"  
        headingLink="/type/podcasts"
        headingIcon="podcasts" 
        :isGrouped="false" 
        :resources="topPodcasts" 
        :includeItemCount="false" 
        :singleRow="true"
        @click="handleViewDetail"></book-group>
      </section>
    </div>
    <resource-detail v-if="showDetail" :resource="clickedResource" @close="showDetail = false"></resource-detail>
  </div>
</template>

<script>
import FeaturedCard from "@/modules/home/components/FeaturedCard.vue";
import ResourceDetail from "@/modules/resources/views/ResourceDetail.vue";
import BookGroup from '@/modules/resources/components/BookGroup.vue';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';

import { getFeaturedReviews } from "@/modules/reviews/services/review-service";
import { searchByResourceTypes, getRecentlyAdded } from '@/modules/resources/services/resource-service';

export default {
  name: 'resources-home',
  components: { FeaturedCard, BookGroup, LoadingSymbol, ResourceDetail },
  data() {
    return {
      featured: [],
      topBooks: [],
      topPodcasts: [],
      recentlyAdded: [],
      clickedResource: null,
      isLoading: true,
      showDetail: false,
    }
  },
  async mounted() {
    this.isLoading = true;
    this.featured = await getFeaturedReviews(2); //getFeaturedRecommendations(2);
    this.topBooks = await searchByResourceTypes(['books'], 5);
    this.topPodcasts = await searchByResourceTypes(['podcasts'], 5);
    this.recentlyAdded = await getRecentlyAdded(5);
    this.isLoading = false;
  },

  methods: {
    handleViewDetail(resource) {
      this.clickedResource = resource;
      this.showDetail = true;
    },
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

section.featured.clearbackground {
  background: transparent;
}

</style>