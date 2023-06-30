<template>
  <div class="header-right-nav">

    <base-button-link class="recommend-button desktop" to="/recommend">Recommend...</base-button-link>
    
    <base-icon v-if="!userStore.isLoggedIn" @click="$emit('searchClicked')">search</base-icon>

    <router-link 
      class="nav-link desktop" 
      :class="{ selected: isSelected('/about')}"
      to="/about">
      About
    </router-link>

    <base-icon v-if="userStore.isLoggedIn" @click="$emit('searchClicked')">search</base-icon>

    <base-icon class="mobile" @click="$router.push('/recommend')">add_circle</base-icon>

    <div v-if="userStore.isLoggedIn" class="icon">
      <base-icon :menu="menuOptions">account_circle</base-icon>
      <badge-count v-if="todoCount > 0 && userStore.isAdmin" class="badge" :count="todoCount"></badge-count>
    </div>
    
    <div v-else>
      <div class="icon mobile">
        <base-icon :menu="menuOptions">account_circle</base-icon>
      </div>
      <router-link 
        class="nav-link desktop" 
        :class="{ selected: isSelected('/login')}"
        to="/login">
        Sign In
      </router-link>
    </div>
  </div>  
</template>

<script>
import BaseIcon from '@/core/components/BaseIcon.vue'
import BadgeCount from '@/core/components/BadgeCount.vue'
import BaseButtonLink from './BaseButtonLink.vue'

import { getUnapprovedReviewsCount } from '@/modules/reviews/services/review-service'
import { getUnlinkedRecommendationsCount } from '@/modules/recommendations/services/recommendation-service'
import { useUserStore } from '../state/userStore'

export default {
  name: 'header-right-nav',
  components: {
    BaseIcon, 
    BadgeCount,
    BaseButtonLink,
  },
  emits: ['searchClicked'],
  data() {
    return {
      numberOfUnapprovedReviews: 0,
      numberOfRecommendations: 0,
    }
  },
  async mounted() {
    if (this.userStore.isAdmin) {
      this.numberOfUnapprovedReviews = await getUnapprovedReviewsCount();
      this.numberOfRecommendations = await getUnlinkedRecommendationsCount();
    }
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    todoCount() {
      return this.numberOfRecommendations + this.numberOfUnapprovedReviews;
    },
    menuOptions() {
      return {
        menuItems: [
          {
            isHeading: true,
            heading: this.userStore.displayName,
            subHeading: this.userStore.email,
            show: this.userStore.isLoggedIn,
          },
          {
            name: "Profile",
            iconName: "account_circle",
            show: this.userStore.isLoggedIn,
            link: '/profile',
          },
          {
            name: "Your Reviews",
            show: this.userStore.isLoggedIn,
            link: `/${this.userStore.username}`,
          },
          {
            isDivider: true,
            show: this.userStore.isLoggedIn,
          },
          {
            name: "ADMIN",
            show: this.userStore.isAdmin,
            isLabel: true,
          },
          {
            name: "New Resource...",
            show: this.userStore.isAdmin,
            link: '/admin/resources?tab=draft&new=true',
          },
          {
            name: this.numberOfRecommendations > 0 ? `Resources (${this.numberOfRecommendations})` : "Resources",
            show: this.userStore.isAdmin,
            badgeCount: this.numberOfRecommendations,
            link: this.numberOfRecommendations > 0 ? '/admin/resources?tab=recommendations' : '/admin/resources?tab=approved',
          },
          {
            name: this.numberOfUnapprovedReviews > 0 ? `Reviews (${this.numberOfUnapprovedReviews})` : "Reviews",
            show: this.userStore.isAdmin,
            badgeCount: this.numberOfUnapprovedReviews,
            link: '/admin/reviews',
          },
          {
            name: "Tags",
            show: this.userStore.isAdmin,
            link: '/admin/lookups?tab=tags',
          },
          {
            name: "Resource Types",
            show: this.userStore.isAdmin,
            link: '/admin/lookups?tab=resource-types',
          },
          {
            isDivider: true,
            show: this.userStore.isAdmin,
          },
          {
            name: "Sign Out",
            show: this.userStore.isLoggedIn,
            iconName: "logout",
            link: '/logout',
          },
          {
            name: "Sign In",
            show: !this.userStore.isLoggedIn,
            iconName: "login",
            link: '/login',
          }
        ]
      }
    }
  },

  methods: {
    showMobileSearch() {
      // show the search
    },
    isSelected(path) {
      return path === this.$route.path;
    },
  }
}
</script>

<style scoped>

.header-right-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:10px;
}

.recommend-button {
  margin-right: 70px;
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

.nav-link:hover, .nav-link.selected {
  transition: border-bottom 300ms;
  color: var(--prr-green);
}

.nav-link.selected {
  font-weight: 800;
}

.header-right-nav .nav-link {
  font-weight: var(--prr-font-weight);
}

.nav-link:hover, .nav-link.selected {
  transition: border-bottom 300ms;
  color: var(--prr-green);
}

.nav-link.selected {
  font-weight: 800;
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

@media only screen and (max-width: 600px) {
  .desktop {
    display: none;
  }

  .mobile {
    display:block;
  }
}

</style>