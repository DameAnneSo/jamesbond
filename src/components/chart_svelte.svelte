<script>
// Import the packages from d3
import { extent} from 'd3-array'
import { scaleLinear, scaleSqrt } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import dataRaw from '../data/007_data.csv'

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
    rating_Metacritic:+d.rating_Metacritic,
    rating_IMDB:+d.rating_IMDB,
    rating_IMDB_numbers:d.rating_IMDB_numbers,
    length_movie:d.length_movie,
    // data written as dd% so need to convert to number by removing % sign and converting to number
    rating_RT_tomatoscore:+d.rating_RT_tomatoscore.replace('%', ''),
    rating_RT_audience_score:+d.rating_RT_audience_score.replace('%', ''),
    Song_theme:d.Song_theme.replace(/^"(.*)"$/, '$1'),
    Song_composed_by:d.Song_composed_by,
    Song_Performed_by:d.Song_Performed_by,
    spotify_rating:+d.spotify_rating
  }))


// Set the dimensions and margins of the graph
let width = 500
$: height = width
const margin = {top: 30, right: 30, left: 30, bottom: 30}

// Declare the x (vertical position) scale
$: xScale = scaleLinear()
    // extent(data, d => d.rating_RT_tomatoscore),
    .domain([0, 100])
    .range([0,width - margin.left - margin.right]);

// Declare the y (horizontal position) scale - note that this syntax is more verbose than the one above
$: yScale = scaleLinear()
    // extent(data, d => d.rating_RT_audience_score),
    .domain([0, 100])
    .range([height - margin.bottom - margin.top, 0]);

// Declare a radius scale
$: rScale = scaleSqrt()
    .domain(extent(data, d => d.box_office_adjusted))
    .range([2, 10]); 

// Draw the chart

let hasDrawn = false

console.log(hasDrawn)
const draw = () => {
  console.log('draw', hasDrawn)
  setTimeout(() => {
    hasDrawn= true
  }, 500)
}

let hoveredData;

console.log(dataRaw)
console.log(data)
console.log(data[1])
$: console.log('hoveredData', hoveredData)
</script>

<!-- new svg in d3 and Svelte -->
 <div class="chart-container" 
 bind:clientWidth={width} 
 on:mouseleave={() =>
{hoveredData = null;
}}>
<svg {width} {height} id='d3_Svelte_chart'>
  <rect x="0" y="0" height="100%" width="100%" class="chart_background" />

  <AxisX {height} {xScale} {margin}/>
  <AxisY {yScale} {width} {margin}/>

  <line  x1="0" y1="100%" x2="100%" y2="0" stroke="black" stroke-width="0.5"/>
  
  <!-- add marks -->
  <g class='inner-chart' transform="translate({margin.left}, {margin.top})">
  {#each data.sort((a,b) => a.rating_RT_tomatoscore - b.rating_RT_tomatoscore) as datum}
  {@const cx = xScale(datum.rating_RT_tomatoscore)}
  {@const cy = yScale(datum.rating_RT_audience_score)}
    <circle class="dot"
     style:transform-origin={`${cx}px ${cy}px`}
    {cx} 
    {cy} 
    r={
    hasDrawn? rScale(datum.box_office_adjusted):0}
    opacity={hoveredData ? hoveredData == datum ? "1" : ".3" : "1"}
    on:mouseover={() => hoveredData = datum}
    on:focus={() => hoveredData = datum}
    tabIndex="0"      
    />
  {/each}
  </g>
</svg>
{#if hoveredData}
<Tooltip data = {hoveredData} {xScale} {yScale}/>
{/if }
</div>

<style>
  circle
  {
    transition: r 1000ms ease, transform 500ms ease-in-out, opacity 300ms ease;;
    stroke: var(--color-main);
    stroke-width: 1;
    /* opacity: 0.6; */
  }

  circle:hover {
    cursor: pointer;
    transform:scale(1.5);
    /* opacity: 1; */
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

question to G: how do you get a scatterplot to be a square but max height is the size of the screen? 

question to G: is there a way to do opacity={hoveredData ? hoveredData == datum ? "1" : ".3" : "1"} via css?


1/ Work on better axis
2/ drop down du chart a afficher avec select binding 
3/ tech: add a legend to the chart in Svelte (automatically?)
4/ tech: highlight a specific movie in the chart = condition avec class en plus, si id est this then class is that ; 
5/ Learn from the more complete course how to nudge the tooltip so that it doesn't go off the screen
6/ line that goes diagonally from 0,0 to 100,100

on my own: make it mobile compatible DONE 
on my own: work on css and formatting 
-->