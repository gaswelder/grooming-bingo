<script>
  import marked from "marked";
  import Time from "./time.svelte";
  import Avatar from "./avatar.svelte";
  import { onMount } from "svelte";

  export let message;
  export let specials = ["@here"];

  let images = [];

  const hrefIsImage = href =>
    new Promise(ok => {
      const img = document.createElement("img");
      img.onload = () => ok(true);
      img.onerror = () => ok(false);
      img.src = href;
    });

  $: renderer = new marked.Renderer();
  $: renderer.link = (href, title, text) => {
    if (images.includes(href)) {
      return `<a target="_blank" href="${href}"><img src="${href}"></a>`;
    }
    return `<a target="_blank" href="${href}">${title || text}</a>`;
  };

  $: content = marked(message.text, { renderer });

  let container;
  onMount(async () => {
    const links = container.querySelectorAll("a[href]");
    links.forEach(async a => {
      if (await hrefIsImage(a.href)) {
        images = [...images, a.href];
      }
    });
  });
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
  <div class="content" bind:this={container}>
    {@html content}
  </div>
</article>
