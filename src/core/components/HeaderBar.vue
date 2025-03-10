<template>
  <div class="header">
    <header-top-nav></header-top-nav>
    <div v-if="showNavigation" class="nav">
      <div class="header-top desktop">
        
        <div class="left-nav">
          <ul >
            <li v-for="nav in navLinks" :key="nav.path">
              <router-link 
                class="nav-link"
                :class="{ selected: isSelected(nav)}" 
                :to="nav.path"
              >
              {{nav.title}}
              </router-link>
            </li>
            <li ref="nav_with_submenu" class="nav-with-submenu hover-enabled" @click="addHandlerFix">
              <a class="nav-link" :class="{ selected: isCategoriesSelected }">TOPICS</a>    
              <div ref="submenuDiv" class="submenu">
                <div v-for="tagGroup in tagGroups" :key="tagGroup.groupName" class="submenu-group">
                  <h2 v-if="showCategoryHeading(tagGroup)">{{ tagGroup.groupName.toUpperCase() }}</h2>
                  <ul>
                    <li v-for="tag in tagGroup.tags" :key="tag.key" >
                      <tag-button-link 
                        :tag="tag"
                        :enableHoverEffect="true" 
                        @click="handleTagClick">
                      </tag-button-link>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <div class="spacer"></div>

        <div class="header__right">
          <!-- <base-button-link class="desktop" to="/recommend">Recommend...</base-button-link> -->
          <!-- <search-input 
            class="desktop"
            v-model="searchTerm" 
            @search="$router.push(`/search/${searchTerm}`)" 
            @mouseover="showCategories=false">
          </search-input> -->
        </div>
      </div>
      <div>
        <div class="mobile">
          <div class="mobile-nav2">
            <mobile-nav></mobile-nav>
          </div>
        </div>
      </div>
    </div>

    <resource-detail 
      :resource="resourceFromQueryString"
      v-if="showResourceDialog" 
      @close="showResourceDialog = false" 
      ></resource-detail>

      <side-bar v-if="showSideBar" @close="showSideBar = false"></side-bar>
  </div>
</template>

<script>
import MobileNav from '@/core/components/MobileNav.vue';
// import SearchInput from './SearchInput.vue'
import TagButtonLink from '@/modules/resources/components/TagButtonLink.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue'
import SideBar from '@/modules/navigation/components/SideBar.vue';
// import BaseButtonLink from '@/core/components/BaseButtonLink.vue';

import HeaderTopNav from '@/core/components/HeaderTopNav.vue';

import { auth } from '@/core/services/firebaseInit'
import { groupTags } from '@/modules/resources/services/lookup-service'
import { Resource } from '@/modules/resources/model/resource'
import { getResource } from '@/modules/resources/services/resource-service'

import { ref } from 'vue';
import { useUserStore } from '@/core/state/userStore'
import { useLookupStore } from '@/core/state/lookupStore';
import ResourceTypeEnum from '@/modules/resources/model/resourceTypeEnum'


export default {
  name: 'HeaderBar',
  components: {
    // SearchInput,
    TagButtonLink,
    // BaseButtonLink,
    ResourceDetail,
    SideBar,
    MobileNav,
    HeaderTopNav,
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
      resourceFromQueryString: Resource,
      // numberOfUnapprovedReviews: 0,
      // numberOfRecommendations: 0,
      showSideBar: false,
    }
  },
  
  mounted() {
    this.searchTerm = this.$route.params.searchTerm;
    this.navLinks = [
      // {id: 'home', path:'/', title:'HOME'},
      {id: 'books', path:`/type/${ResourceTypeEnum.Books.key}`, title:'BOOKS'},
      {id: 'podcasts', path:`/type/${ResourceTypeEnum.Podcasts.key}`, title:'PODCASTS'},
      {id: 'websites', path:`/type/${ResourceTypeEnum.Websites.key}`, title:'WEB'},
      {id: 'people', path:`/type/${ResourceTypeEnum.People.key}`, title:'PEOPLE'},
    ];

    // if (this.useUserStore.isAdmin) {
    //   this.numberOfUnapprovedReviews = await getUnapprovedReviewsCount();
    //   this.numberOfRecommendations = await getUnlinkedRecommendationsCount();
    // }

    const vm = this;
    this.$router.isReady().then ( async () => {
      const resourceId = vm.$route.query.r   
      if (resourceId) {
        if (resourceId.toLowerCase() == 'new') {
          vm.showRecommendDialog = true;
        } else {
          const resource = await getResource(resourceId);
          if (resource) {
            vm.resourceFromQueryString = resource;
            vm.showResourceDialog = true;
          }
        }
      }
    });
    
    this.enableHover();

  },
  
  methods: {
    handleButtonClick(item) {
      console.log(item.id)
    },
    removeHover() {
      const topicNav = this.$refs.nav_with_submenu;
      if (topicNav) {
        topicNav.classList.remove("hover-enabled");
        this.enableHover()
      }
    },
    enableHover() {
      const topicNav = this.$refs.nav_with_submenu;
      if (topicNav) {
        topicNav.addEventListener("mouseover", function () {
          if (!topicNav.classList.contains('hover-enabled')) {
            topicNav.classList.add("hover-enabled");
          }
        })
      } 
    },
    handleTagClick() {
      this.removeHover();
      // this.$router.push(`/tag/${tag.key}`);
    },
    handleLogout() {
      auth.signOut().then ( () => {
        this.$router.push("/");
      });
    },
    isSelected(nav) {
      return nav.path === this.$route.path;
    },

    showCategoryHeading(tagGroup) {
      return tagGroup.groupName.toUpperCase() != '_GENERAL';
    }
  },

  computed: {
    showNavigation() {
      return !this.$route.meta.hideNavigation ?? true;
    },
    tagGroups() {
      return groupTags(this.lookupStore.tags);
    },
    isCategoriesSelected() {
      return this.$route.path.includes('/tag/');
    },
    // todoCount() {
    //   return this.numberOfRecommendations + this.numberOfUnapprovedReviews;
    // },

    useUserStore() {
      return useUserStore()
    },

    // menuOptions() {
      
    //   return {
    //     menuItems: [
    //       {
    //         isHeading: true,
    //         heading: this.useUserStore.displayName,
    //         subHeading: this.useUserStore.email,
    //         show: this.useUserStore.isLoggedIn,
    //       },
    //       {
    //         name: "Profile",
    //         iconName: "account_circle",
    //         show: this.useUserStore.isLoggedIn,
    //         link: '/profile',
    //       },
    //       {
    //         name: "Your Reviews",
    //         show: this.useUserStore.isLoggedIn,
    //         link: `/${this.useUserStore.username}`,
    //       },
    //       {
    //         isDivider: true,
    //         show: this.useUserStore.isLoggedIn,
    //       },
    //       {
    //         name: "ADMIN",
    //         show: this.useUserStore.isAdmin,
    //         isLabel: true,
    //       },
    //       {
    //         name: "New Resource...",
    //         show: this.useUserStore.isAdmin,
    //         link: '/admin/resources?tab=draft&new=true',
    //       },
    //       {
    //         name: this.numberOfRecommendations > 0 ? `Resources (${this.numberOfRecommendations})` : "Resources",
    //         show: this.useUserStore.isAdmin,
    //         badgeCount: this.numberOfRecommendations,
    //         link: this.numberOfRecommendations > 0 ? '/admin/resources?tab=recommendations' : '/admin/resources?tab=approved',
    //       },
    //       {
    //         name: this.numberOfUnapprovedReviews > 0 ? `Reviews (${this.numberOfUnapprovedReviews})` : "Reviews",
    //         show: this.useUserStore.isAdmin,
    //         badgeCount: this.numberOfUnapprovedReviews,
    //         link: '/admin/reviews',
    //       },
    //       {
    //         name: "Tags",
    //         show: this.useUserStore.isAdmin,
    //         link: '/admin/lookups?tab=tags',
    //       },
    //       {
    //         name: "Resource Types",
    //         show: this.useUserStore.isAdmin,
    //         link: '/admin/lookups?tab=resource-types',
    //       },
    //       {
    //         isDivider: true,
    //         show: this.useUserStore.isAdmin,
    //       },
    //       {
    //         name: "Sign Out",
    //         show: this.useUserStore.isLoggedIn,
    //         iconName: "logout",
    //         link: '/logout',
    //       }
    //     ]
    //   }
    // }
  }
}
</script>

<style scoped>
.header {
  min-width: 1000px;
  max-width: 2000px;
  z-index: 10;
}

.header-top-strip {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-right: 40px;
  margin-left: 10px;
  margin-top:20px;
}

.header-image {
  /* width: 400px; */
  height: 40px;
  margin: auto;
  vertical-align: middle;
  display: inline-block;
}
.header-top {
  padding: 0px 15px;
  font-size: var(--prr-font-size-medium);
  display:flex;
  flex-direction: row;
  height: 70px;
}

.header-top .spacer {
  flex-grow: 1;
}

.left-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.left-nav .nav-with-submenu .nav-link {
  padding: 20px 60px 40px 10px;
  font-weight: var(--prr-font-weight);
}

.nav-with-submenu.hover-enabled:hover .submenu {
  visibility: visible;
  display: block;
}
.submenu {
  position: absolute;
  /* header height (70) + image (40) + image margin-top (20) */
  top:130px; 
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
  padding-left: 0px;
}
li {
  padding: 0px;
  display: inline-block;
}

.nav-link {
  text-decoration: none;
  padding: 0px 10px 0px 10px;
  cursor: pointer;
  color: var(--prr-darkgrey);
  font-weight: 800;
  transition: border-bottom 300ms;
  text-transform: uppercase;
}

.right-top-nav .nav-link {
  font-weight: var(--prr-font-weight);
}
.nav-link:hover, .nav-link.selected {
  transition: border-bottom 300ms;
  color: var(--prr-green);
}

.nav-link.selected {
  font-weight: 800;
}

.header__right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.right-top-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:10px;
}

.icon {
  position:relative;
}
.badge {
  position: absolute;
  right: 0px;
  top: 0px;
}

.mobile {
  display: none;
}

.mobile-nav2 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap:3px;
  align-items: center;
  margin-bottom: 15px;
}
@media only screen and (max-width: 600px) {
  .desktop {
    display: none;
  }

  .header-top-strip {
    margin-right: 15px;
    margin-left: 10px;
}

  .mobile {
    display:block;
  }

  .header {
    min-width: 100%;
    max-width: 100%;
  }

  /* .header-image {
    display: none;
  } */
}
</style>