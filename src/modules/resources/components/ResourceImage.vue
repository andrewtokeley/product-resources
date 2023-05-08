<template>
  <div class="resource-image" :class="{square: isSquare, preview: preview }" >
      <div class="placeholder" v-if="showAddPlaceholder" @click="handleShowRecommend">
        <span class="icon__text material-symbols-outlined">add_circle</span>
      </div>
      <template v-else>
        <div class="missing-image-mask" v-if="showMissingImageMask">Missing {{ `${resource?.resourceType.value}` }} Preview</div>  
        <img 
          v-if="!showMissingImageMask"
          :src="url"
          alt="Missing Image"  
          @error="showMissingImageMask = true"
          @click="openResource(resource.resourceUrl)"
        />
        
        <div v-if="!showMissingImageMask && !hideActions &&!showAddPlaceholder" class="action-strip" >
          <base-icon title="More information" :options="{ hover: { colour: 'var(--prr-green)' }, colour: 'white' }" @click="handleShowInfo">info</base-icon>
          <base-icon title="Write a review" :options="{ hover: { colour: 'var(--prr-green)' }, colour: 'white' }" @click="showRecommend = true">thumb_up</base-icon>
        </div>
      </template>
      <resource-detail v-if="showInfo" :resource="resource" @close="showInfo = false"></resource-detail>
      <recommend-dialog v-if="showRecommend" :resource="resource" @close="showRecommend = false"></recommend-dialog>
  </div>
</template>

<script>
import { Resource } from "@/modules/resources/model/resource";
import BaseIcon from "@/core/components/BaseIcon.vue";
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';
import RecommendDialog from '@/modules/recommendations/views/RecommendDialog.vue';

export default {
  name: "resource-image",
  components: { 
    BaseIcon, 
    RecommendDialog, 
    ResourceDetail 
  },
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
    hideActions: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      showMissingImageMask: false,
      showRecommend: false, 
      showInfo: false
    }
  },
  computed: {
    isSquare(){
      if (!this.resource) { return false }
      switch (this.resource.resourceType.key.toLowerCase()) {
        case 'podcasts': 
        case 'episode':
          return true;
          default: return false;
      }
    },
    url() {
      if (!this.resource) {
        return 'forceerror';
      } else {
        return this.resource.imageUrl ?? this.resource.parentResourceImageUrl ?? 'forecerror';
      }
    },
  },
  methods: {
    openResource(url) {
      if (!this.hideActions) {
        window.open(url, '_blank');
      }
    },
    handleShowRecommend() {
      this.showRecommend = true
    },
    handleShowInfo() {
      this.showInfo = true;
      history.pushState(
        {},
        null,
        this.$route.path + '?r=' + encodeURIComponent(this.resource.id)
      )
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
  border: 1px solid var(--prr-lightgrey);
  border-radius: 15px;
}

.resource-image.preview {
  height:80px;
  width: 55px;
  margin-bottom: 0px;
}

.square {
  height:114px;
  width: 114px;
}
.resource-image.square.preview {
  height:60px;
  width: 60px;
  margin: 0px;
  padding: 0px;
}

.resource-image:hover .action-strip {
  visibility: visible;
}
.resource-image img {
  max-width: 100%;
  max-height: 100%;
  /* border-radius: 5px; */
  object-fit: cover;
  margin-right: 20px;
  scale: 1.05;
  cursor: pointer;
  /* box-sizing: border-box; */
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
  border-radius: 5px;
  background: var(--prr-lightgrey);
  color: white;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 15px;
  background: var(--prr-extralightgrey);
  cursor: pointer;
}
</style>