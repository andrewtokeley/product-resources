<template>
  <h1>About.</h1>
  <p>
    <i>Recommended by the community, for the community</i>
  </p>
  <p>
    Product people are a generous bunch, regularly sharing their latest good read, podcast episode
    or article. Having a home for these recommendations, is the inspiration for creating this site 
    and what keeps it alive, relevant and supportive of the growing number of professional product
    leaders around the world.
  </p>
  
  <figure>
    <img src="@/assets/product_community.jpeg"/>
    <figcaption>Fig.1 - Trulli, Puglia, Italy.</figcaption> 
  </figure>

  <p>
    My hope is that Top Product Resources becomes a destination for both seasoned product leaders 
    looking for inspiration and for those at the start of their product journey trying to get their 
    head around what it's all about.
  </p>
  
</template>

<style scoped>

.heading {
  text-transform: uppercase;
  font-family: Work Sans, sans-serif;
  font-size: 60px;
  font-weight: 700;
  line-height: 50px;
}
h1 {
  text-transform: uppercase;
  font-family: Work Sans, sans-serif;
  font-size: 60px;
  font-weight: 700;
  line-height: 50px;
}
figure { 
  float: left;
  width: 50%;
}

figcaption {
  text-align: center;
  color: var(--prr-mediumgrey);
}

@media only screen and (max-width: 600px) {
figure img { 
  width: 90%;
  margin-left: 20px;
  margin-right: auto;
} 
}
</style>