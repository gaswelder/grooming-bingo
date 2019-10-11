<script>
  import Message from "./message.svelte";
  export let messages;
</script>

{#each messages as message}
  <Message {message} />
{/each}
