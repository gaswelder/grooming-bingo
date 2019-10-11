<script>
  import Message from "./message.svelte";
  import { afterUpdate } from "svelte";

  export let messages;
  let div;

  afterUpdate(() => {
    div.scrollBy(0, 1e6);
  });
</script>

<style>
  div {
    flex: 1;
    overflow-y: scroll;
  }
</style>

<div bind:this={div}>
  {#each messages as message}
    <Message {message} />
  {/each}
</div>
