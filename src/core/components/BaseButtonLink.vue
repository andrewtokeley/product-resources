<template>
  <router-link
    :disabled="disabled"
    class="base-button-link"
    :class="{
      'base-button-link--danger': isDestructive,
      'base-button-link--secondary': isSecondary,
      'base-button-link--spinning': showSpinner,
      'base-button-link--transparent': isTransparent,
      }"
  >
      <span class="base-button-link__text">
        <slot></slot>
        <span v-show="iconName" class="material-symbols-outlined">{{ iconName }}</span>
      </span>
    </router-link>
</template>

<script>

export default { 
  name: "base-button-link",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isDestructive: {
      type: Boolean,
      default: false
    },
    isSecondary: {
      type: Boolean,
      default: false
    },
    isTransparent: {
      type: Boolean,
      default: false,
    },
    showSpinner: {
      type: Boolean,
      default: false
    },
    iconName: {
      type:String,
      default: null,
    }
  },

};
</script>

<style scoped>

.base-button-link {
  position: relative;
  display: inline-block;
	padding: 0px 20px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 3px;
  text-align: center;
  text-decoration: none;
  font-size: var(--prr-font-size-normal);
  font-weight: var(--prr-font-weight);
  border: none;
  background: var(--prr-green);
  color: var(--prr-blue);
  height: 40px;
  font-weight: 600;
  min-width: 120px;
  transition: background 400ms;
  border: 1px transparent solid;
}
.base-button-link:hover {
  cursor: pointer;
}

.base-button-link:disabled {
  cursor: default;
  background: white;
  color: var(--prr-mediumgrey);
  border: 1px solid var(--prr-lightgrey);
}

/* TRANSPARENT */
.base-button-link--transparent {
  background: transparent;
  color: var(--prr-blue);
  border: 1px transparent solid;
}
.base-button-link--secondary:hover {
  background: transparent;
}

/* SECONDARY */
.base-button-link--secondary {
  background: white;
  color: var(--prr-blue);
  border: 1px var(--prr-lightgrey) solid;
}
.base-button-link--secondary:hover {
  background: var(--prr-lightgrey);
}

/* DANGER */
.base-button-link--danger {
  background: var(--prr-red);
  color: white;
  border: 1px var(--prr-red) solid;
}

/* SPINNER */
.base-button-link--spinning::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 4px solid transparent;
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: button-loading-spinner 1s ease infinite;
}

.base-button-link--spinning .base-button-link__text {
  visibility: hidden;
  opacity: 0;
}

.base-button-link__text {
  display:flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.material-symbols-outlined {
  margin-left: 10px;
}

@keyframes button-loading-spinner {
    from {
        transform: rotate(0turn);
    }
    to {
        transform: rotate(1turn);
    }
}

@media only screen and (max-width: 600px) {

  .base-button-link {
    min-width: 100px;
  }
}
</style>