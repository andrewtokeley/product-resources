<template>
  <div class="resources-home">
    <div v-if="isLoading">
      <loading-symbol></loading-symbol>
    </div>
    <div v-else>
      
      <h1>Recommended by the community, for the community</h1>
      <p>Product people are a generous bunch, regularly sharing their latest good read, podcast episode or article. 
        Having a home for these recommendations is the inspiration for creating this site and what keeps it alive, 
        relevant and supportive of the growing number of professional product leaders around the world.</p>
      <p>What resource or person do you <router-link to="/recommend">recommend</router-link> to your peers?</p>
      
      <loading-symbol v-if="!homePageResourceTypes"></loading-symbol>
      <section class="featured" v-for="type in homePageResourceTypes" :key="type.key">
        <book-group 
        :heading="`Popular ${type.value}`"  
        :headingLink="`/type/${type.key}`"
        :headingIcon="type.icon" 
        :description="type.description"
        :isGrouped="false" 
        :resources="type.resources" 
        :includeItemCount="false" 
        :singleRow="true"
        @click="handleViewDetail"></book-group>
      </section>

      <loading-symbol v-if="!homePageTags"></loading-symbol>
      <section class="featured" v-for="tag in homePageTags" :key="tag.key">
        <book-group 
        :heading="tag.value"  
        :headingIcon="tag.icon" 
        :headingLink="`/tag/${tag.key}`"
        :description="tag.description"
        :isGrouped="false" 
        :resources="tag.resources" 
        :includeItemCount="false" 
        :singleRow="true"
        @click="handleViewDetail"></book-group>
      </section>

    </div>
    <resource-detail v-if="showDetail" :resource="clickedResource" @close="showDetail = false"></resource-detail>
  </div>
</template>

<script>
// import FeaturedCard from "@/modules/home/components/FeaturedCard.vue";
import ResourceDetail from "@/modules/resources/views/ResourceDetail.vue";
import BookGroup from '@/modules/resources/components/BookGroup.vue';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';
// import 'vue3-carousel/dist/carousel.css'
// import { Carousel, Slide, Navigation } from 'vue3-carousel'
// import { Splide, SplideSlide } from '@splidejs/vue-splide';
// import '@splidejs/vue-splide/css';

import { getPopularResources, getRecentlyAdded, searchByTagKey } from '@/modules/resources/services/resource-service';
// import { reviewStore } from "@/modules/reviews/store/reviewStore";
// import ResourceTypeEnum from '@/modules/resources/model/resourceTypeEnum';
import { getHomePageTags, getHomePageResourceTypes } from '@/modules/resources/services/lookup-service';

export default {
  name: 'resources-home',
  components: { 
    // FeaturedCard, 
    BookGroup, 
    LoadingSymbol, 
    ResourceDetail,
    // Splide,
    // SplideSlide,
  },
  data() {
    return {
      homePageTags: null,
      homePageResourceTypes: [],
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
    // getPopularResources([ResourceTypeEnum.Books.key, ResourceTypeEnum.Podcasts.key]).then ((favourites) => {
    //   this.topBooks = favourites.filter ( r => r.resourceType == ResourceTypeEnum.Books.key)
    //   this.topPodcasts = favourites.filter ( r => r.resourceType == ResourceTypeEnum.Podcasts.key)
    // });

    getRecentlyAdded(10).then ((results) => {
      this.recentlyAdded = results;
    });

    getHomePageTags().then (async (results) => {
      let tags = results;
      for (let i = 0; i < tags.length; i++) {
        tags[i].resources = await this.resourcesByTag(tags[i].key);
      }
      this.homePageTags = tags;
    })
    getHomePageResourceTypes().then (async (results) => {
      let types = results;
      for (let i = 0; i < types.length; i++) {
        types[i].resources = await getPopularResources([types[i].key]);
      }
      this.homePageResourceTypes = types;
    })    
    this.isLoading = false;
  },

  methods: {
    async resourcesByTag(tagKey) {
      const results = await searchByTagKey(tagKey, 10);
      return results;
    },
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
  box-sizing: border-box;
}

section.featured.clear-background {
  background: transparent;
}

</style>