<template>
  <modal-dialog 
    :title="editResource.displayName"
    :fullscreen="true" 
    :isLoading="isWorking"
    @close="$emit('close')" 
    @buttonClick="handleButtonClick"
    :buttonActions="buttons">
    <div class="content">        
      <div class="double-line">
        <base-select
          v-model="editResource.resourceType"
          :selectOptions="resourceTypes"
          :options="{ 
            placeholder: 'Select Type'}"
        ></base-select>
        
        <div></div>
      </div>

      <base-input
        v-model="editResource.displayName"
        :options="{   
          maximumLength: 300,
          placeholder: 'Add title'}"
      ></base-input>

      <div class="double-line">
        <authors-list v-model="editResource.authors"></authors-list>
        <date-picker v-model="editResource.publishedDate" :options="{ placeholder: 'Published Date' }"></date-picker>
      </div>

      <div class="double-line">
        <base-input v-model="editResource.imageUrl" :options="{ placeholder: 'Add Image URL'}"></base-input>        
        <base-input v-model="editResource.resourceUrl" :options="{ placeholder: 'Add Resource URL'}"></base-input>
      </div>

      <base-multiline-text
        v-model="editResource.description"
        :options="{ 
          placeholder: 'Add Description',
          numberOfLines: 10,
          maximumLength: 1000, 
          showCharacterCount: true}"
      ></base-multiline-text>
      
      <div v-if="editResource.tags" class="line">
        <p>Select which tags apply to this resource.</p>
        <tag-selector 
          v-model="editResource.tags"
        ></tag-selector>
      </div> 

    </div>
  </modal-dialog>
</template>

<script>
import BaseInput from "@/core/components/BaseInput.vue";
import BaseMultilineText from "@/core/components/BaseMultilineText.vue";
import BaseSelect from "@/core/components/BaseSelect";
import DatePicker from "@/core/components/DatePicker";
import TagSelector from "@/modules/resources/components/TagSelector";
import AuthorsList from "@/modules/resources/components/AuthorsList"

import { Resource } from '@/modules/resources/model/resource';
import { cloneDeep } from 'lodash';
import { getResourceTypes } from '@/modules/resources/services/lookup-service';
import ModalDialog from '@/core/components/ModalDialog.vue';
import { addResource, getResource, updateResource } from '@/modules/resources/services/resource-service';

export default {
  components: { 
    BaseInput,
    BaseMultilineText,
    BaseSelect,
    DatePicker,
    TagSelector,
    AuthorsList,
    ModalDialog,
  },
  name: "edit-resource",
  emits: ['close', 'saved', 'added'],
  data() {
    return {
      editResource: Resource,
      resourceTypes: [],
      isWorking: true,
    }
  },

  props: {
    resource: Resource,
  },

  async mounted() {
    this.isWorking = true;
    const lookup = await getResourceTypes();
    this.resourceTypes = lookup.keyValues;

    // take a copy we can edit
    if (this.isNew) {
      this.editResource = Resource.default();
    } else {
      this.editResource =  cloneDeep(this.resource);
    }
    this.isWorking = false;
  },
  
  computed: {
    isNew() {
      return this.resource.id == null || this.resource.id.trim().length == 0;
    },
    buttons() {
      var actions = [];
      actions.push( {
        id: 'cancel',
        title: "Cancel",
        isSecondary: true,
      });
      actions.push( {
        id: 'save',
        title: "Save",
        isPrimary: true,
        show: !this.isNew
      });
      actions.push( {
        id: 'add',
        title: "Add",
        isPrimary: true,
        show: this.isNew
      });
      return actions;
    },
  },

  methods: {
    async handleButtonClick(button) {
      if (button.id == 'add') {
        let id = await addResource(this.editResource);
        this.editResource = await getResource(id);
        this.$emit('added', this.editResource);
      }
      if (button.id == 'save') {
        await updateResource(this.editResource);
        this.$emit('saved', this.editResource);
      }
      if (button.id == 'cancel') {
        this.$emit('close');
      }
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