<script> 
export let data ;
export let xScale;
export let yScale;  

// $: console.log(xScale(data.rating_RT_tomatoscore))
// $: console.log(yScale(data.rating_RT_audience_score))

</script>

<div class="tooltip"
style="position: absolute;
top: {yScale(data.rating_RT_audience_score) + 40}px;
left: {xScale(data.rating_RT_tomatoscore) + 0}px;"
>
<p>{data.title} <span class='tooltip_year'>{data.year}</span></p>

 <p>IMDB rating: <span class='tooltip_score'>{data.rating_IMDB}</span> based on {data.rating_IMDB_numbers} votes</p>
<p>Metacritic rating: <span class='tooltip_score'>{data.rating_Metacritic}</span></p>
<p>Rotten Tomatoes Tomatoscore: <span class='tooltip_score'>{data.rating_RT_tomatoscore}</span></p>
<p>Rotten Tomatoes audience_score: <span class='tooltip_score'>{data.rating_RT_audience_score}</span></p>

<p>Box office adjusted 2005: ${data.box_office_adjusted}M <span>(${data.box_office_actual}M in real box office in dollars)</span></p>
</div>

<style>
  .tooltip {
    background-color: white;
    border: 1px solid var(--color-gray-500); 
    padding: 6px;
    border-radius: 3px;
    pointer-events: none; /* -this is to make sure that the tooltip doesn't interfere with the mouse events */
    transition: top 300ms ease, left 300ms ease;
  }

  p {
    margin: 0;
    font-size: 0.7rem;
  }

</style>