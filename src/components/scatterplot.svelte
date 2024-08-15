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
    rating_Metascore:+d.rating_Metascore,
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

  let colourDictionary = {
    'EON': 'var(--color-main)', 
'Famous Artists Productions': 'gray-400',
'Taliafilm': 'gray-900',
  }

// Options drop down menu
let axesOptions= [
'rating_IMDB_Metascore'
,	'rating_IMDB'
,'rating_RT_tomatoscore'
,'rating_RT_audience_score'
]

let axisXSelected = 'rating_RT_tomatoscore'
let axisYSelected = 'rating_RT_audience_score'

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

// Declare the y (horizontal position) scale - note that this syntax is more verbose than the one above
$: yScale = scaleLinear()
    // extent(data, d => d.rating_RT_audience_score),
    .domain([0, 100])
    .range([height - margin.bottom - margin.top, 0]);

// Declare a radius scale
$: rScale = scaleSqrt()
    .domain(extent(data, d => d.box_office_adjusted))
    .range([3, 20]); 

// Draw the chart
let hasDrawn = false
const draw = () => {
  console.log('draw', hasDrawn)
  setTimeout(() => {
    hasDrawn= true
  }, 500)
}

// Create a hovered data variable
let hoveredData;

// TEST CONSOLE LOGS
// console.log(hasDrawn)
// console.log(dataRaw)
// console.log(data)
// console.log(data[1])
// $: console.log('hoveredData', hoveredData)

// console.log(chartOptions)
// console.log(filmSelected)
</script>

<!-- menus -->
 <div class="grid-container">
  <div class="controller-container">
 <p>x axis</p>
 <select>
 {#each axesOptions as axisXOption}
 <option>{axisXOption}</option>
 {/each}
 </select>

 <p>y axis</p>
 <select>
 {#each axesOptions as axisYOption}
 <option>{axisYOption}</option>
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
  {#each data.sort((a,b) => a.rating_RT_tomatoscore - b.rating_RT_tomatoscore) as datum}
  {@const cx = xScale(datum.rating_RT_tomatoscore)}
  {@const cy = yScale(datum.rating_RT_audience_score)}
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

  circle
  {
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
{#if selectedChart === chartOptions[0]}
 <h2>Scatterplot hardcoded in svg</h2>
  <HardcodedSVG />

{:else if selectedChart === chartOptions[1]}
  <h2>Scatterplot built with d3</h2>
    <D3Pure />
  
    {:else }
  <h2>Scatterplot built with d3 and Svelte</h2>
    <button on:click={opacityClick}>click me</button>
    <D3Svelte opacityChange={opacity}/>
  {/if}
  
TO DO 

question to G: why not working on github? ASK GOOGLE 
refaire fonctionner prettier! 

1/ Work on better axes
2/ drop down de la data dans le chart a afficher avec select binding et au lieu de datum.rating_RT_tomatoscore et datum.rating_RT_audience_score, on met datum.key et datum.value
3/ tech: add a legend to the chart in Svelte (automatically?) LAYERCAKE
4/ tech: highlight a specific movie in the chart = condition avec class en plus, si id est this then class is that ; 
5/ Learn from the more complete course how to nudge the tooltip so that it doesn't go off the screen
6/ line that goes diagonally from 0,0 to 100,100

on my own: work on css and formatting 
add favicon website
 -->