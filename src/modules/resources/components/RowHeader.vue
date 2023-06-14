<template>
  <div class="row-header">
    
    <router-link v-if="headingLink" class="link" :to="headingLink">
      <span class="material-symbols-outlined">{{headingIcon}}</span>
      <h1>{{ heading }}
        <span class="see-all" v-if="headingLink">
          see all >
        </span>
      </h1>
    </router-link>          
    <div v-else class="link">
      <span class="material-symbols-outlined">{{headingIcon}}</span>
      <h1>{{ heading }}</h1>
    </div>
  </div>
</template>

<script>

export default {
  name: "row-header",
  props: {
    headingIcon: String,
    heading: String,
    headingLink: String,
  }
}
</script>

<style scoped>

.material-symbols-outlined {
  margin: 20px 10px 0px 0px;
}
.row-header {
  position: relative;
  margin-left: 0px;
}

.row-header:hover .see-all, .see-all:hover {
  visibility: visible;
  opacity: 1;
  margin-left: 15px;
}
.see-all {
  position:absolute;
  top: 20px;
  opacity: 0;
  color: var(--prr-darkgrey);
  cursor: pointer;
  font-size: var(--prr-font-size-small);
  font-weight: 400;
  visibility: hidden;
  text-transform: none;
  margin-left: 0px;
  transition: 500ms;
}

.link {
  display:flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;  
  color: var(--prr-darkgrey);
}

h1 {
  font-size: var(--prr-font-size-large);
  text-transform: uppercase;
  line-height: 30px;
  margin: 20px 20px 0px 0px;
  /* cursor: pointer; */

}

</style>
