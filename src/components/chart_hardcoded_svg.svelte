<script>
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

const colourDictionary = {
    typeA: 'blue',
    typeB: 'red',
    typeC: 'green'
  }

// Draw the chart
const draw = () => {}
</script>
<h2>Scatterplot hardcoded in svg</h2>

<!-- hard coded svg -->
<svg width="60ch" viewbox="0 0 300 150">
  <rect x="0" y="0" height="100%" width="100%" fill="teal" opacity="0.2" />
  {#each oldData as datum}
    <circle cx={datum.key} cy={datum.value} r="5" fill={colourDictionary[datum.category]} />
  {/each}
</svg>
