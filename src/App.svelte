<script lang="ts">
  import Header from "./components/Header.svelte";
  import TodayInfo from "./components/TodayInfo.svelte";
  import Guess from "./components/Guess.svelte";
  import Faq from "./components/Faq.svelte";
  import Footer from "./components/Footer.svelte";


  let apiRoot = process.env.API_ROOT || "http://127.0.0.1:5000";

  let todayInfo = {
    puzzleNumber: 0,
    similarity: 0,
    similarityTenth: 0,
    similarityThousandth: 0,
  };
  fetch(`${apiRoot}/today`)
    .then((response) => response.json())
    .then((data) => {
      todayInfo = data;
    });
</script>

<Header />
<main>
  <TodayInfo bind:todayInfo />
  <Guess bind:todayInfo bind:apiRoot />
  <Faq />
</main>
<Footer />

<style>
  main {
    display: grid;
    gap: 2em;
  }
</style>
