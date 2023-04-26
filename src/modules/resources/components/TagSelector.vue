<template>
  <div class="tag-selector">
      <ul>
        <li v-for="tag in tags.items" :key="tag.key" >
          <tag-button :enableHoverEffect="false" :selected="isSelected(tag)" @click="toggleSelection(tag)">{{tag.value}}</tag-button>
        </li>
      </ul>
  </div>
</template>

<script>
import { getTags } from "@/modules/resources/services/lookup-service"
import TagButton from "@/modules/resources/components/TagButton.vue"

export default {
  name: "tag-selector",

  components: {
    TagButton,
  },

  data() {
    return {
      tags: [],
      selectedTags: [],
    }
  },

  props: {
    modelValue: {
      type: Array,
      default: () => {[]}
    }
  },

  emits: ['update:modelValue'],

  async mounted() {
    this.tags = await getTags();
    this.selectedTags = this.modelValue;
  },

  methods: {
    toggleSelection(tag) {
      var index = this.selectedTags.map(s=>s.key).indexOf(tag.key);
      if (index > -1) {
        this.selectedTags.splice(index, 1);
        console.log('off')
      } else {
        this.selectedTags.push(tag);
        console.log('on')
      }
      this.$emit('update:modelValue', this.selectedTags);
    },

    isSelected(tag) {
      return this.selectedTags.map(t => t.key).includes(tag.key);
    }
  }
}
</script>

<style scoped>

.tag-selector {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
}

.tag-selector ul {
  list-style-type: none;
  padding-left: 0px;
  margin-top: 0px;
}

.tag-selector li {
  padding: 5px;
  display: inline-block;
}
</style>