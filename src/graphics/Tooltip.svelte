<script>
  export let data
  export let xScale
  export let yScale
  export let axisXSelected
  export let axisYSelected

  $: x = xScale(data[axisXSelected])
  $: y = yScale(data[axisYSelected]) + 50

  export let width // Imported from App.svelte; represents chart width
  let tooltipWidth // Calculated using bind:clientWidth below
  $: xPosition = x + tooltipWidth > width ? x - tooltipWidth : x
</script>

<div
  class="tooltip"
  style="position: absolute; 
      top: {y}px; 
      left: {x}px"
  bind:clientWidth={tooltipWidth}>
  <p>{data.title} <span class="tooltip_year">{data.year}</span></p>
  <p>IMDB rating: <span class="tooltip_score">{data['IMDB users']}</span> based on {data.rating_IMDB_numbers} votes</p>
  <p>Metacritic rating: <span class="tooltip_score">{data['IMDB critics']}</span></p>
  <p>Rotten Tomatoes Tomatoscore: <span class="tooltip_score">{data['Rotten Tomatoes critics']}</span></p>
  <p>Rotten Tomatoes audience_score: <span class="tooltip_score">{data['Rotten Tomatoes users']}</span></p>
  <p>Box office adjusted 2005: ${data.box_office_adjusted}M <span>(${data.box_office_actual}M in real box office in dollars)</span></p>
</div>

<style>
  .tooltip {
    background-color: white;
    border: 1px solid var(--color-gray-500);
    padding: 6px;
    border-radius: 3px;
    pointer-events: none; /* -this is to make sure that the tooltip doesn't interfere with the mouse events */
    transition:
      top 300ms ease,
      left 300ms ease;
  }

  p {
    margin: 0;
    font-size: 0.7rem;
  }
</style>
