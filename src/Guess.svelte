<script lang="ts">
	import Result from "./Result.svelte";

    let hasGuessed = false;

    let puzzleNumber = 0; // TODO
    
    async function onWordSubmit(e) {
        const form = new FormData(e.target);
        const word = form.get("word");

        if (word === "") {
            return;
        }

        const response = await fetch("/guess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                guess: word,
                puzzleNumber: puzzleNumber
            })
        });

        if (response.ok) {
            const data = await response.json();
            const { word, similarity, isClose } = data;  // TODO: make type

            // TODO: update state. render result component
        } else {
            // TODO: show error message
        }
    }

    async function onHintSubmit() {
        // TODO
    }

    async function onSurrender() {
        // TODO
    }
</script>

<div>
    <form on:submit|preventDefault={onWordSubmit}>
        <input type="text" id="word" name="ord">
        <input type="submit" value="Gjett">
    </form>
    <Result />
    <form on:submit|preventDefault={onHintSubmit}>
        <input type="submit" value="Hint">
    </form>
    {#if hasGuessed}
    <form on:submit|preventDefault={onSurrender}>
        <input type="submit" value="Gi opp">
    </form>
    {/if}
</div>


<style>

</style>
