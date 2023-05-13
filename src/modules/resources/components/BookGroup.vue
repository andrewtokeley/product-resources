<template>
  <div class="book-group">
    <template v-for="group in groups" :key="group.key" >
      <row-header :headingIcon="group.icon" :heading="group.heading" :headingLink="group.link"></row-header>
      <div class="row" :class="{ singleRow: singleRow }">
        <book-card 
          v-for="resource in group.resources"
          :key="resource.id"
          :showDescription="showDescription"
          :showTitle="!showDescription"
          :resource="resource" 
          @click="$emit('click', resource)">
        </book-card>
        <div v-if="showAddRecommendation" >
          <book-card 
            :resource="blankResource" 
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
import { Resource } from '@/modules/resources/model/resource'
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
    isGrouped: {
      type: Boolean,
      default: true
    },
    headingIcon: String,
    heading: String,
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
          group.link = this.typeLink(type.key);
          group.heading = type.value ?? this._heading;
          group.resources = this.resourcesByType(type.key)
          return group;
          });
      } else {
        const singleType = [{ key: 'all', heading: this._heading, link: this.headingLink, resources: this.resources, icon: this.headingIcon}];
        return singleType;
      }
    },

    blankResource() {
      if (this.resources.length > 0) {
        let type = this.resources[0].resourceType
        return Resource.default(type);
      } else {
        return Resource.default('books');
      }
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
  gap: 10px;
}

.row.singleRow {
  flex-wrap: nowrap;
  justify-content: space-evenly;
}

.add-resource-card {
  display:flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 15px;
  width: 140px;
  height: 205px;
  background: var(--prr-extralightgrey);
}

</style>