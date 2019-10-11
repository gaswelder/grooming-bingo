<script>
  import Text from "./text.svelte";
  export let message;

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
</script>

<p>
  <time>{formatTime(message.timestamp)}</time>
  {message.author}:
  <Text {message} />
</p>
