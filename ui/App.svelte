<script>
  export let answer;
  let count = 0;

  function handleClick() {
    count++;
  }
</script>

<style>
  button {
    margin-right: 100px;
  }
</style>

<button on:click={handleClick}>
  ({answer}) Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
