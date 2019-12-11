<script>
  import Time from "./time.svelte";
  export let text, timestamp;
</script>

<style>
  article {
    color: gray;
  }
  span {
    font-style: italic;
  }
</style>

<article>
  <Time value={timestamp} />
  <span>{text}</span>
</article>
