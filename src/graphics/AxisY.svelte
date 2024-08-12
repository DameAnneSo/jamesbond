<script>
export let width;
export let yScale;
export let margin;

// import { axisBottom, axisLeft } from 'd3-axis'

let yTicks = yScale.ticks(5);
</script>

<g transform="translate({margin.left}, {margin.top})">
 {#each yTicks as tick}
  <text 
  x={0} 
  y={yScale(tick)}>
  {tick} {tick == 100 ? '% approval rate' : '%'}</text>
 {/each}

</g>