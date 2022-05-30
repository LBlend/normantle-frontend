<script>
  export let guesses;
</script>

<table>
  <tr>
    <th>#</th>
    <th>Ord</th>
    <th>Likhetsgrad</th>
    <th>Nærme?</th>
  </tr>
  {#each guesses as guess}
    <tr>
      <td>{guess.guessNumber}</td>
      <td>{guess.word}</td>
      <td>{(guess.similarity * 100).toFixed(2)}</td>
      {#if guess.isClose}
        <td>{1000 - guess.ofThousand}/1000</td>
      {:else}
        <td>nei</td>
      {/if}
    </tr>
  {/each}
</table>

<style>
  td,
  th {
    padding: 1rem;
  }
  th {
    border-bottom: 2px solid white;
    text-align: left;
  }

  @media screen and (max-width: 600px) {
    td,
    th {
      padding: 0.5rem;
    }
  }
</style>
