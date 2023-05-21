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
            <div v-for="tagGroup in tagGroups" :key="tagGroup.groupName" class="submenu-group">
              <h2 v-if="showCategoryHeading(tagGroup)">{{ tagGroup.groupName.toUpperCase() }}</h2>
              <ul>
                <li v-for="tag in tagGroup.tags" :key="tag.key" >
                  <tag-button :enableHoverEffect="true" @click="$router.push(`/tag/${tag.key}`)">{{tag.value}}</tag-button>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
    
    <div class="spacer"></div>

    <div class="header__right">
      <base-button @click="$router.push('/recommend')" >Recommend...</base-button>
      <search-input 
        v-model="searchTerm" 
        @search="$router.push(`/search/${searchTerm}`)" 
        @mouseover="showCategories=false">
      </search-input>
      <div class="menu">
        <base-icon :menu="menuOptions">menu</base-icon>
        <badge-count v-if="todoCount > 0" class="badge" :count="todoCount"></badge-count>
      </div>
    </div>

    <resource-detail 
      :resource="resourceFromQueryString"
      v-if="showResourceDialog" 
      @close="showResourceDialog = false" 
      ></resource-detail>
  </div>
</template>

<script>
import BaseIcon from '@/core/components/BaseIcon.vue'
import SearchInput from './SearchInput.vue'
import TagButton from '@/modules/resources/components/TagButton.vue'
import BaseButton from './BaseButton.vue'
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue'
import BadgeCount from './BadgeCount.vue'

import { auth } from '@/core/services/firebaseInit'
import { useUserStore } from '@/core/state/userStore'
import { groupTags } from '@/modules/resources/services/lookup-service'
import { Resource } from '@/modules/resources/model/resource'
import { getResource } from '@/modules/resources/services/resource-service'

import { ref } from 'vue';
import { useLookupStore } from '@/core/state/lookupStore';
import { getUnapprovedReviewsCount } from '@/modules/reviews/services/review-service'
import { getUnlinkedRecommendationsCount } from '@/modules/recommendations/services/recommendation-service'
export default {
  name: 'HeaderBar',
  components: {
    SearchInput,
    TagButton,
    BaseIcon,
    BaseButton,
    ResourceDetail,
    BadgeCount,
  },
  setup() {
    const lookupStore = ref(null);
    lookupStore.value = useLookupStore();
    return {
      lookupStore
    }
  },
  props: {
    clearSearch: Boolean,
  },

  emits: ['menuAdd'],

  data() {
    return {
      searchTerm: "",
      navLinks: [],
      showRecommendDialog: false,
      showResourceDialog: false,
      tagGroups: [],
      resourceFromQueryString: Resource,
      numberOfUnapprovedReviews: 0,
      numberOfRecommendations: 0,
    }
  },
  
  async mounted() {
    this.searchTerm = this.$route.params.searchTerm;
    this.navLinks = [
      {id: 'home', path:'/', title:'HOME'},
      {id: 'books', path:'/type/books', title:'BOOKS'},
      {id: 'podcasts', path:'/type/podcasts', title:'PODCASTS'},
      {id: 'websites', path:'/type/websites', title:'WEB'},
      {id: 'people', path:'/type/people', title:'PEOPLE'},
    ];

    this.tagGroups = await groupTags(this.lookupStore.tags);
    this.numberOfUnapprovedReviews = await getUnapprovedReviewsCount();
    this.numberOfRecommendations = await getUnlinkedRecommendationsCount();

    const resourceId = this.$route.query.r   
    if (resourceId) {
      if (resourceId.toLowerCase() == 'new') {
        this.showRecommendDialog = true;
      } else {
        const resource = await getResource(resourceId);
        if (resource) {
          this.resourceFromQueryString = resource;
          this.showResourceDialog = true;
        }
      }
    }   
  },
  
  methods: {

    handleLogout() {
      console.log('logout');
      auth.signOut();
      //this.$router.push('/');
    },

    isSelected(nav) {
      return nav.path === this.$route.path;
    },

    showCategoryHeading(tagGroup) {
      return tagGroup.groupName.toUpperCase() != '_GENERAL';
    }
  },

  computed: {
    todoCount() {
      return this.numberOfRecommendations + this.numberOfUnapprovedReviews;
    },

    useUserStore() {
      return useUserStore()
    },

    menuOptions() {
      const vm = this;
      return {
        menuItems: [
          {
            isHeading: true,
            heading: this.useUserStore.displayName,
            subHeading: this.useUserStore.email,
            show: this.useUserStore.isLoggedIn,
          },
          {
            name: "Profile",
            show: this.useUserStore.isLoggedIn,
            action: () => {
              vm.$router.push('/profile');
            }
          },
          {
            isDivider: true,
            show: this.useUserStore.isLoggedIn,
          },
        {
            name: "ADMIN",
            show: this.useUserStore.isAdmin,
            isLabel: true,
          },
          {
            name: this.numberOfRecommendations > 0 ? `Resources (${this.numberOfRecommendations})...` : "Resources...",
            show: this.useUserStore.isAdmin,
            badgeCount: this.numberOfRecommendations,
            iconName: "menu_book",
            action: () => {
              this.$router.push('/admin/resources');
              //vm.showResourceDialog = true;
              // vm.$emit('menuAdd');
            }
          },
          {
            name: this.numberOfUnapprovedReviews > 0 ? `Reviews (${this.numberOfUnapprovedReviews})...` : "Reviews...",
            show: this.useUserStore.isAdmin,
            iconName: "rate_review",
            badgeCount: this.numberOfUnapprovedReviews,
            action: () => {
              vm.$router.push('/admin/reviews');
            }
          },
          {
            name: "Lookups...",
            show: this.useUserStore.isAdmin,
            action: () => {
              vm.$router.push('/admin/tags');
            }
          },
          {
            isDivider: true,
            show: this.useUserStore.isAdmin,
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
          {
            isDivider: true,
          },
          {
            name: "About...",
            action: () => {
              this.$router.push('/about');
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
  font-size: var(--prr-font-size-medium);
  display:flex;
  flex-direction: row;
  /* width: 100%; */
  height: 70px;
  min-width: 1100px;
  max-width: 2000px;
  z-index: 10;
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
  padding: 20px 60px 40px 0;
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
  padding: 20px 50px 20px 50px;
  border-top: 1px solid var(--prr-green);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
  background: white;
  z-index: 1000;
}

.submenu-group {
  max-width: 900px;
  margin: 0 auto;
}

.submenu h2 {
  font-size: var(--prr-font-size-normal);
  font-weight: 800;
  /* font-weight: var(--prr-font-weight); */
  margin-bottom: 5px;
  color: var(--prr-darkgrey);
  
}

.submenu ul {
  padding-left: 0px;
}

.submenu li {
  padding: 5px 5px 5px 0px;
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

.badge {
  position: absolute;
  right: 15px;
  top: 15px;
}
</style>