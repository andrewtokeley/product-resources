<template>
  <div class="sidebar" ref="sideBarRef" >
    <base-icon @click="toggleMenu">menu</base-icon>
    <div class="sidebar-menu" :class="{ open: isMenuOpen, closed: !isMenuOpen}">
      <base-icon class="close" @click="toggleMenu">close</base-icon>
      <div class="sidebar-content">
        <ul>
          <li v-for="nav in navLinks" :key="nav.path">
          <router-link 
            @click.prevent="toggleMenu"
            :class="{ selected: isSelected(nav)}" 
            :to="nav.path"
          >
          {{nav.title}}
          </router-link>
        </li>
        </ul>
        <tag-selector @tagClicked="handleTagClick" :singleSelect="true"></tag-selector>
      </div>
    </div>
  </div>
</template>

<script>
import BaseIcon from '@/core/components/BaseIcon.vue'
import TagSelector from '@/modules/resources/components/TagSelector.vue'

export default {
  name: 'side-bar',
  components: { BaseIcon, TagSelector },
  data() {
    return {
      isMenuOpen: false,
      navLinks: [],
    }
  },
  mounted() {
    
    this.navLinks = [
      {id: 'home', path:'/', title:'HOME'},
      {id: 'books', path:'/type/books', title:'BOOKS'},
      {id: 'podcasts', path:'/type/podcasts', title:'PODCASTS'},
      {id: 'websites', path:'/type/websites', title:'WEB'},
      {id: 'people', path:'/type/people', title:'PEOPLE'},
    ];
  },
  methods: {
    handleTagClick(tagKey) {
      this.toggleMenu();
      this.$router.push(`/tag/${tagKey}`)
    },
    isSelected(nav) {
      return nav.path === this.$route.path;
    },
    toggleMenu() {
      if (!this.isMenuOpen) {
        this.isMenuOpen = true;
        // prevent scrolling behind menu
        document.body.classList.add("modal-open");
      } else {
        document.body.classList.remove("modal-open");
        this.isMenuOpen = false;
      }
    },
  }
}
</script>
<style scoped>

/* .sidebar {
  position: relative;
} */

.sidebar .close {
  margin-top:15px;
  margin-left: 10px;
  float: left;
}
.sidebar-menu {
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  /* padding: 40px 10px; */
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
  background: white;
  transition: 400ms;
}

.sidebar-menu.closed {
  width: 0px;
}

.sidebar-menu.open {
  width: 80%;
}

.sidebar-content {
  margin-top:70px;
  margin-left:20px;
}

ul {
  list-style: none;
  padding-left: 10px;
}
li {
  margin-left: 0px;
}

.sidebar-content a {
  text-decoration: none;
  padding: 0px 10px 0px 10px;
  cursor: pointer;
  color: var(--prr-darkgrey);
  font-weight: 800;
  transition: border-bottom 300ms;
}

.sidebar-content a:hover, a.selected {
  transition: border-bottom 300ms;
  color: var(--prr-green);
}

.sidebar-content a.selected {
  font-weight: 800;
}

</style>