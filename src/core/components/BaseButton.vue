<template>
  <button
    :disabled="disabled"
    class="base-button"
    :class="{
      'base-button--danger': isDestructive,
      'base-button--secondary': isSecondary,
      'base-button--spinning': showSpinner,
      'base-button--transparent': isTransparent,
      }"
  >
    <span class="base-button__text"><slot></slot></span>
    </button>
</template>

<script>

export default {
  name: "base-button",
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
    }
  },

};
</script>

<style scoped>

.base-button {
  position: relative;
  display: inline-block;
	/* padding: 10px 20px; */
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 3px;
  text-align: center;
  text-decoration: none;
  font-size: var(--prr-font-size-normal);
  font-weight: var(--prr-font-weight);
  border: none;
  margin-left: 10px;
  background: var(--prr-green);
  color: var(--prr-blue);
  /* background: var(--prr-darkgrey);
  color: white; */
  height: 30px;
  font-weight: 600;
  min-width: 120px;
  transition: background 400ms;
}
.base-button:focus {
  outline: none;
}
.base-button:hover {
  cursor: pointer;
}

.base-button:disabled {
  cursor: default;
  background: white;
  color: var(--prr-mediumgrey);
  border: 1px solid var(--prr-lightgrey);
}

/* TRANSPARENT */
.base-button--transparent {
  background: transparent;
  color: var(--prr-blue);
  border: 1px transparent solid;
}
.base-button--secondary:hover {
  background: transparent;
}

/* SECONDARY */
.base-button--secondary {
  background: white;
  color: var(--prr-blue);
  border: 1px var(--prr-lightgrey) solid;
}
.base-button--secondary:hover {
  background: var(--prr-lightgrey);
}

/* DANGER */
.base-button--danger {
  background: var(--prr-red);
  color: white;
  border: 1px var(--prr-red) solid;
}

/* SPINNER */
.base-button--spinning::after {
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

.base-button--spinning .base-button__text {
  visibility: hidden;
  opacity: 0;
}

@keyframes button-loading-spinner {
    from {
        transform: rotate(0turn);
    }
    to {
        transform: rotate(1turn);
    }
}
</style>