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

<div id="guess">
    <form class="guessForm" on:submit|preventDefault={onWordSubmit}>
        <input class="guessField" type="text" id="word" name="ord">
        <input class="guessButton" type="submit" value="Gjett">
    </form>
    <Result />
    {#if hasGuessed}
    <form on:submit|preventDefault={onHintSubmit}>
        <input type="submit" value="Hint">
    </form>
    <form on:submit|preventDefault={onSurrender}>
        <input type="submit" value="Gi opp">
    </form>
    {/if}
</div>


<style>
    #guess {
        width: 100%;
        display: flex;
    }
    .guessForm {
        flex: 1;
    }
    .guessField {
        width: 85%;
    }
    .guessButton {
        width: 14%;
    }
</style>
