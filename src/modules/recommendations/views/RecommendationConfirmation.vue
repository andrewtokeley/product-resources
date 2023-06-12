<template>
  <div class="recommendation-confirmation">
    <h1 class="giant">Thanks</h1>
    <p>We'll check out your {{ action }} and get it published as soon as possible.</p>
    <base-button v-if="!isReview" @click="$router.push('/recommend')">Add Another...</base-button>

    <base-button v-if="isReview" 
      @click="$router.go(-2)">OK</base-button>
    <base-button :isSecondary="true" v-else @click="$router.go(-2)">Nah, that's all for now</base-button>
  </div>
</template>

<script>
import BaseButton from '@/core/components/BaseButton.vue';
export default {
  components: { BaseButton },
  name: 'recommendation-confirm',
  data() {
    return {
      action: '',
    }
  },
  mounted() {
    console.log('moun');
    this.action = this.$route.query.action;
  },
  computed: {
    isReview() {
      return this.action.toLowerCase() == 'review';
    }
  }
}
</script>

<style scoped>

</style>