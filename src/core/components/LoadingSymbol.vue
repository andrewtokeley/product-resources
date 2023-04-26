<template>
  <div class="loader">
    <div class="wrapper" :style="wrapperStyles">
      <div class="spinner" :style="loaderStyles"></div>
    </div>
    <div class="message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "loading-symbol",
  props: {
    size: {
      type: Number,
      default: 30,
    },
    borderSize: {
      type: Number,
      default: 4,
    },
    message: {
      type: String,
      default: "loading...",
    },
  },

  computed: {
    wrapperStyles() {
      return `border: ${this.borderSize}px solid transparent; width: ${this.size}px; height: ${this.size}px;`;
    },
    loaderStyles() {
      return `border: ${this.borderSize}px solid var(--prr-lightblue); border-top: ${this.borderSize}px solid var(--prr-orange); `;
    },
  },
};
</script>
<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;  
}
.wrapper {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: transparent;
}

.spinner {
  position: absolute;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  animation: spin 2s linear infinite;
  box-sizing: border-box;
}

.message {
  color: white;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>