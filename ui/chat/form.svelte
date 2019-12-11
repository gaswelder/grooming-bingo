<script>
  import { onMount, createEventDispatcher } from "svelte";

  export let lastMessage;

  const dispatch = createEventDispatcher();

  let interval;
  let typing = false;

  let draft = "";
  let editing = false;

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
    const s = draft.trim();
    const e = editing;
    draft = "";
    editing = false;
    if (s == "") {
      return;
    }
    if (e) {
      dispatch("edit", s);
    } else {
      dispatch("submit", s);
    }
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

    toDataURL(file).then(url => {
      const a = t.selectionStart;
      const b = t.selectionEnd;
      t.value =
        t.value.substring(0, a) +
        `<img src="${url}">` +
        t.value.substring(b, t.value.length);
      draft = t.value;
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
  {#if editing}
    <small>editing (esc to cancel)</small>
  {/if}
  <textarea
    bind:value={draft}
    on:keyup={e => {
      if (!editing && e.key == 'ArrowUp' && draft == '' && lastMessage) {
        editing = true;
        draft = lastMessage.text;
      }
      if (editing && e.key == 'Escape') {
        editing = false;
        draft = '';
      }
    }}
    on:paste={onPaste}
    on:keypress={onKeyPress}
    on:blur={() => {
      dispatch('typingstop');
    }} />
  <button type="submit">Send (enter)</button>
</form>
