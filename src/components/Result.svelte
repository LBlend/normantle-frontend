<script>
  export let guesses;
  export let mostRecentGuess;
</script>

<table>
  <tr>
    <th>#</th>
    <th>Ord</th>
    <th>Likhetsgrad</th>
    <th>Nærme?</th>
  </tr>
  {#if mostRecentGuess}
    <tr class="most-recent">
      <td>{mostRecentGuess.guessNumber}</td>
      <td>{mostRecentGuess.word}</td>
      <td>{(mostRecentGuess.similarity * 100).toFixed(2)}</td>
      {#if mostRecentGuess.isClose}
        <td>{1000 - mostRecentGuess.ofThousand}/1000</td>
      {:else}
        <td>nei</td>
      {/if}
    </tr>
  {/if}
  {#each guesses as guess}
    {#if guess !== mostRecentGuess}
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
    {/if}
  {/each}
</table>

<style>
  table {
    border-collapse: collapse;
  }

  td,
  th {
    padding: 1rem;
  }
  th {
    border-bottom: 2px solid white;
    text-align: left;
  }

  .most-recent {
    border-bottom: 2px solid lightblue;
  }

  @media screen and (max-width: 600px) {
    td,
    th {
      padding: 0.5rem;
    }
  }
</style>
