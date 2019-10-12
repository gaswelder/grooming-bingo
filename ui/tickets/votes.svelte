<script>
  export let onVote;
  export let ticket;

  const scores = [1, 2, 3, 5, 8, 13].reverse();

  $: votes = score =>
    ticket.votes
      .filter(vote => vote.score == score)
      .map(vote => vote.author)
      .join(", ");
</script>

<style>
  button.score {
    border-radius: 3px;
    border: none;
    width: 32px;
    height: 32px;
    margin-bottom: 2px;
  }
  [data-score="1"] {
    background-color: #d7f7fa;
  }
  [data-score="2"] {
    background-color: #d7faef;
  }
  [data-score="3"] {
    background-color: #e0fad7;
  }
  [data-score="5"] {
    background-color: antiquewhite;
  }
  [data-score="8"] {
    background-color: #fad7d7;
  }
  [data-score="13"] {
    background-color: #ffcccc;
  }
</style>

<div class="votes">
  <h4>Votes</h4>

  {#each scores as score}
    <div>
      <button
        class="score"
        data-score={score}
        on:click={() => onVote(score)}
        type="button">
        {score}
      </button>
      {votes(score)}
    </div>
  {/each}

</div>
