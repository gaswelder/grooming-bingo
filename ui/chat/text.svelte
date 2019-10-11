<script>
  import { withLinks } from "../lib/with-links";
  export let message;

  const specials = ["@here", "@ashkan", "@kek", "@topkek"];
</script>

<style>
  .special {
    font-weight: bold;
    color: chartreuse;
    background: crimson;
  }
</style>

<span class:special={specials.includes(message.text)}>
  {@html withLinks(message.text)}
</span>
