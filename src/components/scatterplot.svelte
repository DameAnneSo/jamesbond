<script>
  // Import the packages from d3
  import { extent } from 'd3-array'
  import { scaleLinear, scaleSqrt } from 'd3-scale'
  import { select } from 'd3-selection'
  import { axisBottom, axisLeft } from 'd3-axis'
  import dataRaw from '../data/007_data.csv'
  import metrics from '../data/007_metrics.csv'
  import { example } from '../stores/store.js'

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

  // let colourDictionary = {
  //   'EON': 'var(--color-main)',
  //   'Famous Artists Productions': 'gray-400',
  //   'Taliafilm': 'gray-900'
  // }

  // Options drop down menu
  let axesOptions = ['IMDB users', 'IMDB critics', 'Rotten Tomatoes critics', 'Rotten Tomatoes users']

  let axisXSelected = 'Rotten Tomatoes critics'
  let axisYSelected = 'Rotten Tomatoes users'

  // array of films
  let filmOptions = data.sort((a, b) => a.title.localeCompare(b.title)).map(d => `${d.title}, ${d.year}`)

  let filmSelected = ''

  // Set the dimensions and margins of the graph
  const margin = { top: 45, right: 45, left: 45, bottom: 45 }
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

    // Custom tick format function
    // const customTickFormat = d => (d === 100 ? `${d}% approved` : d)
    const customTickFormat = d => `${d}%`

    // Create axis generators with grid lines
    const xAxisGrid = axisBottom(xScale).tickFormat(customTickFormat).tickSize(-height)

    const yAxisGrid = axisLeft(yScale).tickFormat(customTickFormat).tickSize(-width)

    // Add the x-axis
    select('g.axisX').attr('transform', `translate(0,${height})`).call(xAxisGrid) // This creates the vertical grid lines

    // Add the y-axis with grid lines
    select('g.axisY').call(yAxisGrid).selectAll('text').attr('transform', 'rotate(90)').style('text-anchor', 'end').attr('dx', '2em').attr('dy', '1.8em')
  }

  // Attach the mousemove event listener to the SVG or container element
  select('svg').on('mousemove', handleMouseMove)

  // Create a hovered data variable
  let hoveredData

  // For the tooltips
  let xPosition = 0
  let yPosition = 0

  function handleMouseMove(event) {
    const cursorX = event.clientX
    const cursorY = event.clientY
  }

  // Calculate Pearson correlation coefficient: will calculate the alignment score based on the correlation between the metrics selected

  let alignmentScore

  const pearsonCorrelation = (x, y) => {
    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0)
    const sumX2 = x.map(xi => xi * xi).reduce((a, b) => a + b, 0)
    const sumY2 = y.map(yi => yi * yi).reduce((a, b) => a + b, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

    return numerator / denominator
  }

  // Compute alignment score of the ratings selected
  $: alignmentScore = pearsonCorrelation(
    data.map(d => d[axisXSelected]),
    data.map(d => d[axisYSelected])
  )

  // Interpreting the Alignment Score
  // Alignment Score close to 1: This indicates a strong positive correlation, meaning that the ratings from different sources are highly aligned. If one source rates a movie highly, the other source is likely to do the same.
  // Alignment Score close to 0: This indicates no correlation, meaning that the ratings from different sources do not have a consistent relationship. High ratings from one source do not predict high or low ratings from the other.
  // Alignment Score close to -1: This indicates a strong negative correlation, meaning that the ratings from different sources are inversely related. If one source rates a movie highly, the other source is likely to rate it low.

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
<h1 class="title_section">The Movie Ratings Conundrum</h1>
<div class="intro_section">
  <p>
    Every time I am about to watch a film, I check the ratings online first. But there so many metrics available! <br />Do Rotten Tomatoes and IMDB ratings align? Do critics and
    audience agree?
    <br />
    Let's conduct a test with the James Bond films.
  </p>
</div>
<!-- scatterplot -->
<div
  class="chart_container"
  on:mouseleave={() => {
    hoveredData = null
  }}>
  <div class="axes_controller_section">
    <div class="vertical_controller_section">
      <p class="controller_text">Select the ratings on the left axis</p>
      <select bind:value={axisYSelected} class="axisY_menu">
        {#each axesOptions as axisYOption}
          {#if axisYOption !== axisXSelected}
            <option>{axisYOption}</option>
          {/if}
        {/each}
      </select>
      {#each metricsData as metric}
        {#if axisYSelected === metric.metric_label}
          <p class="explanation_text">aka {metric.metric_name}: <br /> {metric.metric_short_explanation}</p>
        {/if}
      {/each}
    </div>

    <div class="horizontal_controller_section">
      <p class="controller_text">right axis</p>
      <select bind:value={axisXSelected} class="axisX_menu">
        {#each axesOptions as axisXOption}
          {#if axisXOption !== axisYSelected}
            <option>{axisXOption}</option>
          {/if}
        {/each}
      </select>
      <!-- if axisXSelected corresponds, create a p with metric_name and short_explanation-->
      {#each metricsData as metric}
        {#if axisXSelected === metric.metric_label}
          <p class="explanation_text">aka {metric.metric_name}: <br />{metric.metric_short_explanation}</p>
        {/if}
      {/each}
    </div>
  </div>
  <div class="verdict_and_header_section">
    <!-- put an explanation of the alignement score-->
    <div class="verdict_section">
      {#if alignmentScore > 0.8}
        <p class="verdict_text">Verdict: the {axisXSelected} and {axisYSelected} ratings are highly aligned.</p>
      {:else if alignmentScore < -0.8}
        <p class="verdict_text">erdict: the {axisXSelected} and {axisYSelected} are inversely related.</p>
      {:else}
        <p class="verdict_text">Verdict: the {axisXSelected} and {axisYSelected} are not consistently aligned.</p>
      {/if}
      <p class="explanation_text explanation_verdict">Alignment Score (Pearson correlation): {alignmentScore.toFixed(2)}</p>
    </div>
  </div>
  <svg height="60%" width="60%" id="scatterplot" viewBox="0 0 610 610" preserveAspectRatio="xMidYMid meet" transform="rotate(-45) translate(225,225)">
    <g transform="translate({margin.left}, {margin.top})">
      <!-- add a square background but only on the space between the axis-->
      <rect x="0" y="0" {width} {height} fill="var(--color-gray-950)" />
      <!-- adding the axes -->
      <g class="axisX"></g>
      <g class="axisY"></g>
      <!-- adding a diagonal line -->
      <g class="diagonal_line">
        <line x1={xScale(0)} y1={yScale(0)} x2={xScale(100)} y2={yScale(100)} />
      </g>
      <g>
        <text y="180" x="290" text-anchor="middle" class="annotation_chart" transform="rotate(45)">↑ the higher, the more appreciated</text>
      </g>
      <g>
        {#each metricsData as metric}
          {#if axisYSelected === metric.metric_label}
            <text y="0" text-anchor="middle" transform="rotate(45)" class="annotation_chart">
              <tspan x="50" dy="1.2em" text-anchor="start">← more appreciated by </tspan>
              <tspan x="50" dy="1.2em" text-anchor="start"> {metric.metric_label} </tspan>
            </text>
          {/if}
        {/each}
      </g>

      <g>
        {#each metricsData as metric}
          {#if axisXSelected === metric.metric_label}
            <text y="0" text-anchor="middle" transform="rotate(45)" class="annotation_chart">
              <tspan x="550" dy="1.2em" text-anchor="end">→ more appreciated by </tspan>
              <tspan x="550" dy="1.2em" text-anchor="end"> {metric.metric_label} </tspan>
            </text>
          {/if}
        {/each}
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
            r={hasDrawn ? 5 : 0}
            fill={'var(--color-main)'}
            on:mouseover={() => (hoveredData = datum)}
            on:focus={() => (hoveredData = datum)}
            tabIndex="0" />
        {/each}
      </g>
    </g>
  </svg>
  {#if hoveredData}
    <Tooltip data={hoveredData} {xScale} {yScale} {axisXSelected} {axisYSelected} {width} {xPosition} {yPosition} {height} />
  {/if}

  <div class="film_selected_section">
    <div class="header_chart_section">
      <p class="explanation_text controller_text middle_text text_desktop">Each bubble is James Bond film. Hover for details</p>
      <p class="explanation_text controller_text middle_text middle_text text_mobile">Each bubble is a James Bond film. Click for details</p>
    </div>
    <p class="controller_text search_text"><br />Looking for a specific film?</p>
    <select bind:value={filmSelected} class="filmSelected_menu">
      {#each filmOptions as filmOption}
        <option>{filmOption}</option>
      {/each}
    </select>
    <div class="film_selected_text">
      <button class="filmSelected_reset" on:click={() => (filmSelected = undefined)}>Reset</button>
    </div>
  </div>
</div>

<div class="footer_section">
  <p class="footer_text">
    November 2024 (data from May 2024)<br />
    Sources: IMDB, Rotten Tomatoes, Wikipedia <br />
    Author: Anne-Sophie Pereira De Sá | <a href="https://curiousdata.netlify.app/" target="_blank">Curious Data Website</a>
  </p>
</div>

<!-- 
TO DO in the future 
1/ fix the tooltip position 
2/ use stores (see video number 37)
  -->

<style>
  .title_section {
    width: 100%;
    text-align: left;
    margin-bottom: 0rem;
  }

  .intro_section {
    /* margin-bottom: 2.5rem; */
    /* text-wrap: balance; */
  }

  .intro_section p {
    color: var(--color-gray-300);
  }

  .controller_text {
    font-size: 0.8rem;
    color: var(--color-gray-200);
    margin-bottom: 0;
  }

  .vertical_controller_section {
    position: absolute;
    top: 0; 
    left: 0;
    margin-top:2rem ;
  }

  .horizontal_controller_section {
    position: absolute;
    top: 0;
    right: 0;
    margin-top:2rem ;
  }

  .axisY_menu,
  .axisX_menu,
  .filmSelected_menu {
    border: 3px solid var(--color-gray-50);
    border-radius: 0.25rem;
    font-size: 0.8rem;
  }

  .verdict_and_header_section {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .film_selected_section {
    position: absolute;
    bottom: 0;
    right: 0;
    /* z-index: 10; Optional: Ensure it appears above other content */
  }

  .header_chart_section p {
    text-align: left;
  }

  .verdict_section {
    padding: 0.5rem 1rem;
    background-color: var(--color-main);
    border-radius: 0.25rem;
    width: 50%;
  }
  .verdict_text {
    margin-bottom: 0;
    color: var(--color-gray-950);
  }
  .explanation_text {
    font-size: 0.7rem;
    color: var(--color-gray-400);
    margin-bottom: 0;
    margin-top: 0.25rem;
    font-style: italic;
  }

  .explanation_verdict {
    color: var(--color-gray-600);
  }

  .search_text {
    color: var(--color-gray-400);
  }

  .filmSelected_menu {
    background-color: var(--color-gray-400);
    border-color: var(--color-gray-400);
  }

  .filmSelected_reset {
    margin-top: 0.5rem;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    border: 1px solid var(--color-gray-300);
    border-radius: 0.25rem;
    background-color: var(--color-gray-300);
    cursor: pointer;
  }

  .film_selected_text {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .footer_section {
    margin-top: 2rem;
    display: block;
  }
  .footer_text {
    font-size: 0.6rem;
    color: var(--color-gray-400);
    text-align: center;
  }

  .chart_container {
    position: relative;
    flex-grow: 1;
    min-height: 0;
    overflow: hidden;
  }

  .text_mobile {
    display: none;
  }

  /* Chart styles */

  circle {
    transition:
      r 1000ms ease,
      transform 500ms ease-in-out,
      opacity 300ms ease,
      cx 1000ms ease-in-out,
      cy 1000ms ease-in-out;
    stroke: var(--color-gray-500);
    stroke-width: 0.5;
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
    font-size: 0.6rem;
    /* stroke: var(--color-gray-100); */
    fill: var(--color-gray-400);
  }

  .axisX,
  .axisY {
    font-size: 0.55rem;
    color: var(--color-gray-500);
  }

  .diagonal_line {
    stroke: var(--color-gray-500);
    stroke-width: 0.5px;
  }

  :global(.axisX line, .axisY line) {
    stroke: var(--color-gray-700);
    stroke-opacity: 0.5;
    /* stroke-dasharray: 1; */
  }

  :global(.axisX path, .axisY path) {
    stroke: var(--color-gray-700);
  }

  @media screen and (max-width: 800px) {
    .text_mobile {
      display: block;
    }
    .text_desktop {
      display: none;
    }

    .vertical_controller_section,
    .horizontal_controller_section,
    .verdict_and_header_section,
    .film_selected_section {
      position: relative;
      width: 100%;
    }

    svg#scatterplot {
      transform: none !important;
      translate: none !important;
      height: 100%;
      width: 100%;
    }
    /* Update text transformations for mobile */
    text.annotation_chart[transform*='rotate(45)'] {
      transform: rotate(0deg);
    }

    /* Mobile-specific label positions */
    g text[y='180'][x='290'] {
      text-anchor: end;
    }

    /* Equal appreciation text */
    g text[y='310'] tspan {
      text-anchor: start;
    }

    /* Chart container adjustments */
    .chart_container {
      position: relative;
      flex-grow: 1;
      min-height: 0;
      overflow: hidden;
    }

    :global(.axisX line, .axisY line) {
      stroke: none;
    }
  }
</style>