<script>
  export let onVote;
  export let ticket;

  const scores = [1, 2, 3, 5, 8, 13].reverse();

  const votes = score =>
    ticket.votes
      .filter(vote => vote.score == score)
      .map(vote => vote.author)
      .join(", ");
</script>

<div class="votes">
  <h4>Votes</h4>

  {#each scores as score}
    <div>
      <button
        class="score"
        data-ticket-id={ticket.id}
        data-score={score}
        type="button">
        {score}
      </button>
      {votes(score)}
    </div>
  {/each}

</div>
