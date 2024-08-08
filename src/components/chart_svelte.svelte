<script>
// Import the packages from d3
import { extent} from 'd3-array'
import { scaleLinear, scaleSqrt } from 'd3-scale'
import { select } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'
import dataRaw from '../data/007_data.csv'

import AxisX from './AxisX.svelte'
import AxisY from './AxisY.svelte'

import { onMount } from 'svelte'
onMount(() => {draw()})

// Data processing
const data007 = dataRaw.map(d => ({
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
$: xScale = scaleLinear(
    // extent(data007, d => d.rating_RT_tomatoscore),
    [0, 100],
    [0, width - margin.left - margin.right]
  )

// Declare the y (horizontal position) scale - note that this syntax is more verbose than the one above
$: yScale = scaleLinear()
    // extent(data007, d => d.rating_RT_audience_score),
    .domain([0, 100])
    .range([height - margin.bottom - margin.top, 0])

// Declare a radius scale
$: rScale = scaleSqrt()
    .domain(extent(data007, d => d.box_office_adjusted))
    .range([2, 10]); 

// Draw the chart

let hasDrawn = false

console.log(hasDrawn)
const draw = () => {
  console.log('draw', hasDrawn)
  setTimeout(() => {
    hasDrawn= true
  }, 500)

// // Add the x-axis
// // select("g.axisX")
// //  .attr('transform', `translate(0,${height - marginBottom})`)
// //  .call(axisBottom(xScale))
// //  .ticks(width / 40)

// // Add the y-axis, remove the domain line, add grid lines and a label.
// select("g.axisY")
//  .attr('transform', `translate(${marginLeft},0)`)
//  .call(axisLeft(yScale).ticks(height / 40))

//  // TEMPORARY Add an explanatory text
//  .call(g => g.append('text').attr('x', -marginLeft).attr('y', 10).attr('fill', 'currentColor').attr('text-anchor', 'start').text("↑ Audience score ; → Critics score"))
// 
}

console.log(dataRaw)
console.log(data007)
console.log(data007[1])
</script>

<!-- new svg in d3 and Svelte -->
<svg {width} {height} id='d3_Svelte_chart'>
  <rect x="0" y="0" height="100%" width="100%" class="chart_background" />

  <AxisX {height} {xScale} {margin}/>
  <AxisY {yScale} {width} {margin}/>
  <!-- <g class="axisX"></g> -->
  <!-- <g class="axisY"></g> -->

  <!-- add marks -->
  <g >
  {#each data007 as datum}
  {@const cx = xScale(datum.rating_RT_tomatoscore)}
  {@const cy = yScale(datum.rating_RT_audience_score)}
    <circle class="dot"
     style:transform-origin={`${cx}px ${cy}px`}
    {cx} 
    {cy} 
    r={
    hasDrawn? rScale(datum.box_office_adjusted):0}

    />
  {/each}
  </g>
</svg>


<style>
  circle
  {
    transition: r 1000ms ease, transform 1000ms ease;

  }

  circle:hover {
    cursor: pointer;
    transform:scale(1.5);
  }
</style>
<!--  

TO DO 
tech: add tooltips to the circles in Svelte - see Connor's video
drop down du chart a afficher  avec select binding 
tech: how to automatically add a legend to the chart in Svelte
tech: highlight a specific movie in the chart = condition avec class en plus, si id est this then class is that ; 
add to Netlify: wont work because no public folder? 
on my own: make it mobile compatible
on my own: work on css and formatting 
-->