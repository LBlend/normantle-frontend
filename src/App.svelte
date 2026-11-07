<script lang="ts">
  import Header from "./components/Header.svelte";
  import TodayInfo from "./components/TodayInfo.svelte";
  import Guess from "./components/Guess.svelte";
  import Faq from "./components/Faq.svelte";
  import Footer from "./components/Footer.svelte";
  import { describeError, request } from "./api";
  import type { TodayInfoType } from "./types/TodayInfo";

  const apiRoot = import.meta.env.API_ROOT || "http://127.0.0.1:5000";

  const today = request<TodayInfoType>(apiRoot, "/today");
</script>

<Header />
<main>
  {#await today}
    <p>Henter dagens ord…</p>
  {:then todayInfo}
    <TodayInfo {todayInfo} />
    <Guess {todayInfo} {apiRoot} />
  {:catch error}
    <p class="error">{describeError(error)}</p>
  {/await}
  <Faq />
</main>
<Footer />

<style>
  main {
    display: grid;
    gap: 2em;
  }
</style>
