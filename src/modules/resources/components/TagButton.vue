<template>
  <button :class="{'enable-hover': enableHoverEffect, selected: selected}"><slot></slot></button>
</template>

<script>
export default {
  name: "tag-button",  

  props: {
    enableHoverEffect: {
      type: Boolean,
      default: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },

}

</script>
<style scoped>
  button {
    height: 30px;
    border-radius: 15px;
    border:none;
    padding: 0px 20px;
    font-size: var(--prr-font-size-normal);
    font-weight: var(--prr-font-weight);
    cursor: pointer;
    color: var(--prr-blue);
    background: var(--prr-extralightgrey);
    white-space: nowrap;
    transition: 400ms;
  }

  button:hover.enable-hover {
    background: var(--prr-green);
  }

  button.selected {
    background: var(--prr-green);
  }
  
</style>