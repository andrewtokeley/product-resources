<template>
  <div class="user-profile">
    <h1>Manage Your Profile</h1>
    <p>Here is where you manage your profile</p>
    <div class="label">This is the name that will be displayed with your reviews.</div>
    <base-input v-model="user.displayName" :options="{placeholder: 'Display Name'}"></base-input>
    <!-- <h2>Your Recommendations</h2>
    <h2>Your Reviews</h2> -->
    <div class="actions">
      <base-button :isSecondary="true" @click="$router.go(-1)">Close</base-button>
      <base-button :isPrimary="true" :showSpinner="isSaving" @click="handleSave">Save</base-button>
    </div>
  </div>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
import { getUser, updateUser } from '../services/user-services'
import { useUserStore } from '@/core/state/userStore'
import { User } from '@/modules/users/model/user';
import BaseButton from '@/core/components/BaseButton.vue';

export default {
  components: { BaseInput, BaseButton },
  setup() {
    
  },
  data() { 
    return {
      user: User.default(),
      isSaving: false,
    }
  },
  computed: {
    store() {
      return useUserStore();
    }
  },

  async mounted() {
    this.user = await getUser(this.store.uid);
  },

  methods: {
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
