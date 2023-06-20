<template>
  <div class="user-profile">
    <h1 class="giant">Profile</h1>
    
    <label>Your Link</label>
    <p>This is your own personal link to your recommended resources.</p>
    
    <username-input 
      v-model="user.username"
      @error="invalidUserName = true"
      @valid="invalidUserName = false"
      :options="{ placeholder: 'user name'}">
    </username-input>
    
    <label>Display Name</label>
    <base-input 
      v-model="user.displayName" 
      :errorMessage="errorMessage['displayName']" 
      @input="validate('displayName')"
      :options="{placeholder: 'Display name'}">
    </base-input>
    <div class="label">This name will be displayed with your reviews and on your recommendations page.</div>

    <label>Job Title</label>
    <base-input v-model="user.jobTitle" :errorMessage="errorMessage['jobTitle']" @blur="validate('jobTitle')" :options="{placeholder: 'Job title'}"></base-input>
    <div class="label">Optional job title, displayed with your reviews.</div>

    <div class="actions">
      <base-button :isSecondary="true" @click="$router.go(-1)">Close</base-button>
      <base-button 
        :isPrimary="true" 
        :disabled="!isValid || !isDirty" 
        :showSpinner="isSaving" 
        :iconName="(saved && !isDirty) ? 'done' : null" 
        @click="handleSave">Save</base-button>
    </div>
  </div>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
import BaseButton from '@/core/components/BaseButton.vue';
import UsernameInput from '../components/UsernameInput.vue';
import { getUser, updateUser } from '../services/user-services'
import { useUserStore } from '@/core/state/userStore'
import { User } from '@/modules/users/model/user';
import { validateObject, validateProperty } from '@/core/model/validation';

export default {
  components: { BaseInput, BaseButton, UsernameInput },
  data() { 
    return {
      user: User.default(),
      isSaving: false,
      errorMessage: [],
      saved: false,
      invalidUserName: false,
      originalUser: null,
    }
  },
  computed: {
    store() {
      return useUserStore();
    },
    isValid() {
      return validateObject(this.user, this.user.schema).length == 0 && !this.invalidUserName;
    },
    isDirty() {
      const dirty = 
        this.user.displayName != this.orginalUser.displayName || 
        this.user.jobTitle != this.orginalUser.jobTitle ||
        this.user.username != this.orginalUser.username 
      return dirty;
    },
  },

  async mounted() {
    this.user = await getUser(this.store.uid);
    this.orginalUser = new User(this.user);
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
      // save and update state with user's updated displayName
      const store = useUserStore();
      if (this.isDirty) {
        this.isSaving = true;
        // update the user, including the username
        await updateUser(this.user);
        
        // update user store in case it changed
        store.setDisplayName(this.user.displayName);
        store.setJobTitle(this.user.jobTitle);
        store.setUsername(this.user.username);

        this.isSaving = false;
        this.saved = true;
      }
      
      
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
