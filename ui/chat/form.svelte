<script>
  export let onSubmit;

  function submit(event) {
    event.preventDefault();
    const textarea = event.target.querySelector("textarea");
    onSubmit(textarea.value);
    textarea.value = "";
  }

  function keypress(event) {
    if (event.key != "Enter" || event.ctrlKey) {
      return;
    }
    event.preventDefault();
    const textarea = event.target;
    onSubmit(textarea.value);
    textarea.value = "";
  }
</script>

<form on:submit={submit}>
  <textarea on:keypress={keypress} />
  <button type="submit">Send (enter)</button>
</form>
