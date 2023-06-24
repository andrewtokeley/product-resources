<template>
  <div class='search-results'>
    <div v-if="isLoading">
      <loading-symbol></loading-symbol>
    </div>
    <div v-else class="search-results">
      <div class="introduction">
        <div><h1 v-if="title">{{ title }}</h1></div>
        <div><p v-if="summary">{{ summary }}</p></div>
      </div>
      <div v-if="searchResults.length > 0 && !isLoading" >
        <book-group 
          v-if="searchResults" 
          heading="Results" 
          :showMore="true"
          :resources="searchResults"
          :showDescription="true" 
          :includeItemCount="false" 
          :showAddRecommendation="false"
          @click="handleShowDetail">
        </book-group>
      </div>
      <div v-if="searchResults.length == 0 && !isLoading" class="noresults">
        <p>We couldn't find anything matching, <i>{{ searchTerm }}</i></p>
        <p>If you think we've missed something amazing, <router-link to="/recommend">let us know</router-link> :-)</p>
        
      </div>
    </div>
    <resource-detail 
      v-if="showDetail" 
      :resource="clickedResource"
      @close="showDetail = false"></resource-detail>
  </div>
</template>

<script>
import LoadingSymbol from "@/core/components/LoadingSymbol.vue";
import BookGroup from '@/modules/resources/components/BookGroup.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';

import { searchByTagKey, searchByText } from '@/modules/resources/services/resource-service.js'
import { getTags } from '@/modules/resources/services/lookup-service.js'
import { logAppEvent } from "@/core/services/analytics";

export default {
  name: 'search-results',
  components: { LoadingSymbol, BookGroup, ResourceDetail},
  data() {
    return {
      title: null,
      summary: null,
      searchTag: null,
      searchTerm: null,
      searchResults: [],
      tags: [],
      isLoading: true,
      showDetail: false,
      clickedResource: null,
    }
  },

  async mounted() {
    const lookup = await getTags();
    this.tags = lookup.items;
    this.searchTag = this.$route.params.tagId;
    this.searchTerm = this.$route.params.searchTerm;
    this.title = `Search results for '${this.searchTag ? this.searchTag : this.searchTerm}'`;
    await this.loadSearchResults()
  },

  methods: {
    handleShowDetail(resource) {
      this.clickedResource = resource;
      this.showDetail = true;
    },
    async loadSearchResults() {
      this.isLoading = true;
      if (this.searchTag) {
        await this.loadResourcesByTag(this.searchTag);
      } else if (this.searchTerm) {
        await this.loadResourcesByTextSearch(this.searchTerm);
      }
      this.isLoading = false;
    },

    async loadResourcesByTag(tagKey) {
      // let item = this.tags.find( k => k.key == tagKey);
      // let tagKeyValue = { key: item.key, value: item.value };
      // if (tagKeyValue) {
        this.searchResults = await searchByTagKey(tagKey);
        
        logAppEvent('search', { 
          search_term: tagKey, 
          search_scope: 'global-tag',
          search_results: this.searchResults.length > 0 ? 'true' : 'false' 
        });
        
        let item = this.tags.find( t => t.key == tagKey);
        this.title = item.value.toUpperCase();
        this.summary = item.description;
    },
      
    async loadResourcesByTextSearch(term) {
      this.searchResults = await searchByText(term);
      logAppEvent('search', { 
          search_term: term, 
          search_scope: 'global-text',
          search_results: this.searchResults.length > 0 ? 'true' : 'false' 
        });
    },

    // resourcesByType(key) {
    //   const results = this.searchResults.filter ( resource => resource.resourceType.key == key )
    //   if (results) {
    //     return results;
    //   }
    //   return [];
    // },

  },

  computed: {
    
    // books() {
    //   const results = this.resourcesByType('books')
    //   return results.length>0 ? results : null
    // },
    // podcasts() {
    //   const podcasts = this.resourcesByType('podcasts')
    //   return podcasts.length>0 ? podcasts : null
    // },
    // web() {
    //   const results = this.resourcesByType('websites')
    //   return results.length>0 ? results : null
    // },
    // video() {
    //   const results = this.resourcesByType('video')
    //   return results.length>0 ? results : null
    // },
    // episodes() {
    //   const results = this.resourcesByType('episodes')
    //   return results.length>0 ? results : null
    // },
    // posts() {
    //   const results = this.resourcesByType('posts')
    //   return results.length>0 ? results : null
    // },
    // people() {
    //   const results = this.resourcesByType('people')
    //   return results.length>0 ? results : null
    // },
    // videos() {
    //   const results = this.resourcesByType('videos')
    //   return results.length>0 ? results : null
    // }
    
  }
}

</script>

<style scoped>
.introduction {
  background: var(--prr-lightgrey);
  border-radius: 15px;
  padding: 15px 15px 25px 15px;
}
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
  font-size: var(--prr-font-size-huge);
  margin-top: 20px;
  margin-bottom: 5px;
}

/* p {
  margin: 0px 10px;
} */

.noresults {
  margin-top:50px;
}
</style>