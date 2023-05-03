<template>
  <div class="row-header">
    
    <router-link v-if="headingLink" class="link" :to="headingLink">
      <h1>{{ heading }}
        <span class="see-all" v-if="headingLink">
          see all >
        </span>
      </h1>
    </router-link>          
    <h1 v-else>{{ heading }}</h1>
  </div>
</template>

<script>

export default {
  name: "row-header",
  props: {
    heading: String,
    headingLink: String,
  }
}
</script>

<style scoped>

.material-icons {
  padding-top:5px;
}
.row-header {
  position: relative;
  margin-left: 20px;
}

.row-header:hover .see-all, .see-all:hover {
  visibility: visible;
  opacity: 1;
  margin-left: 10px;
}
.see-all {
  opacity: 0;
  color: var(--prr-mediumgrey);
  cursor: pointer;
  font-size: var(--prr-font-size-small);
  font-weight: 400;
  visibility: hidden;
  text-transform: none;
  margin-left: -70px;
  transition: 500ms;
}

.link {
  text-decoration: none;  
  color: var(--prr-darkgrey);
}

h1 {
  font-size: var(--prr-font-size-medium);
  text-transform: uppercase;
  cursor: pointer;

}

</style>
