<script>
export let height ;
export let xScale;
export let margin;

// import { axisBottom, axisLeft } from 'd3-axis'

let xTicks = xScale.ticks(5);
</script>

<g>
 {#each xTicks as tick}
  <text 
  x={xScale(tick)} 
  y={height -margin.bottom}>{tick}%</text>
 {/each}

</g>
<!-- 
// X axis
    const x = d3
      .scaleLinear()
      .domain([0, 20]) // Fixed domain from 0 to 20%
      .range([0, width]);
    svg
      .append("g")
      .attr("class", "X_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat((d) => d + "%")); // Adding "%" to tick labels -->
