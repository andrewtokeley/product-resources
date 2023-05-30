<template>
  <div class="mobile-nav">
      <span 
        ref="cancel"
        class="cancel-icon material-symbols-outlined"
        v-if="showCancel"
        @click="handleCancel"
        >cancel
      </span>
    
    <template v-for="nav in navLinks" :key="nav.path">
      <tag-button 
        v-if="showNavItem(nav)"
        :isSmall="true"
        :selected="isSelected(nav)"
        @click="handleTypeSelection(nav)">
        {{nav.title}}
      </tag-button>
    </template>
    <span 
      v-if="!showCancel"
      class="material-symbols-outlined"
      @click="showSideBar = true"
      >filter_list</span>
      <tag-button v-if="showCancel" 
        :selected="selectedTag != null"
        :isSmall="true"
        @click="showSideBar = true" >
        <span class="filter-text">{{ filterText }}</span>
        <span 
          class="filter-icon material-symbols-outlined"
          >filter_list</span>
      </tag-button>
      

    <side-bar 
      v-if="showSideBar"
      @click="handleTagClick"
      @close="showSideBar = false">
    </side-bar>
  </div>
</template>

<script>
import TagButton from '@/modules/resources/components/TagButton.vue';
import ResourceTypeEnum from '@/modules/resources/model/resourceTypeEnum';
import SideBar from '@/modules/navigation/components/SideBar.vue';
import { useLookupStore } from '../state/lookupStore';

export default {
  name: 'mobile-nav',
  components: { TagButton , SideBar},
  data() {
    return {
      navLinks: [],
      showSideBar: false,
      selectedNav: null,
      selectedTag: null,
    }
  },
  computed: {
    isHomePage() {
      return this.$route.path == '/';
    },
    showCancel() {
      if (this.isHomePage) { return false; }
      return this.selectedNav != null;
    },
    filterText() {
      const store = useLookupStore();
      let tagName = "ALL CATEGORIES";
      if (this.selectedTag) {
        tagName = store.tags.find( t => t.key == this.selectedTag ).value.toUpperCase();
      }
      return tagName;
    },
  },
  mounted() {
    this.navLinks = [
      {id: 'books', path:`/type/${ResourceTypeEnum.Books.key}`, title:'BOOKS'},
      {id: 'podcasts', path:`/type/${ResourceTypeEnum.Podcasts.key}`, title:'PODCASTS'},
      {id: 'people', path:`/type/${ResourceTypeEnum.People.key}`, title:'PEOPLE'},
      {id: 'websites', path:`/type/${ResourceTypeEnum.Websites.key}`, title:'WEB'},
    ];
    this.selectedNav = this.$route.params.typeId;
  },
  methods: {
    // doSomething() {
      //   const t1 = this.$refs.t1;
      //   const t2 = this.$refs.t2;
      //   const t3 = this.$refs.t3;
      //   const cancel = this.$refs.cancel;
      //   const rightOfCancel = cancel.getBoundingClientRect().right;
      //   // t2 move to the left, just in front of cancel
      //   const t2xDelta = 
      
      // },
      showNavItem(nav) {
        if (this.isHomePage) { return true; }
        return !this.showCancel || this.selectedNav.id == nav.id;
      },
      isSelected(nav) {
        if (this.isHomePage) { return false; }
        return this.selectedNav?.id == nav?.id
      },
      handleTypeSelection(nav) {
        this.selectedNav = nav;
        this.selectedTag = null;
        this.$router.push(nav.path)
      },
      handleTagClick(tagkey) {
        this.selectedTag = tagkey;
        if (this.selectedNav) {
          // resource type, tag search
          this.$router.push(`${this.selectedNav.path}/${tagkey}`)
        } else {
          // global tag search
          this.$router.push(`/tag/${tagkey}`)
        }
        this.showSideBar = false;
      },
      handleCancel() {
        if (this.selectedTag) {
          this.selectedTag = null;
          this.$router.push(this.selectedNav?.path ?? '/');
        } else {
          this.selectedNav = null;
          this.$router.push('/');
        }
    },
  }
}

</script>

<style scoped>
.mobile-nav {
  height: 40px;
  margin-left: 10px;
  width: 100%;
  display:flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 3px;
}
 
a.selected {
  color: var(--prr-green);
}

button {
  overflow: hidden;
  transition: 2000ms;
}

button.invisible {
  width: 1px;
  opacity: 0px;
  height: 0px;
  display: none;
}
.filter-icon {
  margin-left: 5px;
}

.cancel-icon {
  margin: 0px 5px;
  font-size: 30px;
  font-weight:lighter;
}
</style>