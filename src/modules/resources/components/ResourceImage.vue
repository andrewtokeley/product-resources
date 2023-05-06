<template>
  <div class="resource-image" :class="{square: isSquare, preview: preview }" >
      <img 
        :src="url"
        alt="Missing Image"  
        @error="showMissingImageMask = true"
        @click="openResource(resource.resourceUrl)"
      />
      <div class="missing-image-mask" v-if="showMissingImageMask">Missing {{ `${resource.resourceType.value}` }} Preview</div>
      <div v-if="!showMissingImageMask && !hideActions" class="action-strip" >
        <base-icon title="More information" :options="{ hover: { colour: 'var(--prr-green)' }, colour: 'white' }" @click="handleShowInfo">info</base-icon>
        <base-icon title="Write a review" :options="{ hover: { colour: 'var(--prr-green)' }, colour: 'white' }" @click="showRecommend = true">thumb_up</base-icon>
      </div>

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
  //emits: ['info', 'recommend'],
  components: { BaseIcon, RecommendDialog, ResourceDetail },
  props: { 
    resource: Resource, 
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
    isSquare() {
      switch (this.resource.resourceType.key.toLowerCase()) {
        case 'podcasts': 
        case 'episode':
          return true;
          default: return false;
      }
    },
    url() {
      if (this.resource.imageUrl && this.resource.imageUrl.length > 0) {
        return this.resource.imageUrl;
      } else {
        return 'forceerror';
      }
    },
  },
  methods: {
    openResource(url) {
      if (!this.hideActions) {
        window.open(url, '_blank');
      }
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
}

.resource-image.preview {
  height:80px;
  width: 55px;
  margin-bottom: 0px;
}

.resource-image.square {
  height:114px;
  width: 114px;
}
.resource-image.square.preview {
  height:60px;
  width: 60px;
  margin: 0px;
  padding: 0px;
}

/* .resource-image.square img {
  height:114px;
  width: 114px;
} */

.resource-image:hover .action-strip {
  visibility: visible;
}
.resource-image img {
  /* height:215px;
  width: 140px; */
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid black;
  margin-right: 20px;
  cursor: pointer;
  box-sizing: border-box;
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
/* .resource-image.square .action-strip {
  width: 115px;
} */

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

</style>