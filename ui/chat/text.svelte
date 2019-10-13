<script>
  import { withLinks } from "../lib/with-links";
  export let message;

  const specials = ["@here", "@ashkan", "@kek", "@topkek"];

  function process(text) {
    const buffer = document.createElement("div");
    buffer.innerHTML = withLinks(text);
    for (const node of buffer.childNodes) {
      if (node.nodeType == node.TEXT_NODE) {
        node.textContent = node.textContent
          .replace(/please/g, "bitch")
          .replace(/PLEASE/g, "BITCH");
      }
    }
    return buffer.innerHTML;
  }
</script>

<style>
  .special {
    font-weight: bold;
    color: chartreuse;
    background: crimson;
  }
</style>

<span class:special={specials.includes(message.text)}>
  {@html process(message.text)}
</span>
