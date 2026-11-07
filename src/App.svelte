<script lang="ts">
  import Header from "./components/Header.svelte";
  import Game from "./components/Game.svelte";
  import Top1000 from "./components/Top1000.svelte";
  import Faq from "./components/Faq.svelte";
  import Footer from "./components/Footer.svelte";
  import { route } from "./router.svelte";

  const apiRoot = import.meta.env.API_ROOT || "http://127.0.0.1:5000";
</script>

<svelte:head>
  <title>
    {route.topPuzzle === null
      ? "Normantle"
      : `De 1000 nærmeste ordene for #${route.topPuzzle} - Normantle`}
  </title>
</svelte:head>

<Header />
<main>
  {#if route.gameStarted}
    <div class="page" hidden={route.topPuzzle !== null}>
      <Game {apiRoot} />
      <Faq />
    </div>
  {/if}
  {#if route.topPuzzle !== null}
    <Top1000 {apiRoot} puzzle={route.topPuzzle} />
  {/if}
</main>
<Footer />

<style>
  .page {
    display: grid;
    gap: 2em;
  }

  .page[hidden] {
    display: none;
  }
</style>
