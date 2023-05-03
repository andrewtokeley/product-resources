<template>
  <div>
    <div class="resource-card">
      <img class="image" :src="resource.imageUrl"/>
      <div>
        <div class="title">{{ resource.displayName }}</div>
        <div v-if="resource.parentResourceName" class="subTitle">{{ resource.parentResourceName }}</div>
        <div class="body">{{ resource.description }}</div>
        <div>
          <div class="subTitle">{{ resource.pubishedDataAndLengthFormatted }}</div>
        </div>
      </div>
    </div>
    <div class="divider"></div>
  </div>
</template>

<script>
import { Resource } from '@/modules/resources/model/resource'
export default {
  name: 'PodcastEpisodeCard',
  
  props: {
     resource: {
      type: Resource,
      default: null
     }
  },
}

</script>

<style scoped>

.resource-card {
  display: flex;
  flex-direction: row;
  cursor: pointer;
}
.image {
  height:96px;
  width: 96px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 30px;
}
.title {
  letter-spacing: .00625em;
  font-family: "Google Sans",Roboto,Arial,sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  color: #3c4043;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subTitle {
  display: flex;
    letter-spacing: .025em;
    font-family: Roboto,Arial,sans-serif;
    font-size: .75rem;
    font-weight: 400;
    line-height: 1rem;
    color: #5f6368;
}
.body {
  letter-spacing: .01428571em;
  font-family: Roboto,Arial,sans-serif;
  font-size: .875rem;
  font-weight: 400;
  line-height: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  max-height: 40px;
  color: #3c4043;
  margin-top: 4px;
  white-space: pre-line;
  margin-bottom: 10px;
}

hr {
  border-top: 1px solid lightgray;
}

.divider {
  background-color: #dadce0;
  height: 1px;
  position: relative;
  width: 100%;
  margin-top: 20px;
}
</style>