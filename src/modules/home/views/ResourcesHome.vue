<template>
  <div class="resources-home">
    <div v-if="isLoading">
      <loading-symbol></loading-symbol>
    </div>
    <div v-else>
      <!-- <section class="featured clearbackground">   -->
        <carousel :items-to-show="2" :wrap-around="true">
          <slide v-for="review in featured" :key="review.id">
            <featured-card 
              :review="review"
              class="carousel__item" 
              @click="handleViewDetail">
            </featured-card>
          </slide>

          <template #addons>
            <navigation />
          </template>
        </carousel>
        <carousel :items-to-show="3" :wrap-around="true">
          <slide v-for="slide in 10" :key="slide">
            <div class="carousel__item">{{ slide }}</div>
          </slide>

          <template #addons>
            <navigation />
          </template>
        </carousel>
        
      <!-- </section> -->
      
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
import 'vue3-carousel/dist/carousel.css'

import { Carousel, Slide, Navigation } from 'vue3-carousel'

import { searchByResourceTypes, getRecentlyAdded } from '@/modules/resources/services/resource-service';
import { reviewStore } from "@/modules/reviews/store/reviewStore";

export default {
  name: 'resources-home',
  components: { 
    FeaturedCard, 
    BookGroup, 
    LoadingSymbol, 
    ResourceDetail,
    Carousel, 
    Slide,  
    Navigation },
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
    this.topBooks = await searchByResourceTypes(['books'], 5);
    this.topPodcasts = await searchByResourceTypes(['podcasts'], 5);
    this.recentlyAdded = await getRecentlyAdded(5);

    // will get some featured reviews if none have been defined for this session yet.
    let store = reviewStore()
    store.fetchFeatured();
    this.featured = store.featuredReviews;

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

section.carousel {
  background: transparent;
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