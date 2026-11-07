<script lang="ts">
  import { closeness, type GuessEntry } from "../types/GuessResult";

  let {
    guesses,
    mostRecentGuess,
  }: { guesses: GuessEntry[]; mostRecentGuess: GuessEntry | null } = $props();

  const labels = { guess: "", hint: " 💡", surrender: " 🏳️🇫🇷" };
</script>

{#snippet row(guess: GuessEntry, className = "")}
  {@const close = closeness(guess)}
  <tr class={className}>
    <td>{guess.guessNumber}</td>
    <td>{guess.word}{labels[guess.kind]}</td>
    <td>{(guess.similarity * 100).toFixed(2)}</td>
    <td>{close === null ? "nei" : `${close}/1000`}</td>
  </tr>
{/snippet}

<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Ord</th>
      <th>Likhetsgrad</th>
      <th>Nærme?</th>
    </tr>
  </thead>
  <tbody>
    {#if mostRecentGuess}
      {@render row(mostRecentGuess, "most-recent")}
    {/if}
    {#each guesses as guess (guess.guessNumber)}
      {#if guess !== mostRecentGuess}
        {@render row(guess)}
      {/if}
    {/each}
  </tbody>
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
