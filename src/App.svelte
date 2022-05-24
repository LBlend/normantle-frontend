<script lang="ts">
	import Header from "./Header.svelte";
	import TodayInfo from "./TodayInfo.svelte";
	import Guess from "./Guess.svelte";
	import Faq from "./Faq.svelte";
	import Footer from './Footer.svelte';
</script>

<Header />
<main>
	<TodayInfo />
	<Guess />
	<Faq />
</main>
<Footer />

<style>
	main {
		display: grid;
		gap: 2em;
	}
</style>
