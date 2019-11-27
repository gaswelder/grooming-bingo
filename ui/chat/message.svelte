<script>
  import { withLinks } from "../lib/with-links";
  import { markdown } from "../lib/markdown";

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

  const memeImages = {
    "jackiechan.jpg":
      "https://memeshappen.com/media/templates/jackie_chan_wtf.jpg",
    "genius.jpg":
      "https://i.kym-cdn.com/photos/images/newsfeed/000/471/542/069.jpg"
  };
  const memeImage = text => memeImages[text] || text;

  function process(text) {
    const buffer = document.createElement("div");
    buffer.innerHTML = withLinks(withImages(memeImage(markdown(text))));
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
  div :global(img) {
    max-width: 100%;
    vertical-align: top;
  }
  div :global(code) {
    background: white;
  }
  div span:first-of-type {
    color: gray;
  }
  div.special span:last-of-type {
    font-weight: bold;
    color: chartreuse;
    background: crimson;
  }
  div.system {
    color: gray;
  }
  div.system span:first-of-type {
    display: none;
  }
  div > div {
    float: left;
    margin-right: 0.5em;
  }
</style>

<div
  class:special={specials.includes(message.text)}
  class:system={message.author == null}>
  <div>
    <time>{formatTime(message.timestamp)}</time>
    <span>{message.author}</span>
  </div>
  <p>
    {@html process(message.text)}
    {#if message.edited}
      <small>(edited)</small>
    {/if}
  </p>
</div>
