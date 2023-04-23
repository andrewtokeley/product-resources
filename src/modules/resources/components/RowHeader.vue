<template>
  <div class="row-header">
    <h1 v-if="moreLink" @mouseover="showMoreText=true" @mouseleave="showMoreText=false">
      <router-link class="link" :to="moreLink">{{  title  }}</router-link>
      <div class="more-text" :class="{showMoreText: visible}">see all</div>
    </h1>
    <h1 v-else>
      {{  title  }}
    </h1>
  </div>
</template>

<script>

export default {
  name: "RowHeader",
  props: {
    title: String,
    moreLink: null,
  }
}
</script>

<style scoped>

.link {
  display: inline-block;
}

.more-text {
  opacity: 0;
  transition: 400ms;
}
.more-text.visible {
  opacity: 1;
}

</style>
