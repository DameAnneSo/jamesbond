<script>
  import Scatterplot from './components/scatterplot.svelte'
  import {example} from './stores/store.js'
</script>

<div class="page-column">
  <Scatterplot />
  <div class="footnote-container-mobile">
    <p class="footnote-text">
      Last update: May 2024 <br />
      Sources: IMDB, Rotten Tomatoes, Wikipedia <br />
      Author: Anne-Sophie Pereira De Sá | <a href="https://curiousdata.netlify.app/" target="_blank">Curious Data Website</a>
    </p>
  </div>
</div>