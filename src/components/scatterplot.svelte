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

    // Custom tick format function
    // const customTickFormat = d => (d === 100 ? `${d}% approved` : d)
    const customTickFormat = d => `${d}%`

    // Add the x-axis
    select('g.axisX').attr('transform', `translate(0,${height})`).call(axisBottom(xScale).tickFormat(customTickFormat))

    // Add the y-axis
    select('g.axisY').call(axisLeft(yScale).tickFormat(customTickFormat))

    // Attach the mousemove event listener to the SVG or container element
    select('svg').on('mousemove', handleMouseMove)
  }

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

  // Display alignment messages
  $: {
    console.log(`Alignment Score: ${alignmentScore}`)
    if (alignmentScore > 0.8) {
      console.log(`The ratings from ${axisXSelected} and ${axisYSelected} are highly aligned.`)
    } else if (alignmentScore < -0.8) {
      console.log(`The ratings from ${axisXSelected} and ${axisYSelected} are inversely related.`)
    } else {
      console.log(`The ratings from ${axisXSelected} and ${axisYSelected} are not consistently aligned.`)
    }
  }

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
<h1 class="title">The Movie Ratings Conundrum</h1>
<div class="grid-container">
  <div class="left-column">
    <div class="intro-text">
      <p>
        Every time I am about to watch a film, I check the ratings online first. But there so many metrics available! <br />Do Rotten Tomatoes and IMDB ratings align? <br />Are
        expert critics and the general audience in agreement?
        <br />
        Let's conduct a test with the James Bond films.
      </p>
    </div>
    <div class="controllers-section">
      <div class="controller-container">
        <div class="controller-Y">
          <p class="controller_text">Select the ratings on the vertical axis</p>
          <select bind:value={axisYSelected} class="axisY_menu">
            {#each axesOptions as axisYOption}
              {#if axisYOption !== axisXSelected}
                <option>{axisYOption}</option>
              {/if}
            {/each}
          </select>
          {#each metricsData as metric}
            {#if axisYSelected === metric.metric_label}
              <p class="explanation_text">aka {metric.metric_name}: {metric.metric_short_explanation}</p>
            {/if}
          {/each}
        </div>

        <div class="controller-X">
          <p class="controller_text">horizontal axis</p>
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
              <p class="explanation_text">aka {metric.metric_name}: {metric.metric_short_explanation}</p>
            {/if}
          {/each}
        </div>
        <!-- put an explanation of the alignement score-->
        {#if alignmentScore > 0.8}
          <p class="verdict_text">Verdict: the {axisXSelected} and {axisYSelected} ratings are highly aligned.</p>
        {:else if alignmentScore < -0.8}
          <p class="verdict_text">erdict: the {axisXSelected} and {axisYSelected} are inversely related.</p>
        {:else}
          <p class="verdict_text">Verdict: the {axisXSelected} and {axisYSelected} are not consistently aligned.</p>
        {/if}
        <p class="explanation_text">Alignment Score (Pearson correlation): {alignmentScore.toFixed(2)}</p>
        <div class="controller-film">
          <p class="controller_text"><br />highlight a movie</p>
          <select bind:value={filmSelected} class="filmSelected_menu">
            {#each filmOptions as filmOption}
              <option>{filmOption}</option>
            {/each}
          </select>
          <div class="filmSelected_text">
            <button class="filmSelected_reset" on:click={() => (filmSelected = undefined)}>Reset</button>
          </div>
        </div>
      </div>
    </div>
    <div class="footnote-container-desktop">
      <p class="footnote-text">
        Last update: May 2024 <br />
        Sources: IMDB, Rotten Tomatoes, Wikipedia <br />
        Author: Anne-Sophie Pereira De Sá | <a href="https://curiousdata.netlify.app/" target="_blank">Curious Data Website</a>
      </p>
    </div>
  </div>
  <div class="right-column">
    <div class="chart_title_text">
      <p class="explanation_text controller_text middle_text text_desktop">Each bubble is a film. Hover for details</p>
      <p class="explanation_text controller_text middle_text middle_text text_mobile">Each bubble is a film. Click for details</p>
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
            <text y="297.5" text-anchor="middle" class="annotation_chart" transform="rotate(-45)">
              <tspan x="-285" dy="1.2em" text-anchor="start">equal</tspan>
              <tspan x="-285" dy="1.2em" text-anchor="start">appreciation</tspan></text>
          </g>

          <g>
            {#each metricsData as metric}
              {#if axisYSelected === metric.metric_label}
                <text x="5" y="10" text-anchor="start" class="annotation_title">
                  {metric.metric_label}
                </text>
              {/if}
            {/each}
          </g>

          <g>
            {#each metricsData as metric}
              {#if axisXSelected === metric.metric_label}
                <text y="430" x="440" text-anchor="end" class="annotation_title">
                  {metric.metric_label}
                </text>
              {/if}
            {/each}
          </g>

          <g>
            {#each metricsData as metric}
              {#if axisYSelected === metric.metric_label}
                <text x="30" y="150" text-anchor="middle" transform="rotate(-45)" class="annotation_chart"> ↑ more appreciated by {metric.metric_label} </text>
              {/if}
            {/each}
          </g>

          <g>
            {#each metricsData as metric}
              {#if axisXSelected === metric.metric_label}
                <text x="50" y="500" text-anchor="middle" transform="rotate(-45)" class="annotation_chart"> ↓ more appreciated by {metric.metric_label} </text>
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
                r={hasDrawn ? rScale(datum.box_office_adjusted) : 0}
                fill="red"
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
    </div>
  </div>
</div>

<!-- 
/* 

2/ on my own: work on css and formatting

3/add favicon website


*/

TO DO in the future 
1/ fix the tooltip position 
2/ flip the chart by -90 degrees
  -->

<style>
  .title {
    width: 100%;
    text-align: left;
    margin-bottom: 1rem;
  }

  .grid-container {
    display: flex;
    flex-grow: 1;
    gap: 0rem;
    overflow: hidden;
  }

  .left-column {
    width: 40%;
    display: flex;
    flex-direction: column;
    margin-right: 2rem;
    justify-content: space-between;
    align-items: stretch;
  }

  .intro-text {
    margin-bottom: 0rem;
    text-wrap: balance;
  }

  .footnote-text {
    font-size: 0.6rem;
    color: var(--color-gray-500);
    /* align-self: flex-end; */
  }

  .right-column {
    width: 60%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* align-items: flex-start; */
  }

  .controller-Y,
  .controller-X,
  .controller-film {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;
  }

  .controller_text {
    font-size: 0.8rem;
    color: var(--color-gray-500);
    margin-bottom: 0;
    /* font-style: italic; */
  }

  .chart_title_text p {
    text-align: center;
  }

  .verdict_text {
    margin-bottom: 0;
    /* font-size: 1rem; */
  }
  .explanation_text {
    font-size: 0.6rem;
    color: var(--color-gray-500);
    margin-bottom: 0;
    margin-top: 0;
    font-style: italic;
  }
  .axisY_menu,
  .axisX_menu,
  .filmSelected_menu {
    font-size: 0.8rem;
    border: 1px solid var(--color-gray-400);
    border-radius: 0.25rem;
  }

  .filmSelected_reset {
    margin-top: 0.5rem;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    border: 1px solid var(--color-gray-300);
    border-radius: 0.25rem;
    background-color: var(--color-gray-100);
    cursor: pointer;
  }

  .filmSelected_text {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .chart-container {
    position: relative;
    flex-grow: 1;
    min-height: 0;
    overflow: hidden;
    /* align-self: flex-start; */
  }

  @media screen and (max-width: 768px) {
    .grid-container {
      flex-direction: column;
      overflow-y: auto;
    }

    .left-column,
    .right-column {
      width: 100%;
    }

    .footnote-container-desktop {
      display: none;
    }
  }
  .text_mobile {
    display: none;
  }

  @media screen and (max-width: 768px) {
    .text_mobile {
      display: block;
    }

    .text_desktop {
      display: none;
    }
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

  .annotation_title {
    font-size: 0.7rem;
    color: var(--color-gray-900);
  }

  .annotation_chart {
    font-size: 0.5rem;
    color: var(--color-gray-500);
  }

  /* Keyframes for James Bond intro animation */
  @keyframes bondIntro {
    0% {
      cx: 50%;
      cy: 50%;
      r: 0;
      opacity: 0;
    }
    50% {
      r: 50;
      opacity: 1;
    }
    100% {
      cx: var(--final-cx);
      cy: var(--final-cy);
      r: var(--final-r);
      opacity: 1;
    }
  }
</style>
