<template>
  <div class='resources-search'>
    <div v-if="isLoading">
      <loading-symbol></loading-symbol>
    </div>
    <div v-else class="search-results">
      <div><h1 v-if="title">{{ title }}</h1></div>
      <div><p v-if="summary">{{ summary }}</p></div>

      <div v-if="searchResults.length > 0 && !isLoading" >
        <book-group v-if="books" heading="Books" :resources="books"></book-group>
        <book-group v-if="web" heading="Websites" :resources="web"></book-group>
        <book-group v-if="posts" heading="Posts" :resources="posts"></book-group>
        <book-group v-if="podcasts" heading="Podcasts" :resources="podcasts"></book-group>
        <podcast-episode-group v-if="episodes" heading="Podcast Episodes" :resources="episodes"></podcast-episode-group>
      </div>
      <div v-if="searchResults.length == 0 && !isLoading" class="noresults">
        We couldn't find anything matching, <i>{{ searchTerm }}</i>
      </div>
    
      <!-- <resource-detail 
        :fullscreen="true" 
        v-if="showResourceDetailDialog" 
        :initialMode="showResourceDetailDialogMode" 
        @close="closeDetail" 
        :resourceId="selectedResource ? selectedResource.id : null"></resource-detail>

      <recommend-dialog v-if="showRecommendDialog" @close="showRecommendDialog = false" :resource="selectedResource"></recommend-dialog> -->
    </div>
  </div>
</template>

<script>
// import ResourceDetail from './ResourceDetail.vue'
import LoadingSymbol from "@/core/components/LoadingSymbol.vue";
import BookGroup from '../components/BookGroup.vue'
import PodcastEpisodeGroup from '../components/PodcastEpisodeGroup.vue'
// import RecommendDialog from '@/modules/recommendations/views/RecommendDialog.vue';

import { searchByResourceTypes, searchByTag, searchByText } from '../services/resource-service.js'
import { getTags } from '../services/lookup-service';

export default {
  
  name: 'ResourcesSearch',

  components: {
    LoadingSymbol,
    BookGroup,
    PodcastEpisodeGroup,
  },

  data() {
    return {
      title: null,
      summary: null,
      searchCategory: null,
      searchTerm: null,
      searchResults: [],
      // showResourceDetail: false,
      // showResourceAdd: false,
      // showNewRecommendation: false,
      // showRecommendDialog: false,
      // selectedResource: null,
      isLoading: true,
      // resourceTypes: [],
      // tagsLookup: Object,
      bookResources: {
        type: Array,
        default: [{}]
      }
    }
  },

  async mounted() {
    //const vm = this;

    // close the category list?
    // window.onpopstate = function() {
    //   vm.closeDetail()
    // };

    // this.isLoading = true;
    
    this.loadSearchResults()

    // sometimes the request also needs to load the details modal over the page
    // const resourceId = this.$route.query.r 
    // if (resourceId) {
    //   const resource = this.searchResults.find ( r => r.id == resourceId );
    //   if (resource) {
    //     this.showDetail(resource);
    //   }
    // }
    
    // this.isLoading = false;
  },

  methods: {
    async loadSearchResults() {
      this.isLoading = true;
      if (this.$route.params.typeId) {
        await this.loadResourcesByType(this.$route.params.typeId);
      } else if (this.$route.params.tagId) {
        await this.loadResourcesByTag(this.$route.params.tagId)
      } else if (this.$route.params.searchTerm) {
        await this.loadResourcesByTextSearch(this.$route.params.searchTerm);
      }
      this.isLoading = false;
    },

    async loadResourcesByType(typeKey) {
      var typeKeys = [typeKey];
      // always load episodes with podcast series
      if (typeKey == 'podcasts') {
        typeKeys.push('episodes');
      }
      if (typeKey == 'websites') {
        typeKeys.push('posts');
      }
      this.searchResults = await searchByResourceTypes(typeKeys);
      
    },

    async loadResourcesByTag(tagKey) {
      const lookup = await getTags();
      let item = lookup.items.find( k => k.key == tagKey);
      let tagKeyValue = { key: item.key, value: item.value };
      if (tagKeyValue) {
        this.searchResults = await searchByTag(tagKeyValue);
        this.title = item.value.toUpperCase();
        this.summary = item.description;
      }
    },
    
    async loadResourcesByTextSearch(term) {
      this.searchResults = await searchByText(term);
    },

    // handleMenuAdd() {
    //   this.showResourceDetail = false;
    //   this.showNewRecommendation = false;
    //   this.showResourceAdd = true;
    // },

    // showDetail(resource) {
    //   // silently update url
    //   history.pushState(
    //     {},
    //     null,
    //     this.$route.path + '?r=' + encodeURIComponent(resource.id)
    //   )
    //   this.selectedResource = resource
    //   this.showResourceDetail = true;
    //   this.showResourceAdd = false;
    //   this.showNewRecommendation = false;
    // },

    // showRecommend(resource) {
    //   this.selectedResource = resource;
    //   this.showRecommendDialog = true;
    // },

    // handleLogin() {
    //   this.$router.push('/login')
    // },

    resourcesByType(key) {
      const results = this.searchResults.filter ( resource => resource.resourceType.key == key )
      if (results) {
        return results;
      }
      return [];
    },

    // async closeDetail(reload) {
    //   if (reload) {
    //     await this.loadSearchResults()
    //   }
    //   this.showResourceDetail = false;
    //   this.showResourceAdd = false;
    //   this.showNewRecommendation = false;
    // },

    // layoutClassForType(type) {
    //   if (type.key == 'episodes') {
    //     return 'vertical-list'
    //   }
    //   return 'horizontal-list'
    // }
  },

  computed: {
    // showResourceDetailDialog() {
    //   return (this.showResourceAdd || this.showResourceDetail || this.showNewRecommendation);
    // },

    // showResourceDetailDialogMode() { 
    //   console.log('mpd')
    //   if (this.showResourceAdd) return 'add';
    //   if (this.showResourceDetail) return 'view';
    //   // if (this.showNewRecommendation) {
    //   //   if (this.selectedResource) {
    //   //     return 'addRecommendation';
    //   //   } else {
    //   //     return 'newRecommendation';
    //   //   }
        
    //   // }
    //   return '';
    // },
    books() {
      const results = this.resourcesByType('books')
      return results.length>0 ? results : null
    },
    podcasts() {
      const podcasts = this.resourcesByType('podcasts')
      return podcasts.length>0 ? podcasts : null
    },
    web() {
      const results = this.resourcesByType('websites')
      return results.length>0 ? results : null
    },
    video() {
      const results = this.resourcesByType('video')
      return results.length>0 ? results : null
    },
    episodes() {
      const results = this.resourcesByType('episodes')
      return results.length>0 ? results : null
    },
    posts() {
      const results = this.resourcesByType('posts')
      return results.length>0 ? results : null
    },
    
  }
}

</script>

<style scoped>

.resources-search {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-results {
  width: 100%;
}

h1 {
  font-size: var(--prr-font-size-large);
  margin-top: 20px;
  margin-bottom: 5px;
}

p {
  margin: 0px 10px;
}

.noresults {
  margin-top:100px;
}
</style>