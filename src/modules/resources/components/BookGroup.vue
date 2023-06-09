<template>
  <div class="book-group">
    <template v-for="group in groups" :key="group.key" >
      <row-header 
        :headingIcon="group.icon" 
        :heading="group.heading" 
        :headingLink="group.link">
      </row-header>
      <p>{{ description }}</p>
      <div class="row" :class="{ singleRow: singleRow }">
        <book-card 
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
      </div>
      <hr v-if="isGrouped" class="divider"/>
    </template>
  </div>
</template>

<script>
import BookCard from "@/modules/resources/components/BookCard.vue"
import RowHeader from '@/modules/resources/components/RowHeader.vue';
import { ref } from 'vue';
import { useLookupStore } from "@/core/state/lookupStore";

export default {
  name: "book-group",
  components: { 
    BookCard,
    RowHeader,
  },
  emits: ['click', 'recommend'],
  setup() {
    const lookupStore = ref(null);
    lookupStore.value = useLookupStore();
    return {
      lookupStore
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
    }
  },
  computed: {

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
        const singleType = [{ key: type, heading: this._heading, link: this.headingLink, resources: this.resources, icon: this.headingIcon}];
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

.row {
  /* margin-left: 20px; */
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: flex-start;
  overflow: scroll;
  gap: 25px;
}

.row.singleRow {
  flex-wrap: nowrap;
  justify-content: flex-start;
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
  }
  
}
</style>