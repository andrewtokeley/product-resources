<template>
  <span v-if="count" class="badge-count">{{ count }}</span>
  <span v-else class="badge-circle"></span>
</template>

<script>
export default {
  name: 'badge-count',
  props: {
    count: {
      type: Number,
      default: null,
    }
  }
}
</script>

<style scoped>

.badge-count {
  display:flex;
  align-items: center;
  justify-content: center;
  width:20px;
  height:20px;
  border-radius: 10px;
  background: rgb(247, 28, 28); 
  color: white;
  font-size: var(--prr-font-size-small);
}
.badge-circle {
  width:10px;
  height:10px;
  border-radius: 5px;
  background: rgb(247, 28, 28); 
}

</style>