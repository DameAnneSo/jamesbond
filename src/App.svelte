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

let chartBalises = [
  '<HardcodedSVG/>',
  '<D3Pure/>',
  '<D3Svelte/>'
]

// by default show the last option
let selectedChart =chartOptions[2];
let visibleChart = chartBalises[2]; 

function dropdownChange() {
 console.log(selectedChart)
  console.log(visibleChart)
}

$:console.log(selectedChart)
// $: console.log(visibleChart)
</script>

<div class="page-column">
  
<form on:submit|preventDefault={dropdownChange}>

 <select bind:value={selectedChart}>
    {#each chartOptions as chartOption}
        <option>{chartOption}</option>
    {/each}
</select>


<input bind:value={chartBalises} />
	<button disabled={!chartBalises} type="submit">
		Submit
	</button>
</form> 

  <!-- < class="page-column" style:opacity={opacity}> -->
  <!-- <h1>Charts avec svg, D3 et Svelte</h1> -->
  <h2>Scatterplot hardcoded in svg</h2>
  <HardcodedSVG />
  <h2>Scatterplot built with d3</h2>
  <D3Pure />
  <h2>Scatterplot built with d3 and Svelte</h2>
  <button on:click={opacityClick}>click me</button>
  <D3Svelte opacityChange={opacity}/>
</div>


<!-- // drop down du chart a afficher  avec select binding 
  READ 
https://www.visualcinnamon.com/2015/11/learnings-from-a-d3-js-addict-on-starting-with-canvas/
DO 
https://svelte.dev/examples/select-bindings 
DO MORE 
tenter mettre mon chart Eurovision 
-->