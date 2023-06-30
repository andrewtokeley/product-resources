<template>
  <div class="header-top-nav" :class="{centre: showSearch}">
      <router-link 
        v-if="!showSearch"
        class="header-link" 
        to="/">
        <img class="header-image" src="@/assets/logo-long.svg"/>
      </router-link>
      <header-right-nav
        v-if="!showSearch"
        @search-clicked="showSeachClick"
      ></header-right-nav>
      <search-input 
        class="search-input"
        @blur="showSearch = false"
        v-model="searchTerm" 
        @search="$router.push(`/search/${searchTerm}`)" 
        v-if="showSearch"
        >
      </search-input>
    </div>
</template>

<script>
import HeaderRightNav from './HeaderRightNav.vue'
import SearchInput from './SearchInput.vue';

export default {
  name: 'header-top-nav',
  components: { HeaderRightNav, SearchInput },
  data() {
    return {
      showSearch: false,
      searchTerm: null,
    }
  },
  methods: {
    showSeachClick() {
      this.searchTerm = null;
      this.showSearch = true;
    }
  }
}
</script>

<style scoped>
.header-top-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-right: 20px;
  margin-left: 20px;
  margin-top:20px;
  height: 40px;
}

.header-top-nav.centre {
  justify-content: center;
}

.header-image {
  /* width: 400px; */
  height: 40px;
  margin: auto;
  vertical-align: middle;
  display: inline-block;
}

.search-input {
  max-width: 700px;
  width: 100%;
}

@media only screen and (max-width: 600px) {
  .header-image {
    height: 30px;
  }
}
</style>