<template>
  <div class='page' >
    <header-bar @menuAdd="handleMenuAdd"></header-bar>
    <div class='content'>
      <div v-if="isLoading">
        <loading-symbol></loading-symbol>
      </div>
      <div><h1 v-if="title">{{ title }}</h1></div>
      <div><p v-if="summary">{{ summary }}</p></div>

      <div v-if="searchResults.length > 0 && !isLoading" class="search-results">
        <book-group v-if="books" @recommend="showRecommend" @click="showDetail" heading="Books" :resources="books"></book-group>
        <book-group v-if="web" @recommend="showRecommend" @click="showDetail" heading="Websites" :resources="web"></book-group>
        <book-group v-if="posts" @recommend="showRecommend" @click="showDetail" heading="Posts" :resources="posts"></book-group>
        <book-group v-if="podcasts" @recommend="showRecommend" @click="showDetail" heading="Podcasts" :resources="podcasts"></book-group>
        <podcast-episode-group v-if="episodes" @recommend="showRecommend" @click="showDetail" heading="Podcast Episodes" :resources="episodes"></podcast-episode-group>
      </div>
      <div v-if="searchResults.length == 0 && !isLoading" class="noresults">
        We couldn't find anything matching, <i>{{ searchTerm }}</i>
      </div>
    </div>

    <resource-detail :fullscreen="true" v-if="showResourceDetailDialog" :initialMode="showResourceDetailDialogMode" @close="closeDetail" :resourceId="selectedResource ? selectedResource.id : null"></resource-detail>
    <recommend-dialog v-if="showRecommendDialog" @close="showRecommendDialog = false" :resource="selectedResource"></recommend-dialog>
  </div>
</template>

<script>
import ResourceDetail from './ResourceDetail.vue'
import HeaderBar from "@/core/components/HeaderBar.vue";
import LoadingSymbol from "@/core/components/LoadingSymbol.vue";

import { searchByResourceTypes, searchByTag, searchByText } from '../services/resource-service.js'
import BookGroup from '../components/BookGroup.vue'
// import PodcastGroup from '../components/PodcastGroup.vue'
import PodcastEpisodeGroup from '../components/PodcastEpisodeGroup.vue'
import { getTags } from '../services/lookup-service';
import RecommendDialog from '@/modules/recommendations/views/RecommendDialog.vue';

export default {
  
  name: 'ResourcesSearch',

  components: {
    ResourceDetail,
    HeaderBar,
    LoadingSymbol,
    BookGroup,
    PodcastEpisodeGroup,
    RecommendDialog,
  },

  data() {
    return {
      title: null,
      summary: null,
      searchCategory: null,
      searchTerm: null,
      searchResults: [],
      showResourceDetail: false,
      showResourceAdd: false,
      showNewRecommendation: false,
      showRecommendDialog: false,
      selectedResource: null,
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
    const vm = this;

    window.onpopstate = function() {
      vm.closeDetail()
    };

    this.isLoading = true;
    
    this.loadSearchResults()

    // sometimes the request also needs to load the details modal over the page
    const resourceId = this.$route.query.r 
    if (resourceId) {
      const resource = this.searchResults.find ( r => r.id == resourceId );
      if (resource) {
        this.showDetail(resource);
      }
    }
    
    this.isLoading = false;
  },

  methods: {
    async loadSearchResults() {
      if (this.$route.params.typeId) {
        await this.loadResourcesByType(this.$route.params.typeId);
      } else if (this.$route.params.tagId) {
        await this.loadResourcesByTag(this.$route.params.tagId)
      } else if (this.$route.params.searchTerm) {
        await this.loadResourcesByTextSearch(this.$route.params.searchTerm);
      }
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

    handleMenuAdd() {
      this.showResourceDetail = false;
      this.showNewRecommendation = false;
      this.showResourceAdd = true;
    },

    showDetail(resource) {
      // silently update url
      history.pushState(
        {},
        null,
        this.$route.path + '?r=' + encodeURIComponent(resource.id)
      )
      this.selectedResource = resource
      this.showResourceDetail = true;
      this.showResourceAdd = false;
      this.showNewRecommendation = false;
    },

    showRecommend(resource) {
      this.selectedResource = resource;
      this.showRecommendDialog = true;
    },

    handleLogin() {
      this.$router.push('/login')
    },

    resourcesByType(key) {
      const results = this.searchResults.filter ( resource => resource.resourceType.key == key )
      if (results) {
        return results;
      }
      return [];
    },

    async closeDetail(reload) {
      if (reload) {
        await this.loadSearchResults()
      }
      this.showResourceDetail = false;
      this.showResourceAdd = false;
      this.showNewRecommendation = false;
    },

    layoutClassForType(type) {
      if (type.key == 'episodes') {
        return 'vertical-list'
      }
      return 'horizontal-list'
    }
  },

  computed: {
    showResourceDetailDialog() {
      return (this.showResourceAdd || this.showResourceDetail || this.showNewRecommendation);
    },

    showResourceDetailDialogMode() { 
      console.log('mpd')
      if (this.showResourceAdd) return 'addResource';
      if (this.showResourceDetail) return 'viewResource';
      if (this.showNewRecommendation) {
        if (this.selectedResource) {
          return 'addRecommendation';
        } else {
          return 'newRecommendation';
        }
        
      }
      return '';
    },
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

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 860px;
}

.content.loading {
  display: none;
}

.content h1 {
  font-size: var(--prr-font-size-large);
  margin-top: 20px;
  margin-bottom: 5px;
}
.content p {
  margin: 0px 10px;
}

.searchWrapper {
  display:flex;
  flex-direction: row;
  align-items: center;
  width: 80%;
  height: 100px;
  border-radius: 18px;
  background: white;
  padding: 20px;
}

.search-results {
  width: 100%;
  overflow-x:hidden;
  margin-bottom: 100px;
}

.searchInput {
  width: 90%;
}

.horizontal-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-x: scroll;
}

.vertical-list {
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
}

.resource-item {
  padding: 10px;
  cursor: pointer;
}

.noresults {
  margin-top:100px;
}
</style>