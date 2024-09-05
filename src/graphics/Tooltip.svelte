<script>
  export let data
  export let xScale
  export let yScale
  export let axisXSelected
  export let axisYSelected
  export let width // Imported from App.svelte; represents chart width

  $: x = xScale(data[axisXSelected])
  $: y = yScale(data[axisYSelected])

  let tooltipWidth // Calculated using bind:clientWidth below
  $: xPosition = x + tooltipWidth > width ? x - tooltipWidth : x

  $: console.log(x, y)
</script>

<div
  class="tooltip"
  style="position: absolute; 
      top: {y}px; 
      left: {x}px"
  bind:clientWidth={tooltipWidth}>
  <h1>{data.title}</h1>
  <span class="tooltip_receeded">({data.year})</span>
  <p class="tooltip_metric">Audience scores</p>
  <p>
    <span class="tooltip_score">{data['Rotten Tomatoes users']}</span> on Rotten Tomatoes | <span class="tooltip_score">{data['IMDB users']}</span> on IMDBbased on {data.rating_IMDB_numbers}
    votes
  </p>
  <p class="tooltip_metric">Juries scores</p>
  <p><span class="tooltip_score">{data['Rotten Tomatoes critics']}</span> on Rotten Tomatoes | <span class="tooltip_score">{data['IMDB critics']} </span>on IMDB</p>
  <p><span class="tooltip_receeded">${data.box_office_adjusted}M in box office adjusted 2005 | (${data.box_office_actual}M in real box office in dollars)</span></p>
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

  h1 {
    font-size: 1rem;
    margin: 0;
    display: inline-block;
  }
  .tooltip_receeded {
    font-size: 0.6rem;
  }

  .tooltip_score {
    font-weight: bold;
    color: var(--color-main);
  }

  .tooltip_metric {
    font-style: italic;
    color: var(--color-gray-500);
  }
</style>
