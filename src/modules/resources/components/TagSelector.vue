<template>
  <div class="tag-selector">
      <ul>
        <li v-for="tag in m_tags" :key="tag.key" >
          <tag-button :enableHoverEffect="singleSelect ? true :false" :selected="isSelected(tag.key)" @click="toggleSelection(tag.key)">{{tag.value}}</tag-button>
        </li>
      </ul>
  </div>
</template>

<script>
import { getTags } from "@/modules/resources/services/lookup-service"
import TagButton from "@/modules/resources/components/TagButton.vue"

export default {
  name: "tag-selector",
  emits: ['tagClicked', 'update:modelValue'],
  components: {
    TagButton,
  },

  data() {
    return {
      m_tags: [],
      lastSelectedKey: null,
      selectedTagKeys: [],
    }
  },

  props: {
    tags: {
      type: Array,
      default: null,
    },
    modelValue: {
      type: Array,
      default: () => {[]}
    },
    singleSelect: {
      type: Boolean,
      default: false,
    }
  },

  async mounted() {
    if (!this.tags || this.tags.length == 0) {
      let lookup = await getTags();
      this.m_tags = lookup.keyValues;
    } else {
      this.m_tags = this.tags;
    }
    console.log(this.m_tags);
    this.selectedTagKeys = this.modelValue ?? [];
  },

  methods: {
    toggleSelection(key) {
      let isOn;
      var index = this.selectedTagKeys.indexOf(key);
      if (index > -1) {
        // unselect, remove from selected array
        this.selectedTagKeys.splice(index, 1);
        isOn = false;
      } else {
        // add to selected array. Remove previously selected if singleSelect
        if (this.singleSelect) {
          if (this.selectedTagKeys.length == 1) {
            this.$emit('tagClicked', this.selectedTagKeys[0], false);
            this.selectedTagKeys = [];
          }
        }
        this.selectedTagKeys.push(key);
        isOn = true;
      }
      // send complete selected array back to client
      this.$emit('tagClicked', key, isOn);
      this.$emit('update:modelValue', this.selectedTagKeys);
    },

    isSelected(key) {
      if (this.selectedTagKeys) {
        return this.selectedTagKeys.includes(key);
      }
      return false;
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