<template>
  <div class='resources'>
    <header-bar></header-bar>
    <div class='content'>
      <base-input v-model="searchTerm" class='searchInput'></base-input>
      <base-button @click="handleSearch">Search</base-button>
    
      <div class="search-results">
        <template v-for="category in uniqueCategories" :key="category">
          <h1>{{ category }}s</h1>
          <div class="resource-list">
            <div class="resource-item" @click="showDetail(resource.id)" v-for="resource in resourcesByCategory(category)" :key="resource.id">
              
              <book-card v-if="resource.category == 'Book'"
                :imageUrl="resource.imageUrl"
                :title="resource.displayName"
                :authors="resource.authors"
              >
              </book-card>
              <podcast-card v-if="resource.category == 'Podcast'"
                :imageUrl="resource.imageUrl"
                :displayName="resource.displayName"
                :description="resource.description"
                :authors="resource.authors"
              >
              </podcast-card>
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
import HeaderBar from '@/core/components/HeaderBar.vue'
import ResourceDetail from './ResourceDetail.vue'
import PodcastCard from '../components/PodcastCard.vue'
import BookCard from '../components/BookCard.vue'

import { searchResources } from '../services/resource-service.js'

export default {
  name: 'ResourcesView',
  components: {
    BaseInput,
    BaseButton,
    HeaderBar,
    ResourceDetail,
    BookCard,
    PodcastCard
  },

  data() {
    return {
      searchTerm: "",
      searchResults: [],
      showResourceDetail: false,
      selectedResourceId: ""
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
      searchResources(this.searchTerm).then ( (results) => {
        this.searchResults = results
      })
    },
    resourcesByCategory(category) {
      return this.searchResults.filter ( resource => resource.category === category )
    },
    closeDetail() {
      //alert('close')
      this.showResourceDetail=false
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

.resource-list {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
}

.resource-item {
  padding: 5px;
  cursor: pointer;
}

</style>