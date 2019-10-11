<script>
  export let onSubmit;

  let textarea;

  function submit(event) {
    event.preventDefault();
    send();
  }

  function keypress(event) {
    if (event.key != "Enter" || event.ctrlKey) {
      return;
    }
    event.preventDefault();
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
  <textarea on:keypress={keypress} bind:this={textarea} />
  <button type="submit">Send (enter)</button>
</form>
