<template>
  <div class="logout">
    Logout
    {{status}}
  </div>
</template>

<script>
import { auth } from '@/core/services/firebaseInit';

export default {
  data() {
    return {
      status: 'start'
    }
  },
  mounted() {
    auth.signOut();
    this.status = 'logged out'
    
  }
}
</script>