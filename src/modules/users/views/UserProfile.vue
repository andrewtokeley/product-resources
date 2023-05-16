<template>
  <div class="user-profile">
    <h1>Manage Your Profile</h1>
    <p>Here is where you manage your profile</p>
    <div class="label">This is the name that will be displayed with your reviews.</div>
    <base-input v-model="user.displayName" :errorMessage="errorMessage['displayName']" @blur="validate('displayName')" :options="{placeholder: 'Display name'}"></base-input>
    <div class="label">If you want people to be able to find you online, leave your website address.</div>
    <base-input v-model="user.website" :errorMessage="errorMessage['website']" @blur="validate('website')" :options="{placeholder: 'Website/LinkedIn'}"></base-input>
    <!-- <h2>Your Recommendations</h2>
    <h2>Your Reviews</h2> -->
    <div class="actions">
      <base-button :isSecondary="true" @click="$router.go(-1)">Close</base-button>
      <base-button :isPrimary="true" :disabled="!isValid" :showSpinner="isSaving" @click="handleSave">Save</base-button>
    </div>
  </div>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
import { getUser, updateUser } from '../services/user-services'
import { useUserStore } from '@/core/state/userStore'
import { User } from '@/modules/users/model/user';
import BaseButton from '@/core/components/BaseButton.vue';
import { validateObject, validateProperty } from '@/core/model/validation';
export default {
  components: { BaseInput, BaseButton },
  setup() {
    
  },
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
      await updateUser(this.user);
      this.isSaving = false;
      this.$router.go(-1);
    }
  },
}
</script>

<style scoped>

.user-profile {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.actions {
  margin-top: 30px;
  float: right;
}
</style>
