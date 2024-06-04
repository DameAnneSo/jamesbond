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

// Data processing
const lineData = dataRaw.map(d => ({
    date: utcParse('%d/%m/%Y')(d.date),
    level: +d.level,
    type: d.type
  }))

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
// const lineGenerator = line()
//   .x(d => x(d.date))
//   .y(d => y(d.level))

// Draw the chart
const draw = () => {
// Create the SVG container.
const svg = select('#scatterplot_in_d3')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', [0, 0, width, height])
  .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
  
svg
  .append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('height', height)
  .attr('width', width)
  .attr('fill', 'orange')
  .attr('opacity', 0.2)

// Add the x-axis.
svg
  .append('g')
  .attr('transform', `translate(0,${height - marginBottom})`)
  .call(
    axisBottom(x)
      .ticks(width / 80)
      .tickFormat(utcFormat('%b'))
      .tickSizeOuter(0)
  )

// Add the y-axis, remove the domain line, add grid lines and a label.
svg
  .append('g')
  .attr('transform', `translate(${marginLeft},0)`)
  .call(axisLeft(y).ticks(height / 40))
  .call(g => g.select('.domain').remove())
  .call(g =>
    g
      .selectAll('.tick line')
      .clone()
      .attr('x2', width - marginLeft - marginRight)
      .attr('stroke-opacity', 0.1)
  )
  .call(g => g.append('text').attr('x', -marginLeft).attr('y', 10).attr('fill', 'currentColor').attr('text-anchor', 'start').text("↑ Mon niveau d'understanding de D3 en fonction du temps →"))

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

// console.log(lineData)
// console.log(lineData[1])
// console.log(x(lineData[1].date))
// console.log(y(lineData[1].level))
// console.log(select("#d3_Svelte_chart"))
</script>

<!-- new svg in d3 -->
<div id="scatterplot_in_d3" />
