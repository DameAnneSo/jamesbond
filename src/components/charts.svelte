<script>

// Import the packages from d3
import { scaleUtc, scaleLinear } from 'd3-scale'
import { extent, max } from 'd3-array'
import { line } from 'd3-shape'
import { select } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'
import { timeParse,utcFormat, utcParse } from 'd3-time-format'
import dataRaw from '../data/lineData.csv'

import { onMount } from 'svelte'
onMount(() => {draw()})

// Keep oldData to build a hard coded svg
const oldData = [
    { key: 10, value: 120, category: 'typeA' },
    { key: 45, value: 13, category: 'typeB' },
    { key: 130, value: 70, category: 'typeC' },
    { key: 40, value: 50, category: 'typeA' },
    { key: 120, value: 120, category: 'typeB' },
    { key: 60, value: 70, category: 'typeC' },
    { key: 70, value: 80, category: 'typeA' },
    { key: 280, value: 9, category: 'typeB' },
    { key: 90, value: 50, category: 'typeC' }
  ]

// Data processing
const lineData = dataRaw.map(d => ({
    date: utcParse('%d/%m/%Y')(d.date),
    level: +d.level,
    type: d.type
  }))
console.log(lineData)

const colourDictionary = {
    typeA: 'blue',
    typeB: 'red',
    typeC: 'green'
  }

// Set the dimensions and margins of the graph
const width = 500
const height = 300
const marginTop = 20
const marginRight = 30
const marginBottom = 30
const marginLeft = 40

// Declare the x (vertical position) scale
const x = scaleUtc(
    extent(lineData, d => d.date),
    [marginLeft, width - marginRight]
  )

// declare the y (horizontal position) scale
const y = scaleLinear(
    extent(lineData, d => d.level),
    [height - marginBottom, marginTop]
  )

// Declare the line generator, which is the d in the path in the svg
const lineGenerator = line()
  .x(d => x(d.date))
  .y(d => y(d.level))

// Draw the chart
const draw = () => {
  // Create the SVG container.
  const svg = select('#scatterplot_in_d3')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
// add background colour: is there an easier way?
  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', height)
    .attr('width', width)
    .attr('fill', 'orange')
    .attr('opacity', 0.2)

// Add the x-axis.
  // svg
  //   .append('g')
  //   .attr('transform', `translate(0,${height - marginBottom})`)
  //   .call(
  //     axisBottom(x)
  //       .ticks(width / 80)
  //       .tickSizeOuter(0)
  //   )

// Add the y-axis, remove the domain line, add grid lines and a label.
  // svg
  //   .append('g')
  //   .attr('transform', `translate(${marginLeft},0)`)
  //   .call(axisLeft(y).ticks(height / 40))
  //   .call(g => g.select('.domain').remove())
  //   .call(g =>
  //     g
  //       .selectAll('.tick line')
  //       .clone()
  //       .attr('x2', width - marginLeft - marginRight)
  //       .attr('stroke-opacity', 0.1)
  //   )
    // .call(g => g.append('text').attr('x', -marginLeft).attr('y', 10).attr('fill', 'currentColor').attr('text-anchor', 'start').text('↑ Mon niveau d'understanding de D3 en fonction du temps →'))

// Append dots to the svg
svg
  .selectAll('circle')
  .data(lineData)
  .enter()
  .append('circle')
  .attr('cx', d => x(d.date))
  .attr('cy', d => y(d.level))
  .attr('r', 5)
  .attr('fill', d => colourDictionary[d.type])
// svg.append('path').attr('fill', 'none').attr('stroke', 'steelblue').attr('stroke-width', 1.5).attr('d', lineGenerator(lineData))
}
</script>

<!-- hard coded svg -->
<h2>Scatterplot hardcoded in svg</h2>
<svg width="60ch" viewbox="0 0 300 150">
  <rect x="0" y="0" height="100%" width="100%" fill="teal" opacity="0.2" />
  <!-- Random circles of radius 5 -->
  {#each oldData as datum}
    <circle cx={datum.key} cy={datum.value} r="5" fill={colourDictionary[datum.category]} />
  {/each}
</svg>

<!-- new svg in d3 -->
<h2>Scatterplot built with d3</h2>
<div id="scatterplot_in_d3" />


<!-- new svg in d3 -->
<h2>Scatterplot built with d3 and Svelte</h2>
<svg width="60ch" viewbox="0 0 300 150">
  <rect x="0" y="0" height="100%" width="100%" fill="purple" opacity="0.2" />
  <!-- Random circles of radius 5 -->
  {#each lineData as datum}
    <circle cx={datum[x.date]} cy={datum[y.level]} r="5" fill={datum.type} />
  {/each}
</svg>
