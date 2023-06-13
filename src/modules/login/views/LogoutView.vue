<template>
    <div></div>
</template>
<script>
import { auth } from '@/core/services/firebaseInit';

export default {
  name: 'logout-view',
  mounted() {
    auth.signOut();
    this.$router.push('/');  
  }
}
</script>