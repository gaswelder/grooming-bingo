<script>
  import { withLinks } from "../lib/with-links";
  export let message;
  export let specials = ["@here"];

  function process(text) {
    const buffer = document.createElement("div");
    buffer.innerHTML = withLinks(withImages(text));
    for (const node of buffer.childNodes) {
      if (node.nodeType == node.TEXT_NODE) {
        node.textContent = node.textContent
          .replace(/please/g, "bitch")
          .replace(/PLEASE/g, "BITCH");
      }
    }
    return buffer.innerHTML;
  }

  function withImages(text) {
    for (const m of text.matchAll(/\{(data:image\/\w+;base64,.+)\}/)) {
      const url = m[1];
      text = text.replace(m[0], `<img src="${url}">`);
    }
    return text;
  }
</script>

<style>
  .special {
    font-weight: bold;
    color: chartreuse;
    background: crimson;
  }

  span :global(img) {
    max-width: 100%;
  }
</style>

<span class:special={specials.includes(message.text)}>
  {@html process(message.text)}
</span>
