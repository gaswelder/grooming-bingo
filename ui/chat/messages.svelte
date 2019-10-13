<script>
  import Text from "./text.svelte";
  import { afterUpdate } from "svelte";

  export let messages;
  let div;

  afterUpdate(() => {
    div.scrollBy(0, 1e6);
  });

  function formatTime(timestamp) {
    const d = new Date(timestamp);
    return [
      d
        .getHours()
        .toString()
        .padStart(2, "0"),
      d
        .getMinutes()
        .toString()
        .padStart(2, "0")
    ].join(":");
  }
</script>

<style>
  div {
    flex: 1;
    overflow-y: scroll;
  }
  time {
    color: gray;
    margin-right: 4px;
    font-size: 90%;
  }
</style>

<div bind:this={div}>
  {#each messages as message}
    <p>
      <time>{formatTime(message.timestamp)}</time>
      {message.author}:
      <Text {message} />
    </p>
  {/each}
</div>
