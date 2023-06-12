<template>
  <figure :class="{landscape: isLandscape, square: isSquare, preview: preview }" >
    <div v-if="showAddPlaceholder" class="placeholder" @click="$emit('addRecommend', resource)" title="Recommend">
      <span class="material-symbols-outlined">add_circle</span>
    </div>
    <template v-else>
      <div v-if="showMissingImageMask">Missing Image</div>  
      <img 
        v-else
        :src="url"
        :alt="resource.displayName"  
        @error="showMissingImageMask = true"
        @click="$emit('click', resource)"
      />
      <figcaption v-if="showTitle && !showAddPlaceholder" >
        <h1 :title="resource.displayName">{{ resource.displayName }}</h1>
        <h2 :title="authorsDisplay">{{ authorsDisplay }}</h2>
      </figcaption>
    </template>
    </figure>
</template>

<script>
import { Resource } from "@/modules/resources/model/resource";
// import ResourceTypeEnum from "../model/resourceTypeEnum";
export default {
  name: "resource-image",
  emits: ['click','addRecommend'],
  props: { 
    resource: Resource, 
    showTitle: {
      type: Boolean,
      default: false,
    },
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
    isSquare(){
      return this.resource.imageShape == 'square';
    },
    isLandscape(){
      return this.resource.imageShape == 'landscape';
    },
    url() {
      return this.resource.imageUrl ?? this.resource.parentResourceImageUrl ?? 'forecerror';
    },
    authorsDisplay() {
      if (this.resource.authors) {
        return this.resource.authors.join(", ")
      }
      return null;
    },
  },
}
</script>

<style scoped>

figure {
  display: table;
  margin: 0px;
  height: fit-content;
}

figcaption {
  display:table-caption;
  caption-side:bottom;
}


h1 {
  font-size: var(--prr-font-size-small);
  line-height: 15px;
  font-weight: 500;
  margin: 0px 0px 5px 0px;
  padding-bottom: 0px;
  overflow: hidden;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2; 
   -webkit-box-orient: vertical;
}

h2 {
  font-size: var(--prr-font-size-small);
  margin: 5px 0px 5px 0px;
  font-weight: 400;
  line-height: 15px;
  color: var(--prr-mediumgrey);
  overflow: hidden;
  display: -webkit-box;
   -webkit-line-clamp: 3; /* number of lines to show */
           line-clamp: 3; 
   -webkit-box-orient: vertical;
}

figure img, figure .placeholder {
  height: 100%;
  width: 100%;
  height:145px;
  width: 100px;
  object-fit: cover;
  /* margin-right: 20px; */
  border: 1px solid var(--prr-lightgrey);
  border-radius: 10px;
  cursor: pointer;
}

figure.preview img, figure.preview .placeholder {
  height:110px;
  width: 75px;
  margin-bottom: 0px;
}

figure.landscape img, figure.landscape .placeholder {
  height:124px;
  width: 160px;
}
figure.landscape.preview img {
  height:75px;
  width: 110px;
  margin: 0px;
  padding: 0px;
}

.square img, .square .placeholder{
  height:124px;
  width: 124px;
}
figure.square.preview img {
  height:75px;
  width: 75px;
  margin: 0px;
  padding: 0px;
}

figure:hover .action-strip {
  visibility: visible;
}

/* figure.preview img {
  margin-right: 20px;
} */

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