<template>
  <button 
    :class="{small: isSmall, 'enable-hover': enableHoverEffect, selected: selected}">
    <span class="button-content">
      <slot></slot>
    </span>
  </button>
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
    isSmall: {
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
    transition: background 400ms;
  }

  button.small {
    font-size: var(--prr-font-size-small);
    font-weight: bold;
  }
  button:hover.enable-hover {
    background: var(--prr-green);
  }

  button.selected {
    background: var(--prr-green);
  }
  
  .button-content {
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>