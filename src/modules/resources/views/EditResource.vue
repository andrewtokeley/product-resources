<template>
  <div class="content" :class="{ working: isWorking }">        
    
    <div class="double-line">
      <base-select
        v-model="local.resourceType"
        @input="update('resourceType', $event.target.value)"
        :selectOptions="resourceTypes"
        :options="{ 
          placeholder: 'Select Type'}"
      ></base-select>
      
      <div></div>
    </div>

    <base-input
      v-model="local.displayName"
      @input="update('displayName', $event.target.value)"
      :options="{   
        maximumLength: 300,
        placeholder: 'Add title'}"
    ></base-input>

    <div class="double-line">
      <authors-list 
        v-model="local.authors"
        @input="update('authors', $event.target.value)"
      >
      </authors-list>

      <date-picker 
        v-model="local.publishedDate"
        :options="{ placeholder: 'Published Date' }"
        @input="update('publishedDate', $event.target.value)"
      >
      </date-picker>
    </div>

    <div class="double-line">
      <base-input
        v-model="local.imageUrl"
        @input="update('imageUrl', $event.target.value)"
        :options="{ 
          placeholder: 'Add Image URL'}"
      ></base-input>
      
      <base-input
        v-model="local.resourceUrl"
        @input="update('resourceUrl', $event.target.value)"
        :options="{ 
          placeholder: 'Add Resource URL'}"
      ></base-input>
    </div>

    <base-multiline-text
      v-model="local.description"
      @input="update('description', $event.target.value)"
      :options="{ 
        placeholder: 'Add Description',
        numberOfLines: 10,
        maximumLength: 1000, 
        showCharacterCount: true}"
    ></base-multiline-text>
    
    <div v-if="local.tags" class="line">
      <p>Select which tags apply to this resource.</p>
      <tag-selector 
        v-model="local.tags"
        @input="update('tags', $event.target.value)"
      ></tag-selector>
    </div> 

  </div>
</template>

<script>
import BaseInput from "@/core/components/BaseInput.vue";
import BaseMultilineText from "@/core/components/BaseMultilineText.vue";
import BaseSelect from "@/core/components/BaseSelect";
import DatePicker from "@/core/components/DatePicker";
import TagSelector from "@/modules/resources/components/TagSelector";
import AuthorsList from "@/modules/resources/components/AuthorsList"

import { Resource } from '@/modules/resources/model/resource';
import { cloneDeep, tap, set } from 'lodash';
import { getResourceTypes } from '../services/lookup-service';

export default {
  components: { 
    BaseInput,
    BaseMultilineText,
    BaseSelect,
    DatePicker,
    TagSelector,
    AuthorsList,
  },
  name: "edit-resource",

  data() {
    return {
      isWorking: false,
      resourceTypes: [],
    }
  },

  props: {
    modelValue: Object,
  },

  async mounted() {
    const lookup = await getResourceTypes();
    this.resourceTypes = lookup.keyValues;
  },
  
  computed: {
    local() {
      return this.modelValue ? this.modelValue : Resource.default()
    },
  },

  methods: {
    update(key, value) {
      const copy = tap(cloneDeep(this.local), v => set(v, key, value));
      this.$emit('input', copy)
    },
  }
}
</script>

<style scoped>

.double-line{
display: flex;
flex-direction: row;
justify-content: space-around;
gap:20px;
/* not sure why I need to set this? */
height: 50px;
}
.double-line :nth-child(2), .double-line :nth-child(1) {
  width:100%;
}
.label {
color: var(--prr-darkgrey);
margin-top: 20px;
margin-bottom: 5px;
}

.label.tight {
margin-top: 0px;
}

</style>