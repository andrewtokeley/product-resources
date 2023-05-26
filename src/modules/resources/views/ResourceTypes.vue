<template>
  <div class='resources-search'>
    <div v-if="isLoading">
      <loading-symbol></loading-symbol>
    </div>
    <div v-else class="search-results">
      <div class="introduction">
        <div><h1 v-if="title">{{ title }}</h1></div>
        <div><p v-if="summary">{{ summary }}</p></div>
        <tag-selector class="tag-cloud" :singleSelect="true" :tags="tagsUsed" v-model="selectedTagFilter" @tagClicked="handleTagClicked"></tag-selector>
      </div>
      <template v-if="filteredSearchResults.length > 0 && !isLoading" >
        <book-group 
          @click="handleOpenPreview" 
          :showMore="false"
          :showAddRecommendation="true" 
          :isGrouped="true" 
          :resources="filteredSearchResults">
        </book-group>
      </template>
      <div v-if="filteredSearchResults.length == 0 && !isLoading" class="noresults">
        We couldn't find anything matching, <i>{{ searchTerm }}</i>
      </div>
    </div>
    <resource-detail 
      v-if="showDetail" 
      :resource="clickedResource"
      @close="showDetail = false"></resource-detail>
  </div>
</template>

<script>
import ResourceDetail from "@/modules/resources/views/ResourceDetail.vue";
import LoadingSymbol from "@/core/components/LoadingSymbol.vue";
import BookGroup from '@/modules/resources/components/BookGroup.vue';
import TagSelector from "../components/TagSelector.vue";

import { searchByResourceTypes, searchByTagKey, searchByText, getTagsForResources } from "@/modules/resources/services/resource-service";

import { useLookupStore } from '@/core/state/lookupStore';
import { ref } from 'vue'

export default {
  name: 'ResourcesSearch',

  components: {
    LoadingSymbol,
    BookGroup,
    ResourceDetail,
    TagSelector,
  },

  setup() {
    const lookupStore = ref(null);
    lookupStore.value = useLookupStore();
    return {
      lookupStore
    }
  },

  data() {
    return {
      title: null,
      summary: null,
      searchCategory: null,
      searchTerm: null,
      searchResults: [],
      filteredSearchResults: [],
      isLoading: true,
      showDetail: false,
      clickedResource: null,
      tagsUsed: [],
      selectedTagFilter: [],
      bookResources: {
        type: Array,
        default: [{}]
      }
    }
  },

  async mounted() {
    // this.tagsLookup = await getTags();
    // this.resourceTypes = await getResourceTypes();
    await this.loadSearchResults()
  },
  methods: {
    async handleTagClicked(key, isOn) {
      console.log('changed ' + key + ' ' + isOn);
      if (isOn) {
        this.filteredSearchResults = this.searchResults.filter( r => r.tags.includes(key));
      } else {
        this.filteredSearchResults = this.searchResults;
      }
    },
    handleOpenPreview(resource) {
      this.clickedResource = resource;
      this.showDetail = true; 
    },
    async loadSearchResults() {
      this.isLoading = true;
      if (this.$route.params.typeId) {
        await this.loadResourcesByType(this.$route.params.typeId);
      } else if (this.$route.params.tagId) {
        await this.loadResourcesByTag(this.$route.params.tagId)
      } else if (this.$route.params.searchTerm) {
        await this.loadResourcesByTextSearch(this.$route.params.searchTerm);
      }
      this.tagsUsed = await getTagsForResources(this.searchResults);
      this.filteredSearchResults = this.searchResults;
      this.isLoading = false;
    },

    async loadResourcesByType(typeKey) {
      var typeKeys = [typeKey];

      // always load episodes with podcast series
      if (typeKey == 'podcasts') {
        typeKeys.push('episodes');
      }
      // and broaden web too
      if (typeKey == 'websites') {
        typeKeys.push('posts');
        typeKeys.push('videos');
      }

      // get the description for the selected type
      let item = this.lookupStore.resourceTypes.find( r => r.key == typeKey );
      if (item) {
        this.title = item.value.toUpperCase();
        this.summary = item.description;
      }
      this.searchResults = await searchByResourceTypes(typeKeys);
    },

    async loadResourcesByTag(tagKey) {
      // let item = this.tagsLookup.items.find( k => k.key == tagKey);
      // let tagKeyValue = { key: item.key, value: item.value };
      // if (tagKeyValue) {
        this.searchResults = await searchByTagKey(tagKey);

        let item = this.tags.find( t => t.key == tagKey);
        this.title = item.value.toUpperCase();
        this.summary = item.description;
    },
    
    async loadResourcesByTextSearch(term) {
      this.searchResults = await searchByText(term);
    },

    resourcesByType(key) {
      const results = this.searchResults.filter ( resource => resource.resourceType == key )
      if (results) {
        return results;
      }
      return [];
    },

  },

  computed: {
    
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
    people() {
      const results = this.resourcesByType('people')
      return results.length>0 ? results : null
    },
    videos() {
      const results = this.resourcesByType('videos')
      return results.length>0 ? results : null
    }
    
  }
}

</script>

<style scoped>
.introduction {
  background: var(--prr-lightgrey);
  border-radius: 15px;
  padding: 5px 15px 15px 15px;
}
.introduction p {
  margin-bottom: 15px;
}

.introduction .label {
  margin-left: 10px;
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
  margin-top: 10px;
  margin-bottom: 5px;
}

p {
  margin: 0px 10px;
}

.noresults {
  margin-top:100px;
}

@media only screen and (max-width: 600px) {
  
  .tag-cloud {
    display: none;
  }
}
</style>