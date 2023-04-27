<template>
  <div class='resources' >
    <header-bar @menuAdd="handleMenuAdd"></header-bar>
    <div class='content'>
      <div v-if="isLoading">
        <loading-symbol></loading-symbol>
      </div>
      <div v-if="searchResults.length > 0 && !isLoading" class="search-results">
        <book-group v-if="books" @click="showDetail" heading="Books" :resources="books"></book-group>
        <podcast-group v-if="podcasts" @click="showDetail" heading="Podcasts" :resources="podcasts"></podcast-group>
        <podcast-episode-group v-if="episodes" @click="showDetail" heading="Podcast Episodes" :resources="episodes"></podcast-episode-group>
      </div>
      <div v-if="searchResults.length == 0 && !isLoading" class="noresults">
        We couldn't find anything matching, <i>{{ searchTerm }}</i>
      </div>
    </div>

    <resource-detail :fullscreen="true" v-if="showResourceDetail || showResourceAdd" :mode="showResourceAdd ? 'add' : 'view'" @close="closeDetail" :resourceId="selectedResource ? selectedResource.id : null"></resource-detail>
    
  </div>
</template>

<script>
import ResourceDetail from './ResourceDetail.vue'
import HeaderBar from "@/core/components/HeaderBar.vue";
import LoadingSymbol from "@/core/components/LoadingSymbol.vue";

import { searchByResourceType, searchByTag, searchByText } from '../services/resource-service.js'
import BookGroup from '../components/BookGroup.vue'
import PodcastGroup from '../components/PodcastGroup.vue'
import PodcastEpisodeGroup from '../components/PodcastEpisodeGroup.vue'
import { getResourceTypes, getTags } from '../services/lookup-service';
// import RowHeader from '../components/RowHeader.vue'
// import SearchInput from '@/core/components/SearchInput.vue'

export default {
  
  name: 'ResourcesSearch',

  components: {
    ResourceDetail,
    HeaderBar,
    LoadingSymbol,
    BookGroup,
    PodcastGroup,
    PodcastEpisodeGroup,
  },

  data() {
    return {
      searchCategory: null,
      searchTerm: null,
      searchResults: [],
      showResourceDetail: false,
      showResourceAdd: false,
      selectedResource: null,
      isLoading: true,
      resourceTypes: [],
      tags: [],
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
    console.log('mounted')
    this.isLoading = true;

    this.resourceTypes = await getResourceTypes();
    this.tags = await getTags();
    
    if (this.$route.params.typeId) {
      await this.handleSearchByTypeKey(this.$route.params.typeId)
      const resourceId = this.$route.query.r 
      if (resourceId) {
        const resource = this.searchResults.find ( r => r.id == resourceId );
        this.showDetail(resource);
      }
    } else if (this.$route.params.tagId) {
      await this.handleSearchByTagKey(this.$route.params.tagId)
    } else if (this.$route.params.searchTerm) {
      await this.handleSearchByText(this.$route.params.searchTerm);
    }
    this.isLoading = false;
  },

  methods: {
    async handleSearchByTagKey(key) {
      let lookup = this.tags.find (i => i.key == key);
      if (lookup) {
        this.searchResults = await searchByTag(lookup);
      }
    },

    async handleSearchByTypeKey(key) {
      this.searchResults = await searchByResourceType(key);
    },

    async handleSearchByText(term) {
      this.searchResults = await searchByText(term);
    },

    handleMenuAdd() {
      this.showResourceDetail = false;
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
    },

    handleLogin() {
      this.$router.push('/login')
    },

    resourcesByType(key) {
      const results = this.searchResults.filter ( resource => resource.resourceType.key == key )
      if (results) {
        console.log(results.length);
        return results;

      }
      return [];
    },

    closeDetail() {
      this.showResourceDetail = false;
      this.showResourceAdd = false;
    },

    layoutClassForType(type) {
      if (type.key == 'episodes') {
        return 'vertical-list'
      }
      return 'horizontal-list'
    }
  },

  computed: {
    books() {
      const results = this.resourcesByType('books')
      return results.length>0 ? results : null
    },
    podcasts() {
      const results = this.resourcesByType('podcasts')
      return results.length>0 ? results : null
    },
    web() {
      const results = this.resourcesByType('web')
      return results.length>0 ? results : null
    },
    video() {
      const results = this.resourcesByType('video')
      return results.count>0 ? results : null
    },
    episodes() {
      const results = this.resourcesByType('episodes')
      return results.count>0 ? results : null
    },
    
  //   uniqueResourceTypes() {
  // //     const arrayUniqueByKey = [...new Map(array.map(item =>
  // // [item[key], item])).values()];
  //     const types = this.searchResults.map(t => t.resourceType);
  //     const unique = [...new Map(types.map(item => [item['key'], item])).values()];
  //     return unique
  //   }
  }
}

</script>

<style scoped>

.resources {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 800px;
}

.content.loading {
  display: none;
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

h1 {
  font-family: "Google Sans",Roboto,Arial,sans-serif;
    font-size: 1.125rem;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    max-height: 48px;
    color: #202124;
    margin-top: 40px;
    margin-bottom: 12px;
}

.noresults {
  margin-top:100px;
}
</style>