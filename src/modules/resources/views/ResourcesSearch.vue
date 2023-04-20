<template>
  <div class='resources'>
    <div class='content'>
      <base-input v-model="searchTerm" class='searchInput'></base-input>
      <base-button @click="handleSearch">Search</base-button>
    
      <div class="search-results">
        <template v-for="category in uniqueCategories" :key="category">
          <h1>{{ category }}s</h1>
          <div :class="layoutClassForCategory(category)">
            <div class="resource-item" @click="showDetail(resource.id)" v-for="resource in resourcesByCategory(category)" :key="resource.id">
              
              <book-card v-if="resource.category == 'Book'"
                :resource="resource"
              >
              </book-card>
              <podcast-card v-if="resource.category == 'Podcast'"
                :resource="resource"
              >
            </podcast-card>
              <podcast-episode-card v-if="resource.category == 'Podcast Episode'"
              :resource="resource"
              >
              </podcast-episode-card>
              
            </div>
          </div>
        </template>
      </div>
    </div>

    <resource-detail v-if="showResourceDetail" @close="closeDetail" :resourceId="selectedResourceId"></resource-detail>

  </div>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
import BaseButton from '@/core/components/BaseButton.vue'
import ResourceDetail from './ResourceDetail.vue'
import PodcastCard from '../components/PodcastCard.vue'
import BookCard from '../components/BookCard.vue'
import PodcastEpisodeCard from '../components/PodcastEpisodeCard.vue'

import { searchResources } from '../services/resource-service.js'

export default {
  name: 'ResourcesSearch',
  components: {
    BaseInput,
    BaseButton,
    ResourceDetail,
    BookCard,
    PodcastCard,
    PodcastEpisodeCard
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
    this.searchTerm = this.$route.params.searchTerm ?? ""
    if (this.searchCategory || this.category) {
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
      if (this.searchCategory) {
        this.$router.replace( { path: `/${this.searchCategory}/${this.searchTerm}` })
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
      if (category == 'Podcast Episode') {
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
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 800px;
}

.search-results {
  width: 100%;
  overflow-x:hidden;
  margin-bottom: 100px;
}

.searchInput {
  width: 50%;
  max-width: 400px;
}

.horizontal-list {
  display: flex;
  flex-direction: row;
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
</style>