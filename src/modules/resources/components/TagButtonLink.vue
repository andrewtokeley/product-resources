<template>
  <router-link 
    :to="tagLink"
    class="tag-button-link"
    :class="{small: isSmall, 'enable-hover': enableHoverEffect, selected: selected}">
      {{tag.value}}
  </router-link>
</template>

<script>
export default {
  name: "tag-button",  

  props: {
    tag: null,
    linkRoot: {
      type: String,
      default:  '/tag',
    },
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

  computed: {
    tagLink() {
      if (this.tag) {
        return `${this.linkRoot}/${this.tag.key}`;
      } else {
        return '/';
      }
    }
  }
}

</script>
<style scoped>
  .tag-button-link {
    height: 30px;
    border-radius: 15px;
    border:none;
    padding: 5px 20px;
    font-size: var(--prr-font-size-normal);
    font-weight: var(--prr-font-weight);
    color: var(--prr-blue);
    background: var(--prr-extralightgrey);
    cursor: pointer;
    white-space: nowrap;
    text-decoration: none;
    transition: background 400ms;
  }

  .tag-button-link.small {
    font-size: var(--prr-font-size-small);
    font-weight: bold;
  }
  .tag-button-link:hover.enable-hover {
    background: var(--prr-green);
  }

  .tag-button-link.selected {
    background: var(--prr-green);
  }
  
  .button-content {
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>