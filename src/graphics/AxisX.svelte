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