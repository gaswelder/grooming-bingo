<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let textarea;
  let interval;
  let typing = false;

  onMount(() => {
    return stop;
  });

  function start() {
    if (!typing) {
      typing = true;
      dispatch("typingstart");
    }
    clearTimeout(interval);
    interval = setTimeout(stop, 1000);
  }

  function stop() {
    if (typing) {
      typing = false;
      dispatch("typingstop");
    }
  }

  function onKeyPress(event) {
    // Send when Enter is pressed.
    // But on Shift-Enter just insert a line break.
    if (event.key == "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
      stop();
      return;
    }
    start();
  }

  function send() {
    const s = textarea.value.trim();
    textarea.value = "";
    if (s == "") {
      return;
    }
    dispatch("submit", s);
  }

  function toDataURL(file) {
    return new Promise(ok => {
      const reader = new FileReader();
      reader.onload = function(event) {
        ok(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  function getImageFile(event) {
    for (const item of event.clipboardData.items) {
      if (item.kind === "file") {
        return item.getAsFile();
      }
    }
    return null;
  }

  function onPaste(event) {
    const file = getImageFile(event);
    if (!file) {
      return;
    }
    event.preventDefault();
    const t = event.target;

    console.log(event.target.selectionStart, event);
    toDataURL(file).then(url => {
      const a = t.selectionStart;
      const b = t.selectionEnd;
      t.value =
        t.value.substring(0, a) +
        "{" +
        url +
        "}" +
        t.value.substring(b, t.value.length);
    });
  }
</script>

<style>
  textarea {
    width: 100%;
    height: 4em;
    font-family: inherit;
    font-size: inherit;
  }
</style>

<form on:submit|preventDefault={send}>
  <textarea
    bind:this={textarea}
    on:paste={onPaste}
    on:keypress={onKeyPress}
    on:blur={() => {
      dispatch('typingstop');
    }} />
  <button type="submit">Send (enter)</button>
</form>
