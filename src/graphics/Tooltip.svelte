<script>
  import { onMount } from 'svelte'

  export let data
  export let xScale
  export let yScale
  export let axisXSelected
  export let axisYSelected
  export let width
  export let height

  let tooltipElement
  let tooltipWidth
  let tooltipHeight

  $: x = xScale(data[axisXSelected])
  $: y = yScale(data[axisYSelected])

  $: xPosition = calculateXPosition(x, tooltipWidth, width)
  $: yPosition = calculateYPosition(y, tooltipHeight, height)

  function calculateXPosition(x, tooltipWidth, chartWidth) {
    const padding = 10
    if (x + tooltipWidth + padding > chartWidth) {
      return Math.max(padding, x - tooltipWidth - padding)
    }
    return x + padding
  }

  function calculateYPosition(y, tooltipHeight, chartHeight) {
    const padding = 10
    if (y + tooltipHeight + padding > chartHeight) {
      return Math.max(padding, y - tooltipHeight - padding)
    }
    return y + padding
  }

  onMount(() => {
    if (tooltipElement) {
      tooltipWidth = tooltipElement.offsetWidth
      tooltipHeight = tooltipElement.offsetHeight
    }
  })
</script>

<div bind:this={tooltipElement} class="tooltip" style="position: absolute; left: {xPosition}px; top: {yPosition}px;">
  <h1>{data.title} <span class="tooltip_receeded"> ({data.year})</span></h1>
  <table>
    <thead>
      <tr>
        <th class="tooltip_metric"></th>
        <th class="tooltip_metric">Audience Score</th>
        <th class="tooltip_metric">Jury Score</th>
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
    background-color: var(--color-gray-800);
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
    padding: 1rem;
  }

  th,
  td {
    padding: 1px 3px;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0;
    display: inline-block;
  }
  .tooltip_receeded {
    font-size: 0.6rem;
    margin: 0rem;
    line-height: 0rem;
    color: var(--color-gray-200);
    font-family: var(--ff-secondary);
  }

  .tooltip_score {
    font-weight: bold;
    color: var(--color-main);
    font-family: var(--ff-primary);
  }

  .tooltip_metric {
    font-style: italic;
    color: var(--color-gray-300);
    font-size: 0.6rem;
    font-weight: lighter;
  }
</style>