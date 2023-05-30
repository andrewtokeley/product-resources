<template>
  <modal-dialog 
    :title="modalTitle"
    :subTitle="editResource.statusDescription"
    :fullscreen="true" 
    :isLoading="isWorking"
    @close="$emit('close')" 
    @buttonClick="handleButtonClick"
    :buttonActions="buttons">
    <div class="content"> 
      <h2>General</h2>
      
      <div class="double-line">
        <div>
          <div class="label tight">Resource Type</div>
          <base-select
            v-model="editResource.resourceType"
            :selectOptions="resourceTypes"
            :options="{ 
              placeholder: 'Select Type'}"
          ></base-select>
        </div>
        <div>
          <div></div>
          <base-check-box 
            v-model="editResource.isFavourite"
            :leftAlign="true"
            label="Display on home page as a favourite."></base-check-box>
        </div>
      </div>

      <div class="label tight">Display</div>
      <base-input
        :hasFocus="true"
        @blur="setTitle"
        :errorMessage="errorMessage['displayName']"
        v-model="editResource.displayName"
        :options="{   
          maximumLength: 300,
          placeholder: 'Add title'}"
      ></base-input>

      <div class="double-line">
        <div>
          <div class="label tight">Authors</div>
          <authors-list v-model="editResource.authors"></authors-list>
        </div>
        <div>
          <div class="label tight">Published Date</div>
          <date-picker v-model="editResource.publishedDate" :options="{ placeholder: 'Published Date' }"></date-picker>
        </div>
      </div>

      <div class="double-line">
        <div>
          <div class="label tight">Image Url</div>
          <base-input v-model="editResource.imageUrl" @blur="validate('imageUrl')" :errorMessage="errorMessage['imageUrl']" :options="{ placeholder: 'Add Image URL'}"></base-input>        
        </div>
        <div>
          <div class="label tight">Firebase Store Name</div>
          <base-input v-model="editResource.imageStorageName" @blur="setImageUrl" :errorMessage="errorMessage['imageStorageName']" :options="{ placeholder: 'Add Firebase Image Name'}"></base-input>
        </div>
      </div>
      
      <div class="label tight">Resourse Url</div>
      <base-input v-model="editResource.resourceUrl" @blur="validate('resourceUrl')" :errorMessage="errorMessage['resourceUrl']" :options="{ placeholder: 'Add Resource URL'}"></base-input>

      
      <div class="label tight">Description</div>
      <base-multiline-text
        v-model="editResource.description"
        :errorMessage="errorMessage['description']"
        @blur="validate('description')"
        :options="{ 
          placeholder: 'Add Description',
          numberOfLines: 8,
          maximumLength: 1000, 
          showCharacterCount: true}"
      ></base-multiline-text>
      <br/><br/>
      <hr class="divider"/>
      <h2>Tags</h2>
      <p>Select which tags apply to this resource.</p>
      <div v-if="editResource.tags" class="line">
        <tag-selector 
          v-model="editResource.tags"
        ></tag-selector>
      </div> 

      <hr class="divider"/>
      <h2>Advanced</h2>
      <!-- <div class="label">ADVANCED</div> -->
      <div class="label">Resource ID</div>
      <base-input
          v-model="editResource.id"
          :options="{ 
            readOnly: true}"
        ></base-input>
      <div class="label">Parent ID</div>
      <div class="label">Recommendation ID</div>
      <base-input
          v-model="editResource.recommendationId"
          :options="{ 
            readOnly: true}"
        ></base-input>
      <div class="label">Parent ID</div>
      <base-input
        :errorMessage="errorMessage['displayName']"
        v-model="editResource.parentResourceId"
        :options="{   
          maximumLength: 100,
          placeholder: 'Add Parent Id (optional)'}"
      ></base-input>
      <div class="label">Parent Name</div>
      <base-input
        :errorMessage="errorMessage['displayName']"
        v-model="editResource.parentResourceName"
        :options="{   
          maximumLength: 100,
          placeholder: 'Add Parent Name (optional)'}"
      ></base-input>
      
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
import { validateObject, validateProperty } from '@/core/model/validation';
import { getPersistentLink } from '@/core/services/imageStorageService'
import BaseCheckBox from '@/core/components/BaseCheckBox.vue';

export default {
  components: { 
    BaseInput,
    BaseMultilineText,
    BaseSelect,
    DatePicker,
    TagSelector,
    AuthorsList,
    ModalDialog,
    BaseCheckBox,
  },
  name: "edit-resource",
  emits: ['close', 'saved', 'added'],
  data() {
    return {
      editResource: Resource,
      resourceTypes: [],
      isWorking: true,
      modalTitle: 'New Resource',
      errorMessage: [],
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
    this.editResource =  cloneDeep(this.resource);
    this.setTitle();

    // if we're editing, do a validation check to highlight incomplete fields
    if (!this.isNew) {
      let failedResults = validateObject(this.editResource, this.editResource.schema);
      failedResults.forEach( result => {
        this.errorMessage[result.propertyName] = result.reason;
      });
    }
    this.isWorking = false;
  },
  
  computed: {
    isNew() {
      return this.resource.id == null || this.resource.id.trim().length == 0;
    },
    hasParent() {
      return this.resource.parentResourceId != null;
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
        title: "Add as Draft",
        isPrimary: true,
        show: this.isNew
      });
      return actions;
    },
  },

  methods: {
    async setImageUrl() {
        if (this.editResource.imageStorageName) {
          try {
            const url = await getPersistentLink(this.editResource.imageStorageName);
            this.editResource.imageUrl = url;
          } catch {
            // don't change whatever's in the url
          }

        } else {
          this.editResource.imageUrl;
        }
    },
    validate(prop) {
      let result = validateProperty(this.editResource, this.editResource.schema, prop);
      this.errorMessage[prop] = result.errorMessage;
      if (result.data) {
        this.editResource[prop] = result.data;
      }
    },
    setTitle() {
      if (this.editResource.displayName?.length > 0) {
        this.modalTitle = this.editResource.displayName 
      } else {
        this.modalTitle = "New Resource"
      }
    },
    async handleButtonClick(button) {
      if (button.id == 'add') {
        console.log('add new recommendation')
        // this will also link the resource with a review if the resource was created from one.
        let resourceId = await addResource(this.editResource);
        this.editResource = await getResource(resourceId);
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
align-items: center;
justify-content: space-around;
gap:20px;
/* not sure why I need to set this? */
/* height: 50px; */
}
.double-line :nth-child(2), .double-line :nth-child(1) {
  width:100%;
}
.label {
  font-weight: bold;
  color: var(--prr-darkgrey);
  margin-top: 20px;
margin-bottom: 5px;
}
.label::after {
  content: ':';
}

.label.tight {
margin-top: 0px;
}

</style>