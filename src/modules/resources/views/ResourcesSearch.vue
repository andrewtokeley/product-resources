<template>
  <div class='resources'>
    <header-bar></header-bar>
    <div class='content'>
      <!-- <search-input @search="handleSearch()" v-model="searchTerm"></search-input> -->
      
      <div v-if="searchResults.length > 0" class="search-results">
        <template v-for="category in uniqueCategories" :key="category">
          <!-- <row-header :title="category" :moreLink="`/${category}`"></row-header> -->
          <h1 v-if="searchTerm">
            <router-link :to="`/${category.toLowerCase()}`">{{ category }}</router-link>
          </h1>
          <div :class="layoutClassForCategory(category)">
            <div class="resource-item" @click="showDetail(resource.id)" v-for="resource in resourcesByCategory(category)" :key="resource.id">
              
              <book-card v-if="resource.category == 'Books'"
                :resource="resource"
              >
              </book-card>
              <podcast-card v-if="resource.category == 'Podcasts'"
                :resource="resource"
              >
              </podcast-card>
              <podcast-episode-card v-if="resource.category == 'Podcast Episodes'"
              :resource="resource"
              >
              </podcast-episode-card>
              
            </div>
          </div>
        </template>
      </div>
      <div v-else class="noresults">
        We couldn't find anything matching, <i>{{ searchTerm }}</i>
      </div>
    </div>

    <resource-detail v-if="showResourceDetail" @close="closeDetail" :resourceId="selectedResourceId"></resource-detail>

  </div>
</template>

<script>
import ResourceDetail from './ResourceDetail.vue'
import PodcastCard from '../components/PodcastCard.vue'
import BookCard from '../components/BookCard.vue'
import PodcastEpisodeCard from '../components/PodcastEpisodeCard.vue'
import HeaderBar from "@/core/components/HeaderBar.vue";

import { searchResources } from '../services/resource-service.js'
// import RowHeader from '../components/RowHeader.vue'
// import SearchInput from '@/core/components/SearchInput.vue'

export default {
  
  name: 'ResourcesSearch',
  components: {
    ResourceDetail,
    BookCard,
    PodcastCard,
    PodcastEpisodeCard,
    HeaderBar,
  },

  data() {
    return {
      searchCategory: null,
      searchTerm: null,
      searchResults: [],
      showResourceDetail: false,
      selectedResourceId: ""
    }
  },

  mounted() {
    this.searchCategory = this.$route.params.category
    if (this.searchCategory == 'search') {
      this.searchCategory = null
    }
    this.searchTerm = this.$route.params.searchTerm ?? ""
    if (this.searchCategory || this.searchTerm) {
      this.handleSearch()
    }
  },

  methods: {
    showDetail(resourceId) {
      this.selectedResourceId = resourceId
      this.showResourceDetail = true
    },

    handleLogin() {
      this.$router.push('/login')
    },

    handleSearch() {
      if (this.searchCategory == 'search' && this.searchTerm == '') {
        this.$router.push('/');
      }
      searchResources(this.searchCategory, this.searchTerm).then ( (results) => {
        this.searchResults = results
      })
    },

    resourcesByCategory(category) {
      return this.searchResults.filter ( resource => resource.category === category )
    },

    closeDetail() {
      //alert('close')
      this.showResourceDetail=false
    },
    layoutClassForCategory(category) {
      if (category == 'Podcast Episodes') {
        return 'vertical-list'
      }
      return 'horizontal-list'
    }
  },

  computed: {
    uniqueCategories() {
      return [...new Set(this.searchResults.map(obj => obj.category))];
    }
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