<script>
  import { onMount } from "svelte";

  export let onSubmit;
  export let startTyping;
  export let stopTyping;

  let textarea;
  let interval;

  onMount(() => {
		return () => {
      if (interval) clearInterval(interval);
    };
	});

  function submit(event) {
    event.preventDefault();
    send();
  }

  function stop() {
    stopTyping()
  }

  function keypress(event) {
    if (event.key != "Enter" || event.ctrlKey) {
      if (interval) clearInterval(interval);
      startTyping()
      interval = setInterval(() => stop(), 3000);
      return;
    }
    event.preventDefault();
    stop();
    if (interval) clearInterval(interval);
    send();
  }

  function send() {
    const s = textarea.value.trim();
    textarea.value = "";
    if (s == "") {
      return;
    }
    onSubmit(s);
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

<form on:submit={submit}>
  <textarea on:keypress={keypress} bind:this={textarea} on:paste={onPaste} on:blur={stop} />
  <button type="submit">Send (enter)</button>
</form>
