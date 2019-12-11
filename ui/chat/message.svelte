<script>
  import marked from "marked";
  import Time from "./time.svelte";
  import Avatar from "./avatar.svelte";

  export let message;
  export let specials = ["@here"];

  const memeImages = {
    "jackiechan.jpg":
      "https://memeshappen.com/media/templates/jackie_chan_wtf.jpg",
    "genius.jpg":
      "https://i.kym-cdn.com/photos/images/newsfeed/000/471/542/069.jpg"
  };
  const memeImage = text => memeImages[text] || text;

  function process(text) {
    const buffer = document.createElement("div");
    buffer.innerHTML = withImages(memeImage(marked(text)));
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
  article {
    margin: 1em 0;
    position: relative;
  }
  article > :global(:first-child) {
    position: absolute;
  }
  article > :not(:first-child) {
    margin-left: 40px;
  }
  article .header > span {
    font-weight: bold;
    margin-right: 0.3em;
  }
  article .content :global(img) {
    max-width: 100%;
    vertical-align: top;
  }
  article .content :global(code) {
    background: white;
  }
  article .content :global(pre) {
    background: white;
    padding: 0.5em;
    border-radius: 2px;
  }
  article .content > :global(:first-child) {
    margin-top: 0;
  }
  article.special .content {
    font-weight: bold;
    color: chartreuse;
    background: crimson;
  }
</style>

<article class:special={specials.includes(message.text)}>
  <Avatar user={message.author} />
  <div class="header">
    <span>{message.author}</span>
    <Time value={message.timestamp} />
    {#if message.edited}
      <small>(edited)</small>
    {/if}
  </div>
  <div class="content">
    {@html process(message.text)}
  </div>
</article>
