<template>
  <div class="resource-image" :class="{landscape: isLandscape, square: isSquare, preview: preview }" >
      <div v-if="showAddPlaceholder" class="placeholder" @click="$emit('addRecommend', resource)" >
        <span class="material-symbols-outlined">add_circle</span>
        <!-- <div>{{ recommendText }}</div> -->
      </div>
      <template v-else>
        <div class="missing-image-mask" v-if="showMissingImageMask">Resource Image</div>  
        <img 
          v-if="!showMissingImageMask"
          :src="url"
          :alt="resource.displayName"  
          @error="showMissingImageMask = true"
          @click="$emit('click', resource)"
        />
      </template>
  </div>
</template>

<script>
import { Resource } from "@/modules/resources/model/resource";
// import ResourceTypeEnum from "../model/resourceTypeEnum";
export default {
  name: "resource-image",
  emits: ['click','addRecommend'],
  props: { 
    resource: Resource, 
    showAddPlaceholder: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showMissingImageMask: false,
    }
  },
  computed: {
    // recommendText() {
    //   console.log(this.resource.displayName + ", " + this.resource.resourceType);
    //   return ResourceTypeEnum.fromKey(this.resource.resourceType)?.singular
    // },
    isSquare(){
      return this.resource.imageShape == 'square';
    },
    isLandscape(){
      return this.resource.imageShape == 'landscape';
    },
    url() {
      return this.resource.imageUrl ?? this.resource.parentResourceImageUrl ?? 'forecerror';
    },
  },
}
</script>

<style scoped>

.resource-image {
  position: relative;
  height:145px;
  width: 100px;
  margin-bottom: 5px;
  overflow: hidden;
  border: 1px solid var(--prr-lightgrey);
  border-radius: 10px;
}

.resource-image.preview {
  height:110px;
  width: 75px;
  margin-bottom: 0px;
}

.resource-image.landscape {
  height:124px;
  width: 160px;
}
.resource-image.landscape.preview {
  height:75px;
  width: 110px;
  margin: 0px;
  padding: 0px;
}

.square {
  height:124px;
  width: 124px;
}
.resource-image.square.preview {
  height:75px;
  width: 75px;
  margin: 0px;
  padding: 0px;
}

.resource-image:hover .action-strip {
  visibility: visible;
}
.resource-image img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  margin-right: 20px;
  cursor: pointer;
}
.resource-image.preview img {
  margin-right: 20px;
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

.action-strip a {
  color: white;
  text-align: center;
  transition: 0s;
  font-size: var(--prr-font-size-small);
}

.missing-image-mask {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: var(--prr-lightgrey);
  color: white;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 10px;
  background: var(--prr-extralightgrey);
  cursor: pointer;
  text-align: center;
}

.placeholder:hover {
  background: var(--prr-green);
  color: var(--prr-blue);
}
</style>