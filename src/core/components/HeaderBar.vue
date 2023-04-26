<template>
  <div class="header">
    
    <div class="left-nav">
      <ul>
        <li v-for="nav in navLinks" :key="nav.path">
          <router-link 
            :class="{ selected: isSelected(nav)}" 
            :to="nav.path"
          >
          {{nav.title}}
          </router-link>
        </li>
        <li class="nav-with-submenu">
          <a>CATEGORIES</a>    
          <div ref="submenuDiv" class="submenu">
            <ul>
              <li v-for="tag in tags.items" :key="tag.key" >
                <tag-button :enableHoverEffect="true" @click="$router.push(`/tag/${tag.key}`)">{{tag.value}}</tag-button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    
    <div class="spacer"></div>

    <div class="header__right">
      <base-button @click="showRecommendDialog = true">Recommend</base-button>
      <search-input 
        v-model="searchTerm" 
        @search="$router.push(`/search/${searchTerm}`)" 
        @mouseover="showCategories=false">
      </search-input>
      
      <recommend-resource v-if="showRecommendDialog" @close="showRecommendDialog = false"></recommend-resource>

      <base-icon :menu="menuOptions">menu</base-icon>
    </div>
  
  </div>
</template>

<script>
import BaseIcon from '@/core/components/BaseIcon.vue'
import { auth } from '@/core/services/firebaseInit'
import { useUserStore } from '@/core/state/userStore'
import SearchInput from './SearchInput.vue'
import TagButton from '@/modules/resources/components/TagButton.vue'

import { refreshTags, refreshResourceTypes } from '@/modules/resources/services/lookup-service'
import { getTags } from '@/modules/resources/services/lookup-service'
import BaseButton from './BaseButton.vue'
import RecommendResource from '@/modules/recommendations/views/RecommendResource.vue'

export default {
  name: 'HeaderBar',
  components: {
    SearchInput,
    TagButton,
    BaseIcon,
    BaseButton,
    RecommendResource
  },

  // emits: ['menuAdd'],

  props: {
    clearSearch: Boolean,
  },

  data() {
    return {
      searchTerm: "",
      navLinks: [],
      tags: [],
      types: [],
      showRecommendDialog: false,
    }
  },
  
  async mounted() {
    this.searchTerm = this.$route.params.searchTerm;
    console.log('ss')
    this.navLinks = [
      {id: 'home', path:'/', title:'HOME'},
      {id: 'books', path:'/type/books', title:'BOOKS'},
      {id: 'podcasts', path:'/type/podcasts', title:'PODCASTS'},
      {id: 'web', path:'/type/web', title:'WEB'},
      {id: 'video', path:'/type/video', title:'VIDEO'}
    ]
    this.tags = await getTags();
  },
  
  methods: {
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
              // vm.$emit('menuAdd');
              vm.$router.push('add');
            }
          },
          {
            isDivider: true,
            show: this.useUserStore.isLoggedIn,
          },
          {
            name: "Refresh Lookups",
            show: this.useUserStore.isLoggedIn,
            action: () => {
              refreshTags().then ( tags => this.tags = tags );
              refreshResourceTypes();
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
              this.$router.push('/login');
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

.left-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.left-nav .nav-with-submenu a {
  padding-top: 20px;
  padding-bottom: 40px;
  font-weight: var(--prr-font-weight);
}
.nav-with-submenu:hover .submenu {
  visibility: visible;
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
  padding: 5px 5px;
}

ul {
  list-style-type: none;
}
li {
  padding: 0px;
  display: inline-block;
}

.left-nav a {
  text-decoration: none;
  padding: 0px 10px 0px 10px;
  cursor: pointer;
  color: var(--prr-darkgrey);
  font-weight: 800;
  transition: border-bottom 300ms;
}

.left-nav a:hover, a.selected {
  transition: border-bottom 300ms;
  color: var(--prr-green);
}

.left-nav a.selected {
  font-weight: 800;
}

/* .nav a {
  text-decoration: none;
  margin-right: 20px;
} */

.header__right {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right:20px;
}

</style>