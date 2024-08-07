<script>
// Import the packages from d3
import { extent, max } from 'd3-array'
import { scaleUtc, scaleLinear, scaleSqrt } from 'd3-scale'
import { select } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'
import dataRaw from '../data/007_data.csv'

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
let width
$: height = width
const marginTop = 30
const marginRight = 30
const marginBottom = 30
const marginLeft = 30

// Declare the x (vertical position) scale
$: x = scaleLinear(
    // extent(data007, d => d.rating_RT_tomatoscore),
    [0, 100],
    [marginLeft, width - marginRight]
  )

// Declare the y (horizontal position) scale
$: y = scaleLinear(
    // extent(data007, d => d.rating_RT_audience_score),
    [0, 100],
    [height - marginBottom, marginTop]
  )

// Declare a radius scale
$: r = scaleSqrt()
    .domain(extent(data007, d => d.box_office_adjusted))
    .range([2, 10]); 

// Animation 
const reveal = (node, { duration }) => {
  const radius = select (node).attr('r');
  return {
    duration,
    tick: (t) => select(node).attr('r', t * radius)
  }
}

// Draw the chart
const draw = () => {
// Add the x-axis
select("g.axisX")
 .attr('transform', `translate(0,${height - marginBottom})`)
 .call(axisBottom(x))
//  .ticks(width / 40)

// Add the y-axis, remove the domain line, add grid lines and a label.
select("g.axisY")
 .attr('transform', `translate(${marginLeft},0)`)
 .call(axisLeft(y).ticks(height / 40))

 // TEMPORARY Add an explanatory text
 .call(g => g.append('text').attr('x', -marginLeft).attr('y', 10).attr('fill', 'currentColor').attr('text-anchor', 'start').text("↑ Audience score ; → Critics score"))
}

console.log(dataRaw)
console.log(data007)
console.log(data007[1])
</script>

<!-- new svg in d3 and Svelte -->
<div bind:clientWidth={width}>
<svg {width} {height} id='d3_Svelte_chart'>
  <rect x="0" y="0" height="100%" width="100%" class="chart_background" />
  <g class="axisX"></g>
  <g class="axisY"></g>

  <!-- add marks -->
  <g>
  {#each data007 as datum}
    <circle cx={x(datum.rating_RT_tomatoscore)} 
    cy={y(datum.rating_RT_audience_score)} 
    r={r(datum.box_office_adjusted)}
    in:reveal={{duration: 1000}}
    />
  {/each}
  </g>
</svg>
</div>
<!--  

TO DO 
tech: add tooltips to the circles in Svelte - see Connor's video
drop down du chart a afficher  avec select binding 
tech: how to automatically add a legend to the chart in Svelte
tech: highlight a specific movie in the chart = condition avec class en plus, si id est this then class is that ; 
add to Netlify
on my own: make it mobile compatible
on my own: work on css and formatting 
-->