<script>
export let height;
export let yScale;
export let margin;

let yTicks = yScale.ticks(5);
</script>

<g transform="translate({margin.left} {margin.top})">
 {#each yTicks as tick}
  <text 
  x={0} 
  y={yScale(tick)}>{tick}</text>
 {/each}

</g>