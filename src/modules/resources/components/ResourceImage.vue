<template>
  <div class="resource-image" :class="{square: isSquare}" @click="openResource(resource.resourceUrl)" >
      <img :src="resource.imageUrl"  />
      <div class="action-strip" >
        <base-icon title="More information" :options="{ colour: 'white' }" @click="$emit('info', resource)">info</base-icon>
        <base-icon title="Write a review" :options="{ colour: 'white' }" @click="$emit('recommend', resource)">thumb_up</base-icon>
      </div>
  </div>
</template>

<script>
import { Resource } from "@/modules/resources/model/resource";
import BaseIcon from "@/core/components/BaseIcon.vue";

export default {
  name: "resource-image",
  emits: ['info', 'recommend'],
  components: { BaseIcon },
  props: { resource: Resource },
  computed: {
    isSquare() {
      switch (this.resource.resourceType.key.toLowerCase()) {
        case 'podcasts': 
        case 'episode':
          return true;
          default: return false
      }
    }
  },
  methods: {
    openResource(url) {
      window.open(url, '_blank');
    }
  }
}
</script>

<style scoped>

.resource-image {
  position: relative;
  height:215px;
  width: 140px;
  margin-bottom: 5px;
  overflow: hidden;
}

.resource-image.square {
  height:114px;
  width: 114px;
}

.resource-image.square img {
  height:114px;
  width: 114px;
}

.resource-image:hover .action-strip {
  visibility: visible;
}
.resource-image img {
  height:215px;
  width: 140px;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid black;
  margin-right: 20px;
  cursor: pointer;
  box-sizing: border-box;
}

.action-strip {
  visibility: hidden;
  position: absolute;
  top: 10px;
  width: 100%;
  left:0px;
  right: 0px;
  background: rgba(0,0,0,0.7);
  height: 30px;
  display:flex;
  align-items: center;
  justify-content: center;  
}
/* .resource-image.square .action-strip {
  width: 115px;
} */

.action-strip a {
  color: white;
  text-align: center;
  transition: 0s;
  font-size: var(--prr-font-size-small);
}
/* .actions {
  visibility: hidden;
  float: right;
  display:flex;
  flex-direction: row;
} */

</style>