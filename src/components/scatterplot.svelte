<script>
  // Import the packages from d3
  import { extent } from 'd3-array'
  import { scaleLinear, scaleSqrt } from 'd3-scale'
  import { select } from 'd3-selection'
  import { axisBottom, axisLeft } from 'd3-axis'
  import dataRaw from '../data/007_data.csv'
  import metrics from '../data/007_metrics.csv'

  import Tooltip from '../graphics/Tooltip.svelte'

  import { onMount } from 'svelte'
  onMount(() => {
    draw()
  })

  // Data processing
  let data = dataRaw.map(d => ({
    index: +d.index,
    title: d.title,
    year: +d.year,
    production_company: d.production_company,
    Bond_actor: d.Bond_actor,
    director: d.director,
    box_office_actual: +d['Box office (millions) Actual $'],
    box_office_adjusted: +d['Box office (millions) Adjusted $2005'],
    ['IMDB critics']: +d['IMDB_critics'],
    ['IMDB users']: +d['IMDB_users'],
    rating_IMDB_numbers: d.rating_IMDB_numbers,
    length_movie: d.length_movie,
    // data written as dd% so need to convert to number by removing % sign and converting to number
    ['Rotten Tomatoes critics']: +d['RT_critics'],
    ['Rotten Tomatoes users']: +d['RT_users'],
    Song_theme: d.Song_theme.replace(/^"(.*)"$/, '$1'),
    Song_composed_by: d.Song_composed_by,
    Song_Performed_by: d.Song_Performed_by,
    spotify_rating: +d.spotify_rating
  }))

  let metricsData = metrics.map(d => ({
    metric_label: d.metric_label,
    metric_name: d.metric_name,
    metric_short_explanation: d.metric_short_explanation,
    metric_long_explanation: d.metric_long_explanation,
    source: d.source
  }))

  let colourDictionary = {
    'EON': 'var(--color-main)',
    'Famous Artists Productions': 'gray-400',
    'Taliafilm': 'gray-900'
  }

  // Options drop down menu
  let axesOptions = ['IMDB users', 'IMDB critics', 'Rotten Tomatoes critics', 'Rotten Tomatoes users']

  let axisXSelected = 'Rotten Tomatoes critics'
  let axisYSelected = 'Rotten Tomatoes users'

  // array of films
  let filmOptions = data.sort((a, b) => a.title.localeCompare(b.title)).map(d => `${d.title}, ${d.year}`)

  let filmSelected = ''

  // Set the dimensions and margins of the graph
  const margin = { top: 30, right: 30, left: 30, bottom: 30 }
  let height = 500 - margin.top - margin.bottom
  let width = 500 - margin.left - margin.right

  // Declare the x (vertical position) scale
  $: xScale = scaleLinear()
    // extent(data, d => d.rating_RT_tomatoscore),
    .domain([0, 100])
    .range([0, width])

  // Declare the y (horizontal position) scale
  $: yScale = scaleLinear()
    // extent(data, d => d.rating_RT_audience_score),
    .domain([0, 100])
    .range([height, 0])

  // Declare a radius scale
  $: rScale = scaleSqrt()
    .domain(extent(data, d => d.box_office_adjusted))
    .range([3, 10])

  // Draw the chart
  let hasDrawn = false
  const draw = () => {
    // console.log('draw', hasDrawn)
    setTimeout(() => {
      hasDrawn = true
    }, 500)

    // Add the x-axis
    select('g.axisX').attr('transform', `translate(0,${height})`).call(axisBottom(xScale))

    // Add the y-axis, remove the domain line, add grid lines and a label.
    select('g.axisY').call(axisLeft(yScale))
  }

  // Create a hovered data variable
  let hoveredData

  // TEST CONSOLE LOGS
  // console.log(hasDrawn)
  // console.log(dataRaw)
  // console.log(data)
  // console.log(data[1])
  // console.log(metricsData)
  // $: console.log('hoveredData', hoveredData)
  // $: console.log(axisXSelected, "is axis X")
  // $: console.log(axisYSelected, "is axis Y")
  // $: console.log(filmSelected, 'is film selected')
</script>

<!-- menus -->
<div class="grid-container">
  <h1>Svelte Training (007)</h1>
  <div class="controller-container">
    <div class="first-row">
      <p>Select your metric</p>
    </div>

    <div class="third-row">
      <select bind:value={axisXSelected}>
        {#each axesOptions as axisXOption}
          {#if axisXOption !== axisYSelected}
            <option>{axisXOption}</option>
          {/if}
        {/each}
      </select>

      <select bind:value={axisYSelected}>
        {#each axesOptions as axisYOption}
          {#if axisYOption !== axisXSelected}
            <option>{axisYOption}</option>
          {/if}
        {/each}
      </select>

      <select bind:value={filmSelected}>
        {#each filmOptions as filmOption}
          <option>{filmOption}</option>
        {/each}
      </select>
    </div>

    <div class="second-row">
      <p>horizontal axis</p>
      <p>vertical axis</p>
      <div class="highlight-movie">
        <p>highlight a movie</p>
        <button class="reset-button" on:click={() => (filmSelected = undefined)}>Reset</button>
      </div>
    </div>
  </div>

  <!-- scatterplot -->
  <div
    class="chart-container"
    on:mouseleave={() => {
      hoveredData = null
    }}>
    <svg height="100%" width="100%" id="scatterplot" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
      <g transform="translate({margin.left}, {margin.top})">
        <!-- adding the axes -->
        <g class="axisX"></g>
        <g class="axisY"></g>
        <!-- adding a diagonal line -->
        <g class="diagonal_line">
          <line x1={xScale(0)} y1={yScale(0)} x2={xScale(100)} y2={yScale(100)} stroke="black" stroke-width="0.5" />
        </g>
        <g>
          <text x="30" y="300" text-anchor="middle" transform="rotate(-45)" class="annotation_chart">
            <tspan x="320" dy="1.2em" text-anchor="end">equal</tspan>
            <tspan x="320" dy="1.2em" text-anchor="end">appreciation</tspan></text>
        </g>

        <g>
          <text y="3" text-anchor="start" class="annotation_chart">
            {#each metricsData as metric}
              {#if axisYSelected === metric.metric_label}
                <tspan x="5" dy="1.2em">{metric.metric_name}</tspan>
                <tspan x="5" dy="1.2em"> {metric.metric_short_explanation}</tspan>
              {/if}
            {/each}
          </text>
        </g>

        <g>
          <text y="410" text-anchor="end" class="annotation_chart">
            {#each metricsData as metric}
              {#if axisXSelected === metric.metric_label}
                <tspan x="440" dy="1.2em">{metric.metric_name}</tspan>
                <tspan x="440" dy="1.2em"> {metric.metric_short_explanation}</tspan>
              {/if}
            {/each}
          </text>
        </g>

        <!-- add marks -->
        <g class="inner-chart">
          {#each data.sort((a, b) => a.axisXSelected - b.axisXSelected) as datum}
            {@const cx = xScale(datum[axisXSelected])}
            {@const cy = yScale(datum[axisYSelected])}
            <circle
              class="dot"
              class:filmHighlighted={filmSelected === `${datum.title}, ${datum.year}`}
              style:transform-origin={`${cx}px ${cy}px`}
              {cx}
              {cy}
              r={hasDrawn ? rScale(datum.box_office_adjusted) : 0}
              fill={colourDictionary[datum.production_company]}
              on:mouseover={() => (hoveredData = datum)}
              on:focus={() => (hoveredData = datum)}
              tabIndex="0" />
          {/each}
        </g>
      </g>
    </svg>
    {#if hoveredData}
      <Tooltip data={hoveredData} {xScale} {yScale} {axisXSelected} {axisYSelected} {width} />
    {/if}
  </div>
</div>

<!--  
TO DO 

1/ mettre les petits points au dessus des grands 

1/ fix the tooltip position 

2/ on my own: work on css and formatting, especially the controllers when you are in mobile view - perhaps put labels and buttons in the same div and make them flex ; try to draw it 
et ajouter un footer 

3/add favicon website

4/ working on github? ASK GOOGLE 
see: https://github.com/orgs/community/discussions/21853
and https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow

5/ try?
const data = await d3.dsv(",", "example.csv", (d) => {
  return {
    year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
    make: d.Make,
    model: d.Model,
    length: +d.Length // convert "Length" column to number
  };
});  

LAYERCAKE 
regarder la doc
ajouter line 
ajouter axes 
 -->

<style>
  .grid-container {
    display: flex;
    flex-direction: column;
    height: 100vh; /* Full viewport height */
  }

  .controller-container {
    display: grid;
    grid-template-rows: auto auto auto;
    grid-template-columns: 1fr 1fr 3fr;
    gap: 0 10px;
  }

  .first-row {
    grid-column: span 3;
    align-items: flex-end;
  }

  .second-row {
    display: contents;
  }

  .second-row p {
    margin: 0;
  }

  .highlight-movie {
    display: flex;
  }

  .third-row {
    display: contents;
  }

  .reset-button {
    padding: 5px 20px;
    margin-left: 10px;
  }

  /* Media query for mobile screens */
  @media (max-width: 600px) {
    .controller-container {
      grid-template-rows: repeat(6, auto);
      grid-template-columns: 1fr;
    }

    .first-row,
    .second-row,
    .third-row {
      display: block;
    }

    .highlight-movie {
      display: block;
    }

    .reset-button {
      margin-left: 0;
      margin-top: 10px;
    }

    .third-row {
      grid-row: 2;
    }

    .second-row {
      grid-row: 3;
    }
  }
  .chart-container {
    flex: 1; /* Take up remaining space */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 0; /* Allow the container to shrink if needed */
  }

  circle {
    transition:
      r 1000ms ease,
      transform 500ms ease-in-out,
      opacity 300ms ease,
      cx 300ms ease,
      cy 300ms ease;
    stroke: var(--color-gray-500);
    stroke-width: 1;
    /* opacity: 0.6; */
  }

  .inner-chart:has(.filmHighlighted) circle:not(.filmHighlighted) {
    opacity: 0.3;
  }

  circle:hover {
    cursor: pointer;
    transform: scale(1.5);
    /* opacity: 1; */
  }

  g.inner-chart:hover circle:not(:hover) {
    opacity: 0.3;
  }

  circle:focus {
    outline: none;
  }

  .annotation_chart {
    font-size: 0.5rem;
    color: var(--color-gray-500);
  }
</style>
