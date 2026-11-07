<script lang="ts">
  import TodayInfo from "./TodayInfo.svelte";
  import Guess from "./Guess.svelte";
  import { describeError, request } from "../api";
  import type { TodayInfoType } from "../types/TodayInfo";

  let { apiRoot }: { apiRoot: string } = $props();

  const today = $derived(request<TodayInfoType>(apiRoot, "/today"));
</script>

{#await today}
  <p>Henter dagens ord…</p>
{:then todayInfo}
  <TodayInfo {todayInfo} />
  <Guess {todayInfo} {apiRoot} />
{:catch error}
  <p class="error">{describeError(error)}</p>
{/await}
