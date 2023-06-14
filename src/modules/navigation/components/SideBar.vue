<template>
  <div class="sidebar" ref="sideBarRef" >
    <div class="sidebar-mask" 
      :class="{ open: isMenuOpen, closed: !isMenuOpen}"
      @click="handleClose">
      <div class="sidebar-inner" @click.stop="doNothing">
        <base-icon class="close" @click="handleClose">close</base-icon>
        <h1>Categories</h1>
        <div class="content">
          <tag-selector class="tag-selector" :class="{'tags-visible': isMenuOpen}" :singleColumn="true" :tags="tags_" @click="handleTagClick" :singleSelect="true"></tag-selector>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import BaseIcon from '@/core/components/BaseIcon.vue'
import TagSelector from '@/modules/resources/components/TagSelector.vue'
import { useLookupStore } from '@/core/state/lookupStore'

export default {
  name: 'side-bar',
  components: { BaseIcon, TagSelector },
  emits: ['close', 'click'],
  props: {
    tags: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      isMenuOpen: false,
      navLinks: [],
      tags_: [],
    }
  },
  mounted() {
    document.body.classList.add("modal-open");
    this.navLinks = [
      {id: 'home', path:'/', title:'HOME'},
      {id: 'books', path:'/type/books', title:'BOOKS'},
      {id: 'podcasts', path:'/type/podcasts', title:'PODCASTS'},
      {id: 'websites', path:'/type/websites', title:'WEB'},
      {id: 'people', path:'/type/people', title:'PEOPLE'},
    ];

    // if the tags property hasn't been set, show all tags
    if (!this.tags) {
      const store = useLookupStore()
      this.tags_ = store.tags;
    } else {
      this.tags_ = this.tags;
    }

    // need the delay for the animations to work
    const vm = this;
    setTimeout(function () {
      vm.isMenuOpen = true;
    }, 1);

  },
  unmounted() {
    document.body.classList.remove("modal-open");
  },
  
  methods: {
    doNothing() {

    },
    handleTagClick(tagKey) {
      this.$emit('click', tagKey);     
    },
    isSelected(nav) {
      return nav.path === this.$route.path;
    },
    handleClose() {
      this.$emit('close');
    },
  }
}
</script>
<style scoped>


.sidebar .close {
  margin-top:15px;
  margin-left: 10px;
  float: left;
}
.sidebar-mask {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
}
sidebar-mask.open {
  width: 100%;
}

.sidebar-mask.closed {
  width: 0px;
}

.sidebar-mask.open .sidebar-inner {
  width: 80%;
}

.sidebar-mask.closed .sidebar-inner {
  width: 0%;
}

.sidebar-inner {
  height: 100%;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  background: white;
  transition: 300ms;
}

.sidebar-inner h1 {
  padding-top: 12px;
  margin-top: 0px;
  /* height:40px; */
}
.content {
  position: absolute;
  top: 80px;
  bottom: 0px;
  left: 0px;
  width: 80%;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 50px;
}
/* .sidebar-inner ul {
  padding-top: 70px;
  list-style: none;
  padding-left: 10px;
}
li {
  margin-left: 0px;
}

.sidebar-inner a {
  text-decoration: none;
  margin: 25px 10px 0px 10px;
  cursor: pointer;
  color: var(--prr-darkgrey);
  font-weight: 800;
  transition: border-bottom 300ms;
}

.sidebar-inner a:hover, a.selected {
  transition: border-bottom 300ms;
  color: var(--prr-green);
}

.sidebar-inner a.selected {
  font-weight: 800;
} */
.sidebar-inner .tag-selector {
  padding-left: 15px;
  opacity: 0;
  transition: opacity 1500ms;
}

.sidebar-inner .tags-visible {
  opacity: 1;
}
</style>