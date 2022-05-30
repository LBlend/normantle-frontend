<script lang="ts">
	import Result from "./Result.svelte";

    // Types
    import type { GuessResult } from "./types/GuessResult";
    import type { TodayInfoType } from "./types/TodayInfo";

    
    export let apiRoot: string;
    export let todayInfo: TodayInfoType;

    let hasGuessed = false;
    let hasCompleted = false;

    let guesses = [];
    let errorMessage = "";

    function addGuess(guess: GuessResult) {
        const guessResult = { ...guess, guessNumber: guesses.length + 1 }
        guesses = [guessResult, ...guesses];
        guesses = guesses.sort((a, b) => b.similarity - a.similarity);
    }

    async function onWordSubmit(e) {
        errorMessage = "";

        const word = e.target.word.value.toLowerCase();
        e.target.word.value = '';

        if (word === "") {
            return;
        }
        if (guesses.map(guess => guess.word).includes(word)) {
            errorMessage = "Du har allerede gjettet dette ordet!";
            return
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
            addGuess(guessResponse);

            if (guessResponse.isCorrect) {
                hasCompleted = true;
            }
        } else {
            console.log("NOT OK!", response);
            if (response.status === 404) {
                errorMessage = "Ordet finnes ikke/er fjernet fra ordlisten";
            } else {
                errorMessage = "Noe gikk galt! Prøv igjen senere";
            }
        }
    }

    async function onHintSubmit() {
        const response = await fetch(`${apiRoot}/hint`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                puzzleNumber: todayInfo.puzzleNumber,
                bestGuess: guesses[0].word.split(" ")[0]
            })
        });

        if (response.ok) {
            let hintResponse = await response.json();
            hintResponse.word = `${hintResponse.word} 💡`;
            console.log("OK!", hintResponse);
            addGuess(hintResponse);

            if (hintResponse.isCorrect) {
                hasCompleted = true;
            }
        } else {
            console.log("NOT OK!", response);
            errorMessage = "Noe gikk galt! Prøv igjen senere";
        }
    }

    async function onSurrender() {
        const response = await fetch(`${apiRoot}/surrender?puzzle=${todayInfo.puzzleNumber}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (response.ok) {
            let surrenderResponse: GuessResult = await response.json();
            surrenderResponse.word = `${surrenderResponse.word} 🏳️🇫🇷`;
            addGuess(surrenderResponse);
            hasCompleted = true;
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

    {#if hasGuessed && !hasCompleted}
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
        gap: .5rem;
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
