<script>
  import Scatterplot from './components/scatterplot.svelte'
  import { example } from './stores/store.js'
</script>

<div class="page-column">
  <Scatterplot />

</div>

<style>
  .page-column {
    margin: 0 auto;
    width: 95%;
    max-width: 1200px; /* Limit maximum width for very large screens */
    /* overflow: hidden; */  
  }

  @media screen and (max-width: 800px) {
    .page-column {
      overflow: visible;
      height: auto; /* Allow the column to grow in height */
    }




  }
</style>
