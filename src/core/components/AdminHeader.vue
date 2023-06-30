<template>
  <div class="header">
    <header-top-nav></header-top-nav>
    <div class="nav">
      <div class="header-top">
        
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
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/core/state/userStore'
import HeaderTopNav from '@/core/components/HeaderTopNav.vue'

export default {
  name: 'admin-header',
  components: { HeaderTopNav },
  data() {
    return {
      navLinks: [],
    }
  },
  
  async mounted() {
    this.navLinks = [
      // {id: 'home', path:'/', title:'HOME'},
      {id: 'resources', path:`/admin/resources?tab=recommendations`, title:'RESOURCES'},
      {id: 'reviews', path:`/admin/reviews`, title:'REVIEWS'},
      {id: 'tags', path:`/admin/lookups?tab=tags`, title:'TAGS'},
      {id: 'types', path:`/admin/lookups?tab=resource-types`, title:'RESOURCE TYPES'},
    ];
  },
  
  methods: {
    isSelected(nav) {
      return nav.path === this.$route.fullPath;
    },
  },

  computed: {
    useUserStore() {
      return useUserStore()
    },

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
  margin-right: 35px;
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

.left-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
}

ul {
  list-style-type: none;
  padding-left: 0px;
}
li {
  padding: 0px;
  display: inline-block;
}

a {
  text-decoration: none;
  padding: 0px 10px 0px 10px;
  cursor: pointer;
  color: var(--prr-darkgrey);
  font-weight: 800;
  transition: border-bottom 300ms;
  text-transform: uppercase;
}

a:hover, a.selected {
  transition: border-bottom 300ms;
  color: var(--prr-green);
}

a.selected {
  font-weight: 800;
}

</style>