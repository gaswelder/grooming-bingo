<script>
  export let value;

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
    font-size: 90%;
  }
</style>

<time>{formatTime(value)}</time>
