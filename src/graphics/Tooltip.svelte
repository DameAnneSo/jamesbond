<script>
  export let data
  export let xScale
  export let yScale
  export let axisXSelected
  export let axisYSelected
  export let width // Imported from App.svelte; represents chart width
  export let xPosition
  export let yPosition
  export let handleMouseMove

  $: x = xScale(data[axisXSelected])
  $: yPosition = yScale(data[axisYSelected])

  let tooltipWidth // Calculated using bind:clientWidth below
  $: xPosition = x + tooltipWidth > width ? x - tooltipWidth : x

  $: console.log(x, yPosition)
</script>

<div
  class="tooltip"
  style="position: absolute; 
      top: {yPosition}px; 
      left: {xPosition}px"
  bind:clientWidth={tooltipWidth}>
  <h1>{data.title} <span class="tooltip_receeded">| ({data.year}) </span></h1>
  <p>
    <span class="tooltip_receeded"
      >({data.year}) ${data.box_office_adjusted}M in box office adjusted 2005 <br />
      (${data.box_office_actual}M in real box office in dollars)</span>
  </p>
  <table>
    <thead>
      <tr>
        <th class="tooltip_metric"></th>
        <th class="tooltip_metric">Audience Score</th>
        <th class="tooltip_metric">Juries Score</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="tooltip_metric">Rotten Tomatoes</td>
        <td>
          <span class="tooltip_score">{data['Rotten Tomatoes users']}</span><span class="tooltip_receeded">/100</span>
        </td>
        <td>
          <span class="tooltip_score">{data['Rotten Tomatoes critics']}</span><span class="tooltip_receeded">/100</span>
        </td>
      </tr>
      <tr>
        <td class="tooltip_metric">IMDB</td>
        <td>
          <span class="tooltip_score">{data['IMDB users']}</span><span class="tooltip_receeded">/100</span>
        </td>
        <td>
          <span class="tooltip_score">{data['IMDB critics']}</span><span class="tooltip_receeded">/100</span>
        </td>
      </tr>
    </tbody>
  </table>
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

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
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
    margin: 0rem;
    line-height: 0rem;
  }

  .tooltip_score {
    font-weight: bold;
    color: var(--color-main);
  }

  .tooltip_metric {
    font-style: italic;
    color: var(--color-gray-500);
    font-size: 0.6rem;
    font-weight: lighter;
  }
</style>
