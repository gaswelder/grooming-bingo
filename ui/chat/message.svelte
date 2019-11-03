<script>
  import { withLinks } from "../lib/with-links";
  export let message;
  export let specials = ["@here"];

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
  time {
    color: gray;
    margin-right: 4px;
    font-size: 90%;
  }
  p :global(img) {
    max-width: 100%;
  }
  p span:first-of-type {
    color: gray;
  }
  p.special span:last-of-type {
    font-weight: bold;
    color: chartreuse;
    background: crimson;
  }
  p.system {
    color: gray;
  }
  p.system span:first-of-type {
    display: none;
  }
</style>

<p
  class:special={specials.includes(message.text)}
  class:system={message.author == null}>
  <time>{formatTime(message.timestamp)}</time>
  <span>{message.author}</span>
  <span>
    {@html process(message.text)}
  </span>
</p>
