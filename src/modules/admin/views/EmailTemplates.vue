<template>
  <div class="email-templates">
    <div>
      <h1 class="giant">Email Templates</h1>
    </div>
    
    <label>Template</label>
    <base-select :selectOptions="templateTypes" v-model="selectedTemplateType" ></base-select>
    <label>Subject</label>
    <base-input v-model="selectedTemplate.subject" :options="{ placeholder: 'Subject'}"></base-input>
    <label>Content (Html)</label>
    <base-multiline-text v-model="selectedTemplate.html" :options="{ placeholder: 'Html', numberOfLines: 10}"></base-multiline-text>
    <base-button :showSpinner="isSaving" @click="handleSave">Save</base-button>
  </div>
</template>

<script>
import BaseSelect from '@/core/components/BaseSelect.vue'
import BaseMultilineText from '@/core/components/BaseMultilineText.vue';
import BaseInput from '@/core/components/BaseInput.vue';
import BaseButton from '@/core/components/BaseButton.vue';

import { getEmailTemplateTypes, getEmailTemplate, updateEmailTemplate } from '@/modules/email/service/email-template-service';

export default {
  name: 'email-templates',
  
  components: { 
    BaseSelect,
    BaseMultilineText,
    BaseInput,
    BaseButton,
  },
 
  data() {
    return {
      templateTypes:[],
      selectedTemplateType: null,
      selectedTemplate: {},
      isSaving: false,
    }
  },

  watch: {
    selectedTemplateType(type) {
      console.log('type:'+ type);
      const vm = this;
      if (type != null) {
        getEmailTemplate(type).then ( (result) => {
          console.log('refresh');
          vm.selectedTemplate = result;
        });
      }
    }
  },

  mounted() {
    this.templateTypes = getEmailTemplateTypes();
    if (this.templateTypes.length > 0) {
      this.selectedTemplateType = this.templateTypes[0].key;
    }
  },

  methods: {
    async handleSave() {
      this.isSaving = true;
      await updateEmailTemplate(this.selectedTemplate);
      this.isSaving = false;
    }
  }
}
</script>