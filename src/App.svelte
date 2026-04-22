<script>
  import Scatterplot from './components/scatterplot.svelte'
  import { example } from './stores/store.js'
</script>

<div class="page-column">
  <Scatterplot />

  <div class="footer_mobile_section">
    <p class="footer_text">
      Last update: November 2024 <br />
      Sources: IMDB, Rotten Tomatoes, Wikipedia <br />
      Author: Anne-Sophie Pereira De Sá | <a href="https://curiousdata.netlify.app/" target="_blank">Curious Data Website</a>
    </p>
  </div>
</div>

<style>
  .page-column {
    margin: 0 auto;
    width: 95%;
    max-width: 1200px; /* Limit maximum width for very large screens */
    /* overflow: hidden; */
  }

  .footer_mobile_section {
    display: none;
  }

  @media screen and (max-width: 800px) {
    .page-column {
      overflow: visible;
      height: auto; /* Allow the column to grow in height */
    }

    .footer_mobile_section {
      display: block;
    }
     .footer_text {
    font-size: 0.7rem;
    color: var(--color-gray-400);
   
  }

  .footer_mobile_section p {
     text-align: center;
  }
}
</style>

