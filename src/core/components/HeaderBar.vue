<template>
  <div class="header">
    
    <div class="left-nav">
      <ul>
        <li v-for="nav in navLinks" :key="nav.path" >
          <router-link :class="{ selected: isSelected(nav)}" v-if="nav.path" class="nav" :to="nav.path">{{ nav.title.toUpperCase() }}</router-link>
          <div v-else class="nav-with-submenu">
            <a>{{ nav.title.toUpperCase() }}</a>    
            <div class="submenu">
              <ul>
                <li v-for="category in categories" :key="category.id" >
                  <category-button @click="handleSearch(null, category.id)">{{category.name}}</category-button>
                </li>
              </ul>
          </div>
          </div>
        </li>
      </ul>
    </div>
    
    <div class="spacer"></div>
    <div class="header__right">
      <search-input 
        v-model="searchTerm" 
        @search="handleSearch(null, searchTerm)" 
        @mouseover="showCategories=false">
      </search-input>
      
      <base-icon :menu="menuOptions">menu</base-icon>
    </div>
  
  </div>
</template>

<script>
import BaseIcon from '@/core/components/BaseIcon.vue'
import { auth } from '@/core/services/firebaseInit'
import { useUserStore } from '@/core/state/userStore'
import SearchInput from './SearchInput.vue'
import CategoryButton from '@/modules/resources/components/CategoryButton.vue'

export default {
  name: 'HeaderBar',
  components: {
    SearchInput,
    CategoryButton,
    BaseIcon
  },
  props: {
    clearSearch: Boolean,
  },
  data() {
    return {
      searchTerm: null,
      navLinks: [],
      categories: [],
    }
  },
  
  mounted() {
    this.searchTerm = this.$route.params.searchTerm
    this.categories = [
      {id:'strategy', name:'Strategy'},
      {id:'marty-cagan', name:'Marty Cagan'},
      {id:'leadership', name:'Leadership'},
      {id:'roadmaps', name:'Roadmapping Roadmapping'},
      
    ]
    this.navLinks = [
      {id: 'home', path:'/', order: 0, title:'Home'},
      {id: 'books', path:'/books', order: 1, title:'Books'},
      {id: 'podcasts', path:'/podcasts', order: 2, title:'Podcasts'},      
      {id: 'posts', path:'/posts', order: 3, title:'Posts'},      
      {id: 'categories', order: 4, title:'Categories'},
    ]
  },
  
  methods: {
    searchUrl(category, term) {
      const categoryPath = category == null ? "search" : category;
      const termPath = term == null ? "" : `/${term}`;
      return `/${categoryPath.toLowerCase()}${termPath}`
    },
    handleSearch(category, term) {
      this.$router.push( { path: this.searchUrl(category, term) });
    },
    handleLogin() {
      this.$router.push('/login')
    },
    handleLogout() {
      auth.signOut();
    },
    isSelected(nav) {
      return nav.path === this.$route.path;
    },
  },
  computed: {
    useUserStore() {
      return useUserStore()
    },
    menuOptions() {
      const vm = this;
      return {
        menuItems: [
          {
            name: "New Resource...",
            show: this.useUserStore.isLoggedIn,
            iconName: "menu_book",
            action: () => {
              vm.$router.push('/add')
            }
          },
          {
            isDivider: true,
            show: this.useUserStore.isLoggedIn,
          },
          {
            name: "Logout",
            show: this.useUserStore.isLoggedIn,
            iconName: "logout",
            action: () => {
              vm.handleLogout()              
            }
          },
          {
            name: "LogIn",
            show: !this.useUserStore.isLoggedIn,
            iconName: "login",
            action: () => {
              vm.handleLogin()              
            }
          },
        ]
      }
    }
  }
}
</script>

<style scoped>
.header {
  display:flex;
  flex-direction: row;
  width: 100%;
  height: 70px;
}

.header .spacer {
  flex-grow: 1;
}
.header h1 {
  color: var(--prr-blue);
}

.nav-with-submenu {
  padding-top: 20px;
  padding-bottom: 20px;
  font-weight: var(--prr-font-weight);
}
.nav-with-submenu:hover .submenu {
  /* visibility: visible; */
  display: block;
}
.submenu {
  position: absolute;
  top:70px;
  left:0px;
  right:0px;
  display:none;
  overflow: hidden;
  min-height: 100px;
  padding: 20px 40px;
  border-top: 1px solid var(--prr-green);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
  background: white;
}

.submenu li {
  padding: 0px 10px;
}

ul {
  list-style-type: none;
}
li {
  padding: 0px;
  display: inline-block;
}

a.nav {
  text-decoration: none;
  padding: 0px 10px 0px 10px;
  cursor: pointer;
  color: var(--prr-darkgrey);
  font-weight: 800;
  transition: border-bottom 300ms;
}

a.nav:hover, a.nav.selected {
  transition: border-bottom 300ms;
  color: var(--prr-green);
}

a.nav.selected {
  font-weight: 800;
}

.nav a {
  text-decoration: none;
  margin-right: 20px;
}

.header__right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

</style>