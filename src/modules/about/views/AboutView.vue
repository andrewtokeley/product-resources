<template>
  <div class="about">
    <h1 class="giant">About</h1>
    <h2>Recommended by the community, for the community</h2>

    <p>
      Product people are a generous bunch, regularly sharing their latest good read, podcast episode
      or article. Having a home for these recommendations is the inspiration for creating this site 
      and what keeps it alive, relevant and supportive of the growing number of professional product
      leaders around the world.
    </p>
    
    <figure>
      <img src="@/assets/product_community.jpeg"/>
      <figcaption>ProductTank Wellington Meetup</figcaption> 
    </figure>

    <p>
      Thanks to all those who came along to our <a href="https://www.meetup.com/producttank-wellington" target="_blank">Wellington ProductTank Meetup</a> 
      in April 2019 and shared their favourite product resources. Their ideas formed the start of this collection of inspiration! 
    </p>
    <p>
      Our hope is that Top Product Resources becomes a destination for both seasoned product leaders 
      looking for inspiration and for those at the start of their product journey trying to get their 
      head around what it's all about.
    </p>
  </div>
  
</template>

<style scoped>

figure {
  margin: 0px 20px 20px 0px;
  float: left;
}
figure img{ 
  /* float: left; */
  width: 400px;
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