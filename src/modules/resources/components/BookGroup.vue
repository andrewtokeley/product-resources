<template>
  <div class="book-group">
    <template v-for="group in groups" :key="group.key" >
      <row-header 
        :headingIcon="group.icon" 
        :heading="group.heading" 
        :headingLink="group.link">
      </row-header>
      <p>{{ description }}</p>
      <div class="row" ref="myrow" :class="{ singleRow: singleRow }">
        <div v-if="!hideLeftScroll && singleRow" class="scroll-nav scroll-nav-left" >
          <base-icon :options="scrollIconOptions" class="scroll-icon" @click="scrollGroupLeft">keyboard_arrow_left</base-icon>
        </div>
        <div v-if="!hideRightScroll && singleRow" class="scroll-nav scroll-nav-right" >
          <base-icon :options="scrollIconOptions" class="scroll-icon" @click="scrollGroupRight">keyboard_arrow_right</base-icon>
        </div>
        <!-- <base-icon class="scroll-right" @click="scrollGroupRight">arrow_forward_ios</base-icon> -->
        <book-card 
          :class="{ 'column-layout': showDescription }"
          v-for="resource in group.resources"
          :key="resource.id"
          :showDescription="showDescription"
          :showTitle="!showDescription"
          :resource="resource" 
          @click="$emit('click', resource)">
        </book-card>
        <div v-if="showAddRecommendation && group.resources.length > 0" >
          <book-card 
            :resource="group.resources[0]" 
            :showAddPlaceholder="true"
            @addRecommend="handleAddRecommendation(group.key)"></book-card>
        </div>
        <div v-if="group.link && showMore" class="more">
          <router-link :to="group.link">see all</router-link>
        </div>
      </div>
      <hr v-if="isGrouped" class="divider"/>
    </template>
  </div>
</template>

<script>
import BookCard from "@/modules/resources/components/BookCard.vue"
import RowHeader from '@/modules/resources/components/RowHeader.vue';
import BaseIcon from "@/core/components/BaseIcon.vue";
import { ref } from 'vue';
import { useLookupStore } from "@/core/state/lookupStore";

export default {
  name: "book-group",
  components: { 
    BookCard,
    RowHeader,
    BaseIcon,
  },
  emits: ['click', 'recommend'],
  setup() {
    const lookupStore = ref(null);
    lookupStore.value = useLookupStore();
    return {
      lookupStore
    }
  },
  data() {
    return {
      hideLeftScroll: true,
      hideRightScroll: false,
    }
  },
  props: {
    showMore: {
      type: Boolean,
      default: false,
    },
    isGrouped: {
      type: Boolean,
      default: true
    },
    headingIcon: String,
    heading: String,
    description: String,
    headingLink: String,
    singleRow: {
      type: Boolean,
      default: false
    },
    includeItemCount:  {
      type: Boolean,
      default: true
    },
    showDescription: {
      type: Boolean,
      default: false,
    },
    resources: {
      type: Array,
      default: () => {[]}
    },
    showAddRecommendation: {
      type: Boolean,
      default: false,
    },
    
  },
  mounted() {
    const row = this.$refs.myrow[0];
    row.addEventListener("scroll", this.listenToScroll);

    // check if we should hide scroll right
    this.hideRightScroll = this.$refs.myrow[0].scrollWidth <= this.$refs.myrow[0].clientWidth;
  },
  computed: {
    scrollIconOptions() {
      return {
        size: '48px',
        colour: 'var(--prr-darkgrey)',
        showShadow: true,
        background: {
          size: '50px',
          borderRadius: '25px',
          colour: 'white',
        },
        hover: {
          size: '50px',
          backgroundColour: 'white',
        }
      }
    },
    groups() {
      if (this.isGrouped) {
        // group by resource type
        var groups = [...new Set(this.resources.map(r => r.resourceType))];

        // get the full resourcetype lookup and order by order
        let resourceTypes = this.lookupStore.resourceTypes.filter ( r => groups.includes(r.key));
        resourceTypes.sort((a,b) => { return a.order <= b.order ? -1 : 1});
        
        return resourceTypes.map( type => {
          // each group is an augmented resourcetype object.
          var group = type;
          if (this.showMore) {
            group.link = this.typeLink(type.key);
          } else {
            group.link = null;
          }
          group.heading = type.value ?? this._heading;
          group.resources = this.resourcesByType(type.key)
          return group;
          });
      } else if (this.resources.length > 0) {
        const type = this.resources[0].resourceType;
        const singleType = [{ 
          key: type, 
          heading: this._heading, 
          link: this.headingLink, 
          resources: this.resources, 
          icon: this.headingIcon}];
        return singleType;
      }
      return [];
    },
    _heading() {
      if (this.heading) {
        var heading = this.heading;
        if (this.includeItemCount) {
          heading += ` (${this.resources.length})`;
        }
        return heading;
      }
      return null;
    },
    showHeaderLink() {
      return this.resources && this.headingLink;
    }
  },
  methods: {
    listenToScroll(e) {
      console.log(e.target.scrollLeft + ", " + (e.target.scrollWidth - e.target.clientWidth));
      this.hideLeftScroll = e.target.scrollLeft == 0;
      this.hideRightScroll = e.target.scrollLeft >= (e.target.scrollWidth - e.target.clientWidth);
    },
    scrollGroupRight() {
      console.log('here');
      const row = this.$refs.myrow[0];
      const width = row.clientWidth;
      this.$refs.myrow[0].scrollBy({
        left: width,
        behavior: "smooth",
      });
    },
    scrollGroupLeft() {
      const row = this.$refs.myrow[0];
      const width = row.clientWidth;
      this.$refs.myrow[0].scrollBy({
        left: -width,
        behavior: "smooth",
      });
    },
    typeLink(key) {
      return `/type/${key}`;
    },
    resourcesByType(key) {
      if (key != 'all'){
        return this.resources.filter( r => r.resourceType == key);
      } else {
        return this.resources;
      }
    },
    handleAddRecommendation(typeKey) {
      this.$router.push(`/recommend/${typeKey}`);
    }
  }


}
</script>

<style scoped>

h1 {
  text-transform: uppercase;
}

.book-group {
  position: relative;
  width: 100%;
  overflow-x: scroll;
  padding: 5px;
}
.column-layout {
  flex-basis: 45%;
}
.row:hover .scroll-nav {
  opacity:1;
}
.scroll-nav {
  pointer-events: none;
  position: absolute;
  display: flex;
  align-items: center;
  opacity:0;
  width: 30px;
  height: 200px;
  z-index: 100;
}

.scroll-nav-left {
  left: 5px;
}

.scroll-nav-right {
  right: 20px;
}

.scroll-icon {
  pointer-events:all;
}
/* .book-group .scroll-left:hover {
  background: rgba(1, 1, 1, 0.1)
} */

.row {
  /* margin-left: 20px; */
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: flex-start;
  overflow: scroll;
  gap: 25px;
  padding-left: 50px;
  padding-right: 50px;
}

.row.singleRow {
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.more {
  display:flex;
  align-items: center;
  height: 145px;
  min-width: 60px;
  background: transparent;
}
/* .add-resource-card {
  display:flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 15px;
  width: 140px;
  height: 205px;
  background: var(--prr-extralightgrey);
} */

@media only screen and (max-width: 600px) {

  .row {
    justify-content: space-around;
    gap: 10px;
    padding-left: 0px;
  }
  
}
</style>