<template>
  <div class='resources-search'>
    <div v-if="isLoading">
      <loading-symbol></loading-symbol>
    </div>
    <div v-else class="search-results">
      
      <div class="introduction">
        <div><h1 v-if="title">{{ title }}</h1></div>
        <div><p v-if="summary">{{ summary }}</p></div>
        
        <tag-selector 
          class="tag-cloud" 
          :singleSelect="true" 
          :tags="tagsUsed" 
          v-model="selectedTagFilter"
          @click="handleTagClicked" ></tag-selector>
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
        <p>Doesn't look like we've got any <b>{{ this.title.toLowerCase() }}</b> under the category <b>{{ selectedTagName }}</b>.</p>
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

import { getTagsForResources, searchByResourceTypes } from "@/modules/resources/services/resource-service";
import { useLookupStore } from '@/core/state/lookupStore';
import { ref } from 'vue'


export default {
  name: 'resource-types',

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
  computed: {
    recommendLink() {
      const typeId = this.$route.params.typeId;
      if (typeId) {
        return `/recommend/${typeId}`;
      }
      return '/recommend';
    },
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
      selectedTagName: null,
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
      
      if (isOn) {
        // this.selectedTagFilter = [tag.key];
        // add to query string
        history.pushState(
          {},
          null,
          this.$route.path + '/' + key
        );
        this.filteredSearchResults = this.searchResults.filter( r => r.tags.includes(key));
      } else {
        // this.selectedTagFilter = [];
        this.filteredSearchResults = this.searchResults;
        history.pushState(
          {},
          null,
          `/type/${this.$route.params.typeId}`
        );
      }
    },
    handleOpenPreview(resource) {
      this.clickedResource = resource;
      this.showDetail = true; 
    },
    /**
     * initial load of the page
     */
    async loadSearchResults() {
      this.isLoading = true;
      const typeId = this.$route.params.typeId;
      
      // always load everything for the given type - this won't scale but for now fine
      this.searchResults = await this.getResourceByType(typeId);
      this.tagsUsed = await getTagsForResources(this.searchResults);
      this.filteredSearchResults = this.searchResults;
      
      // apply tag filter 
      const tagId = this.$route.params.tagId;
      if (tagId) {
      
        this.selectedTagFilter = [tagId];
        this.filteredSearchResults = this.searchResults.filter ( r => r.tags.includes(this.$route.params.tagId));

        const store = useLookupStore();
        const tag = store.tags.find( t => t.key == tagId );
        if (tag) {
          this.selectedTagName = tag.value;
        } else {
          this.selectedTagName = tagId;
        }
      }
      
      this.isLoading = false;
    },

    async getResourceByType(type) {
      var typeKeys = [type];

      // always load episodes with podcast series
      if (type == 'podcasts') {
        typeKeys.push('episodes');
      }
      // and broaden web too
      if (type == 'websites') {
        typeKeys.push('posts');
        typeKeys.push('videos');
      }

      // get the description for the selected type
      let item = this.lookupStore.resourceTypes.find( r => r.key == type );
      if (item) {
        if (type == 'websites') {
          this.title = "Web";
        } else {
          this.title = item.value.toUpperCase();
        }
        this.summary = item.description;
      }
      return await searchByResourceTypes(typeKeys);
    },
  },

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
  margin: 10px 10px;
}

.noresults {
  margin-top:50px;
}

.mobile {
  display: none;
}

@media only screen and (max-width: 600px) {
  
  .tag-cloud {
    display: none;
  }

  .introduction {
    display: none;
  }

  .mobile {
    display: block;
  }
}
</style>