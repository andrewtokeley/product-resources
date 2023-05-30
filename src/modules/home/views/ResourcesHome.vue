<template>
  <div class="resources-home">
    <div v-if="isLoading">
      <loading-symbol></loading-symbol>
    </div>
    <div v-else>
      
      <splide :options="splideOptions" aria-label="Vue Splide Example">
        <SplideSlide v-for="review in featured" :key="review.id">
          <featured-card :review="review" @click="handleViewDetail"></featured-card>
        </SplideSlide>
      </splide>
      
      <section class="featured ">
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
// import 'vue3-carousel/dist/carousel.css'
// import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

import { getPopularByType, getRecentlyAdded } from '@/modules/resources/services/resource-service';
import { reviewStore } from "@/modules/reviews/store/reviewStore";
import ResourceTypeEnum from '@/modules/resources/model/resourceTypeEnum';

export default {
  name: 'resources-home',
  components: { 
    FeaturedCard, 
    BookGroup, 
    LoadingSymbol, 
    ResourceDetail,
    Splide,
    SplideSlide,
  },
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

  computed: {
    splideOptions() {
      return { 
        rewind: true,
        perPage: 1,
        autoplay: true,
        interval: 5000,
        classes: {
          arrows: 'splide__arrows carousel-class-arrows',
          arrow : 'splide__arrow carousel-class-arrow',
          prev  : 'splide__arrow--prev carousel-class-prev',
          next  : 'splide__arrow--next carousel-class-next',
        },
      }
    }
  },

  async mounted() {
    this.isLoading = true;
    this.topBooks = await getPopularByType(ResourceTypeEnum.Books.key);
    this.topPodcasts = await getPopularByType(ResourceTypeEnum.Podcasts.key);
    this.recentlyAdded = await getRecentlyAdded(5);

    // will get some featured reviews if none have been defined for this session yet.
    let store = reviewStore()
    await  store.fetchFeatured();
    this.featured = store.featuredReviews;
    console.log(store.featuredReviews.length);

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

<style>

.carousel-class-prev, .carousel-class-next  {
  width: 4em;
  height: 4em;
}
</style>
<style scoped>
.splide__pagination__page.is-active {
  background: var(--prr-green) !important;
}
</style>
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

section.featured.clear-background {
  background: transparent;
}

</style>