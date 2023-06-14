<template>
  <div class="user-profile">
    <h1 class="giant">Profile</h1>
    
    <!-- <label>Your Link</label>
    <p>You can share this link to share the resources you've reviewed.</p>
    <username-input 
      :options="{ placeholder: 'user name'}">
    </username-input>
     -->
    <label>Display Name</label>
    <base-input v-model="user.displayName" :errorMessage="errorMessage['displayName']" @blur="validate('displayName')" :options="{placeholder: 'Display name'}"></base-input>
    <div class="label">This is the name that will be displayed with your reviews.</div>

    <label>Job Title (optional)</label>
    <base-input v-model="user.jobTitle" :errorMessage="errorMessage['jobTitle']" @blur="validate('jobTitle')" :options="{placeholder: 'Job title'}"></base-input>
    <div class="label">Optional job title, also displayed with your recommendations/reviews.</div>

    <div class="actions">
      <base-button :isSecondary="true" @click="$router.go(-1)">Close</base-button>
      <base-button :isPrimary="true" :disabled="!isValid" :showSpinner="isSaving" @click="handleSave">Save</base-button>
    </div>
  </div>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
// import UsernameInput from '../components/UsernameInput.vue';
import BaseButton from '@/core/components/BaseButton.vue';

import { getUser, updateUser } from '../services/user-services'
import { useUserStore } from '@/core/state/userStore'
import { User } from '@/modules/users/model/user';
import { validateObject, validateProperty } from '@/core/model/validation';

export default {
  components: { BaseInput, BaseButton },
  data() { 
    return {
      user: User.default(),
      isSaving: false,
      errorMessage: [],
    }
  },
  computed: {
    store() {
      return useUserStore();
    },
    isValid() {
      return validateObject(this.user, this.user.schema).length == 0;
    }
  },

  async mounted() {
    this.user = await getUser(this.store.uid);
  },

  methods: {
    validate(property) {
      let result = validateProperty(this.user, this.user.schema, property);
      if (result) {
        if (!result.success) {
          this.errorMessage[property] = result.errorMessage;
        } else {
          this.user[property] = result.data;
        }
      } else {
        this.errorMessage[property] = "Weird!";
      }
    },

    async handleSave() {
      this.isSaving = true;
      
      // save and update state with user's updated displayName
      const store = useUserStore();
      if (this.user.displayName != store.displayName || this.user.jobTitle != store.jobTitle) {
        await updateUser(this.user);
        store.setDisplayName(this.user.displayName);
        store.setJobTitle(this.user.jobTitle);
      }
      
      this.isSaving = false;

      // simply go back after save.
      this.$router.go(-1);
    }
  },
}
</script>

<style scoped>
.actions {
  margin-top: 30px;
  float: right;
}
</style>
