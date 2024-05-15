<script>
  const data = [
    { key: 30, value: 20, category: 'typeA' },
    { key: 60, value: 130, category: 'typeB' },
    { key: 90, value: 50, category: 'typeA' },
    { key: 120, value: 100, category: 'typeB' },
    { key: 150, value: 30, category: 'typeB' },
    { key: 180, value: 120, category: 'typeC' },
    { key: 210, value: 70, category: 'typeC' },
    { key: 240, value: 50, category: 'typeC' },
    { key: 270, value: 110, category: 'typeC' },
    { key: 250, value: 20, category: 'typeB' }
  ]

  const colourDictionary = {
    typeA: 'blue',
    typeB: 'red',
    typeC: 'green'
  }
</script>

<h1>Scatterplot in svg</h1>

<svg width="60ch" viewbox="0 0 300 150">
  <rect x="0" y="0" height="100%" width="100%" fill="teal" opacity="0.2" />

  <!-- Random circles of radius 5 -->
  {#each data as datum}
    <circle cx={datum.key} cy={datum.value} r="5" fill={colourDictionary[datum.category]} />
  {/each}
</svg>
