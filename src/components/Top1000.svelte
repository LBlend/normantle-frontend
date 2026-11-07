<script lang="ts">
  import { ApiError, describeError, request } from "../api";
  import { showGame } from "../router.svelte";
  import type { NearbyWord } from "../types/NearbyWord";

  let { apiRoot, puzzle }: { apiRoot: string; puzzle: number } = $props();

  const words = $derived(
    request<NearbyWord[]>(apiRoot, `/top1000?puzzle=${puzzle}`),
  );

  function message(error: unknown) {
    if (error instanceof ApiError && error.status === 400) {
      return "Denne runden er ikke tilgjengelig ennå";
    }
    return describeError(error);
  }
</script>

<div id="top1000">
  <h2>De 1000 nærmeste ordene for #{puzzle}</h2>
  <p><a href="/" onclick={showGame}>Tilbake til spillet</a></p>

  {#await words}
    <p>Henter ordene…</p>
  {:then words}
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Ord</th>
          <th>Likhetsgrad</th>
        </tr>
      </thead>
      <tbody>
        {#each words as word, index (word.word)}
          <tr>
            <td>{index + 1}</td>
            <td>{word.word}</td>
            <td>{(word.similarity * 100).toFixed(2)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:catch error}
    <p class="error">{message(error)}</p>
  {/await}
</div>

<style>
  #top1000 {
    display: grid;
    gap: 1rem;
  }

  table {
    border-collapse: collapse;
  }

  td,
  th {
    padding: 0.5rem 1rem;
    text-align: left;
  }

  th {
    border-bottom: 2px solid white;
  }

  tbody tr:nth-child(even) {
    background-color: #1c1c1c;
  }
</style>
