<script lang="ts">
	import Result from "./Result.svelte";
    import type { TodayInfoType } from "./types/TodayInfo";
    
    export let apiRoot: string;
    export let todayInfo: TodayInfoType;

    let hasGuessed = false;
    let hasCompleted = false;
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
                puzzleNumber: todayInfo.puzzleNumber
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
        // add 💡 to word
    }

    async function onSurrender() {
        const response = await fetch(`${apiRoot}/surrender?puzzle=${todayInfo.puzzleNumber}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (response.ok) {
            const guessResponse: GuessResult = await response.json();
            const guessResult = { ...guessResponse, guessNumber: guesses.length + 1 };
            guesses = [guessResult, ...guesses];
        } else {
            errorMessage = "Noe gikk galt! Prøv igjen senere";
        }
    }
</script>

<div id="guess">
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}

    <form class="guessForm" on:submit|preventDefault={onWordSubmit}>
        <input class="guessField" type="text" id="word" name="ord" placeholder="Gjett">
        <input class="submitButton guessButton" type="submit" value="Gjett">
    </form>

    <Result bind:guesses />

    {#if hasGuessed}
    <div id="hintSurrender">
        <form on:submit|preventDefault={onHintSubmit}>
            <input class="submitButton" type="submit" value="Hint">
        </form>
        <form on:submit|preventDefault={onSurrender}>
            <input class="submitButton" type="submit" value="Gi opp">
        </form>
    </div>
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
    .submitButton {
        background-color: #666666;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        padding: 0.5em;
    }
    .guessButton {
        flex: 1;
        font-size: 1.25rem;
    }
    .error {
        background-color: rgb(245, 110, 110);
        padding: 1em;
        border: red solid 2px;
        color: black;
    }
    #hintSurrender {
        display: flex;
        gap: .5rem;
    }
</style>
