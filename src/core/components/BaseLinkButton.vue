<template>
  <button class="link-button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'base-link-button',
}
</script>

<style scoped>

button {
  background: none!important;
  border: none;
  padding: 0!important;
  /*input has OS specific font-family*/
  text-decoration: none;
  cursor: pointer;
  transition: color 300ms;
  font-size: var(--prr-font-size-medium);
}

button:hover {
  text-decoration: underline;
  color: var(--prr-green);
}
</style>
