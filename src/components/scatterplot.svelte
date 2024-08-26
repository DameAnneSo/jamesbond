<script>
// Import the packages from d3
import { extent} from 'd3-array'
import { scaleLinear, scaleSqrt } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import dataRaw from '../data/007_data.csv'
import metrics from '../data/007_metrics.csv'

import AxisX from '../graphics/AxisX.svelte'
import AxisY from '../graphics/AxisY.svelte'
import Tooltip from '../graphics/Tooltip.svelte'

import { onMount } from 'svelte'
onMount(() => {draw()})

// Data processing
let data = dataRaw.map(d => ({
    index:+d.index,
    title:d.title,
    year:+d.year,
    production_company:d.production_company,
    Bond_actor:d.Bond_actor,
    director:d.director,
    box_office_actual:+d['Box office (millions) Actual $'],
    box_office_adjusted:+d['Box office (millions) Adjusted $2005'],
    ['IMDB critics']:+d['IMDB_critics'],
    ['IMDB users']:+d['IMDB_users'],
    rating_IMDB_numbers:d.rating_IMDB_numbers,
    length_movie:d.length_movie,
    // data written as dd% so need to convert to number by removing % sign and converting to number
    ['Rotten Tomatoes critics']:+d['RT_critics'],
    ['Rotten Tomatoes users']:+d['RT_users'],
    Song_theme:d.Song_theme.replace(/^"(.*)"$/, '$1'),
    Song_composed_by:d.Song_composed_by,
    Song_Performed_by:d.Song_Performed_by,
    spotify_rating:+d.spotify_rating
  }))

let metricsData = metrics.map(d => ({
  metric_label:d.metric_label,
  metric_name:d.metric_name,
  metric_short_explanation:d.metric_short_explanation,
  metric_long_explanation:d.metric_long_explanation,
  source:d.source
  }))

  let colourDictionary = {
    'EON': 'var(--color-main)', 
'Famous Artists Productions': 'gray-400',
'Taliafilm': 'gray-900',
  }

// Options drop down menu
let axesOptions= [
'IMDB users',
'IMDB critics',
'Rotten Tomatoes critics',
'Rotten Tomatoes users'
]

let axisXSelected = 'Rotten Tomatoes critics'
let axisYSelected = 'Rotten Tomatoes users'

// array of films
let filmOptions = data
  .sort((a, b) => a.title.localeCompare(b.title))
  .map(d => `${d.title}, ${d.year}`);

let filmSelected = ''

// Set the dimensions and margins of the graph
let height = 500
$: width = height
const margin = {top: 30, right: 30, left: 30, bottom: 30}

// Declare the x (vertical position) scale
$: xScale = scaleLinear()
    // extent(data, d => d.rating_RT_tomatoscore),
    .domain([0, 100])
    .range([0,width - margin.left - margin.right]);

// Declare the y (horizontal position) scale
$: yScale = scaleLinear()
    // extent(data, d => d.rating_RT_audience_score),
    .domain([0, 100])
    .range([height - margin.bottom - margin.top, 0]);

// Declare a radius scale
$: rScale = scaleSqrt()
    .domain(extent(data, d => d.box_office_adjusted))
    .range([3, 10]); 

// Draw the chart
let hasDrawn = false
const draw = () => {
  // console.log('draw', hasDrawn)
  setTimeout(() => {
    hasDrawn= true;
  }, 500)
}


// Create a hovered data variable
let hoveredData;

// TEST CONSOLE LOGS
// console.log(hasDrawn)
// console.log(dataRaw)
// console.log(data)
// console.log(data[1])
console.log(metricsData)
// $: console.log('hoveredData', hoveredData)
$: console.log(axisXSelected, "is axis X")
$: console.log(axisYSelected, "is axis Y")
// $: console.log(filmSelected, "is film selected")


</script>

<!-- menus -->
<div class="grid-container">
<div class="controller-container">
<p>x axis</p>
<select bind:value={axisXSelected}>
  {#each axesOptions as axisXOption}
    {#if axisXOption !== axisYSelected}
      <option>{axisXOption}</option>
    {/if}
  {/each}
</select>

<p>y axis</p>
<select bind:value={axisYSelected}>
{#each axesOptions as axisYOption}
  {#if axisYOption !== axisXSelected}
    <option>{axisYOption}</option>
  {/if}
{/each}
</select>

<p>highlight a movie</p>
<select>
{#each filmOptions  as filmOption}
<option value="">{filmOption}</option>
{/each}
</select>
</div>

<!-- scatterplot -->
<div class="chart-container" 
bind:clientHeight={height} 
on:mouseleave={() =>
{hoveredData = null;
}}>
<svg height="100%" width="100%" id='scatterplot'>
  <rect x="0" y="0" height="100%" width="100%" class="chart_background" />

  <!-- <AxisX {height} {xScale} {margin}/>
  <AxisY {yScale} {width} {margin}/> -->

  <line  x1="0" y1="100%" x2="100%" y2="0" stroke="black" stroke-width="0.5"/>
  

  <!-- add marks -->
  <g class='inner-chart' transform="translate({margin.left}, {margin.top})">
  {#each data.sort((a,b) => a.axisXSelected - b.axisXSelected) as datum}
  {@const cx = xScale(datum[axisXSelected])}
  {@const cy = yScale(datum[axisYSelected])}
    <circle class="dot"
    style:transform-origin={`${cx}px ${cy}px`}
    {cx} 
    {cy} 
    r={
    hasDrawn? rScale(datum.box_office_adjusted):0}
    fill={colourDictionary[datum.production_company]}
    on:mouseover={() => hoveredData = datum}
    on:focus={() => hoveredData = datum}
    tabIndex="0"      
    />
  {/each}
  </g>
</svg>
</div>
</div>

{#each metricsData as metric}
  {#if axisXSelected === metric.metric_label}
    <p><b>{metric.metric_name}</b>:{metric.metric_short_explanation}</p>
    <small>{metric.metric_long_explanation}</small>
  {/if}
{/each}


{#each metricsData as metric}
  {#if axisYSelected === metric.metric_label}
    <p><b>{metric.metric_name}</b>:{metric.metric_short_explanation}</p>
    <small>{metric.metric_long_explanation}</small>
  {/if}
{/each}


{#if hoveredData}
<Tooltip data = {hoveredData} {xScale} {yScale}/>
{/if }

<style>
.grid-container { 
display:grid; 
height: 100vh;
grid-template-rows: 12rem calc(100vh - 12rem); 
  }

.chart-container {
height:100%; 
aspect-ratio: 1/1;
margin:0 auto;
  }

circle {
    transition: r 1000ms ease, transform 500ms ease-in-out, opacity 300ms ease;;
    stroke: var(--color-gray-500);
    stroke-width: 1;
    /* opacity: 0.6; */
  }

circle:hover {
    cursor: pointer;
    transform:scale(1.5);
    /* opacity: 1; */
  }

  g.inner-chart:hover circle:not(:hover){
    opacity: 0.3;
  }

  circle:focus {
    outline: none;
  }

  .chart_background {
  fill: var(--color-main);
  opacity: 0.2;
}
</style>


<!--  
TO DO 
0/ refaire fonctionner prettier! => not working on svelte files...
1/ drop down de la data dans le chart a afficher avec select binding et au lieu de datum.rating_RT_tomatoscore et datum.rating_RT_audience_score, on met datum.key et datum.value
=>  done mais il y a pas de jolie transition quand les dots bougent

2/ mais du coup, comment rajouter une box qui explique ce que c'est que le key et le value?
=> done mais pas mis en forme 

-------
3/ tech: highlight a specific movie in the chart = condition avec class en plus, si id est this then class is that, ternary ; 

4/ Learn from the more complete course how to nudge the tooltip so that it doesn't go off the screen

5/ Work on better axes to add to how to create the axes with svelte https://d3js.org/getting-started
6/ line that goes diagonally from 0,0 to 100,100
7/ working on github? ASK GOOGLE 
see: https://github.com/orgs/community/discussions/21853
and https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow
8/ Add mobile formatting with media queries
9/ on my own: work on css and formatting 
10/add favicon website
11/tech: add a legend to the chart in Svelte (automatically?) LAYERCAKE

    // Diagonal line: calculate the start and end points
    const xStart = x(0), // Starting point on the X axis
      yStart = y(0), // Starting point on the Y axis (inverted because SVG's 0,0 is at the top left)
      xEnd = x(20), // Ending point on the X axis
      yEnd = y(20); // Ending point on the Y axis
    // Append a diagonal dotted line from bottom left to top right
    svg
      .append("line")
      .attr("class", "diagonal_line")
      .attr("x1", xStart)
      .attr("y1", yStart)
      .attr("x2", xEnd)
      .attr("y2", yEnd);
 -->