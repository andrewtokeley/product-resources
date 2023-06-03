<template>
  <div class="footer">
    <div class="content">
      <p class="mobile">Did we miss some gold? Let us know if you have a <router-link class="link" to="/recommend">recommendation</router-link>.</p>
      <p class="mobile">Proudly Maintained and Sponsored by</p>
      <a href="https://andrewtokeley.com" target="_blank">
        <img class="logo" src="@/assets/text_mark_andrew_tokeley.svg"/>
      </a>
    </div>
  </div>
</template>

<style scoped>

.footer {
  background: var(--prr-green);
  color:black;
  margin-bottom: auto;
}

.content {
  /* width: 80%; */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
}
.logo {
  /* float: right; */
  height: 200px;
}

p {
  text-align: center;
}
.link:hover {
  color: black;
}
.link { 
  color: black;
  /* text-decoration: none; */
}
</style>
