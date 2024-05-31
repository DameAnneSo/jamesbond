<script>
  import HardcodedSVG from './components/chart_hardcoded_svg.svelte'
  import D3Pure from './components/chart_d3only.svelte'
  import D3Svelte from './components/chart_svelte.svelte'

function opacityClick() {
if (opacity ===1)
{opacity = 0.5}
else 
{opacity = 1}
}

let opacity = 1 
$: console.log(opacity)


</script>

<div class="page-column">
  <!-- < class="page-column" style:opacity={opacity}> -->
  <!-- <h1>Charts avec svg, D3 et Svelte</h1> -->
  <HardcodedSVG />
  <D3Pure />
  <D3Svelte opacityChange={opacity}/>

  <button on:click={opacityClick}>click me</button>

</div>


