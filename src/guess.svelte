<script lang="ts">
	import Result from "./Result.svelte";
    
    //let apiRoot = "https://normantle-api.lblend.moe";  // TODO: move to .env
    let apiRoot = "http://127.0.0.1:8000";  // TODO: move to .env

    let hasGuessed = false;
    let puzzleNumber = 420;

    let guesses = [];
    let errorMessage = "";

    interface GuessResult {
        word: string;
        similarity: number;
        isClose: boolean;
        isCorrect: boolean;
    }
    
    async function onWordSubmit(e) {
        errorMessage = "";

        const word = e.target.word.value;
        e.target.word.value = '';

        if (word === "") {
            return;
        }
        if (word in guesses) {
            errorMessage = "Du har allerede gjettet dette ordet!";
        }

        const response = await fetch(`${apiRoot}/guess`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                word: word,
                puzzleNumber: puzzleNumber
            })
        });

        if (response.ok) {
            const guessResponse: GuessResult = await response.json();
            console.log("OK!", guessResponse);
            hasGuessed = true;
            const guessResult = { ...guessResponse, guessNumber: guesses.length + 1 };
            guesses = [guessResult, ...guesses];
        } else {
            console.log("NOT OK!", response);
            errorMessage = "Noe gikk galt! Prøv igjen senere";
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
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}

    <form class="guessForm" on:submit|preventDefault={onWordSubmit}>
        <input class="guessField" type="text" id="word" name="ord" placeholder="Gjett">
        <input class="guessButton" type="submit" value="Gjett">
    </form>

    <Result bind:guesses />

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
        display: grid;
        gap: 1rem;
    }
    .guessForm {
        width: 100%;
        display: flex;
    }
    .guessField {
        font-size: 1.5rem;
        width: 85%;
    }
    .guessButton {
        flex: 1;
        font-size: 1.25rem;
        background-color: #666666;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        padding: 0.5eem;
    }
    .error {
        background-color: rgb(245, 110, 110);
        padding: 1em;
        border: red solid 2px;
        color: black;
    }
</style>
