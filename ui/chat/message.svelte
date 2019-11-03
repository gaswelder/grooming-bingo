<script>
  import Text from "./text.svelte";
  export let message;
  export let specials;

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

<style>
  time {
    color: gray;
    margin-right: 4px;
    font-size: 90%;
  }
  span {
    color: gray;
  }
</style>

<p>
  <time>{formatTime(message.timestamp)}</time>
  <span>{message.author}</span>
  <Text {specials} {message} />
</p>
