<script>
  export let onVote;
  export let ticket;
  import User from "../user.svelte";

  const scores = [1, 2, 3, 5, 8, 13].reverse();
  const voters = (ticket, score) =>
    ticket.votes.filter(vote => vote.score == score);
</script>

<style>
  button.score {
    border-radius: 3px;
    border: none;
    width: 32px;
    height: 32px;
    margin-bottom: 2px;
    padding: 0;
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

{#each scores as score}
  <div>
    <button
      class="score"
      data-score={score}
      on:click={() => onVote(score)}
      type="button">
      {score}
    </button>
    {#each voters(ticket, score) as voter, i}
      <User user={{ name: voter.author }} />
    {/each}
  </div>
{/each}
