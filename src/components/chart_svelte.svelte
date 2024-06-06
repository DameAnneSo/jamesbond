<script>
// Import the packages from d3
import { scaleUtc, scaleLinear } from 'd3-scale'
import { extent, max } from 'd3-array'
import { line } from 'd3-shape'
import { select } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'
// import { timeParse,utcFormat, utcParse } from 'd3-time-format'
import dataRaw from '../data/007_data.csv'

import { onMount } from 'svelte'
onMount(() => {draw()})

export let opacityChange = 1

// Data processing
const data007 = dataRaw.map(d => ({
    index:+d.order,
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

const colourDictionary = {
    typeA: 'blue',
    typeB: 'red',
    typeC: 'green'
  }

// Set the dimensions and margins of the graph
const width = 500
const height = 500
const marginTop = 30
const marginRight = 30
const marginBottom = 30
const marginLeft = 30

// Declare the x (vertical position) scale
const x = scaleLinear(
    // extent(data007, d => d.rating_RT_tomatoscore),
    [0, 100],
    [marginLeft, width - marginRight]
  )

// declare the y (horizontal position) scale
const y = scaleLinear(
    // extent(data007, d => d.rating_RT_audience_score),
    [0, 100],
    [height - marginBottom, marginTop]
  )

// Draw the chart
const draw = () => {
// Add the x-axis
select("g.axisX")
 .attr('transform', `translate(0,${height - marginBottom})`)
 .call(
  axisBottom(x)
    //  .tickSizeOuter(0)
 )

// Add the y-axis, remove the domain line, add grid lines and a label.
select("g.axisY")
 .attr('transform', `translate(${marginLeft},0)`)
 .call(axisLeft(y).ticks(height / 40))
 .call(g => g.select('.domain').remove())
 .call(g =>g
   .selectAll('.tick line')
   .clone()
   .attr('x2', width - marginLeft - marginRight)
   .attr('stroke-opacity', 0.1)
 )
 .call(g => g.append('text').attr('x', -marginLeft).attr('y', 10).attr('fill', 'currentColor').attr('text-anchor', 'start').text("↑ Mon niveau d'understanding de D3 en fonction du temps →"))
}

// console.log(dataRaw)
// console.log(data007)
// console.log(data007[1])
</script>

<!-- new svg in d3 and Svelte -->

<svg id='d3_Svelte_chart' width="60ch" viewbox="0 0 500 500">
  <rect x="0" y="0" height="100%" width="100%" fill="purple" opacity="0.2" />
  <g class="axisX"></g>
  <g class="axisY"></g>
  <!-- add marks -->
  <g style:opacity={opacityChange}>
  {#each data007 as datum}
    <circle cx={x(datum.rating_RT_tomatoscore)} cy={y(datum.rating_RT_audience_score)} r="5" 
     />

        <!-- <circle cx={x(datum.rating_RT_tomatoscore)} cy={y(datum.rating_RT_audience_score)} r="5" fill={colourDictionary[datum.type]}
     /> -->
  {/each}
  </g>
</svg>

<!-- // drop down du chart a afficher  avec select binding 
 Question 1: why index:+d.order gives NaN? 
 Question 2: do you add tooltips to the circles in Svelte or via classic d3? 

 TO DO 
 how to add a legend to the chart in Svelte
 highlight a specific movie in the chart 
 make it mobile compatible
 work on css and formatting 

-->