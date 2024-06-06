<script>
  import HardcodedSVG from './components/chart_hardcoded_svg.svelte'
  import D3Pure from './components/chart_d3only.svelte'
  import D3Svelte from './components/chart_svelte.svelte'

// opacity change
function opacityClick() {
if (opacity ===1)
{opacity = 0.5}
else 
{opacity = 1}
}
let opacity = 1 
// $: console.log(opacity)

// drop down menu options
let chartOptions = [
  'Hardcoded SVG',
  'D3 Pure',
  'D3 Svelte'
]
// by default show the last option
let selectedChart =chartOptions[2];

$:console.log(selectedChart)
</script>

<div class="page-column">
  
 <select bind:value={selectedChart}>
    {#each chartOptions as chartOption}
        <option>{chartOption}</option>
    {/each}
</select>




  <!-- < class="page-column" style:opacity={opacity}> -->
  <h1>Charts avec svg, D3 et Svelte</h1>
  <!-- <h2>Scatterplot hardcoded in svg</h2>
  <HardcodedSVG />
  <h2>Scatterplot built with d3</h2>
  <D3Pure />
  <h2>Scatterplot built with d3 and Svelte</h2>
  <button on:click={opacityClick}>click me</button>
  <D3Svelte opacityChange={opacity}/>
 -->

{#if selectedChart === chartOptions[0]}
 <h2>Scatterplot hardcoded in svg</h2>
  <HardcodedSVG />

{:else if selectedChart === chartOptions[1]}
  <h2>Scatterplot built with d3</h2>
    <D3Pure />
  
    {:else }
  <h2>Scatterplot built with d3 and Svelte</h2>
    <button on:click={opacityClick}>click me</button>
    <D3Svelte opacityChange={opacity}/>
  {/if}

  </div>
<!-- // drop down du chart a afficher  avec select binding 
  READ 
https://www.visualcinnamon.com/2015/11/learnings-from-a-d3-js-addict-on-starting-with-canvas/
DO 
https://svelte.dev/examples/select-bindings 
DO MORE 
tenter mettre mon chart Eurovision 
-->