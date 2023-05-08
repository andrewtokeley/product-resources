<template>
  <div class="book-group">
    <row-header :heading="_heading" :headingLink="headingLink"></row-header>    
    <div class="row" :class="{ singleRow: singleRow }">
      <book-card 
        v-for="resource in resources"
        :key="resource.id"
        :resource="resource" 
        @recommend="$emit('recommend', resource)" 
        @click="$emit('click', resource)">
      </book-card>
      <div v-if="showAddRecommendation" >
        <book-card :resource="blankResource" :showAddPlaceholder="true"></book-card>
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from "@/modules/resources/components/BookCard.vue"
import RowHeader from '@/modules/resources/components/RowHeader.vue';
import { Resource } from '@/modules/resources/model/resource'

export default {
  name: "book-group",
  components: { 
    BookCard,
    RowHeader,
  },

  emits: ['click', 'recommend'],

  props: {
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
    blankResource() {
      if (this.resources.length > 0) {
        let type = this.resources[0].resourceType
        return Resource.default(type);
      } else {
        return Resource.default({ key: 'books', value: 'Book'});
      }
    },
    _heading() {
      var heading = this.heading;
      if (this.includeItemCount) {
        heading += ` (${this.resources.length})`;
      }
      return heading;
    },
    showHeaderLink() {
      return this.resources && this.headingLink;
    }
  },
  methods: {
    handleAddRecommendation() {
      console.log('gg')
      this.$router.replace({ query: { r: 'new'}});
      this.$forceUpdate();
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