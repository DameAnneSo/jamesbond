<script>
export let height ;
export let xScale;
export let margin;

let xTicks = xScale.ticks(5);
</script>

<g>
 {#each xTicks as tick}
  <text 
  x={xScale(tick)} 
  y={height -margin.bottom}>{tick}</text>
 {/each}

</g>