<script>
  import Chat from "./chat/chat.svelte";
  import Tickets from "./tickets/tickets.svelte";
  import Banner from "./banner.svelte";
  import Draggable from "./lib/draggable.svelte";

  export let grooming;

  let online = false;

  grooming.onConnectionChange(function(newOnline) {
    online = newOnline;
  });

  let background = "none";
  grooming.onChange(state => {
    background = state.map;
  });

  let width = Number(localStorage.getItem("chatWidth")) || 400;
  let originalWidth;

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const onStart = () => {
    originalWidth = width;
  };

  const onMove = e => {
    const diff = e.detail.offset;
    width = clamp(originalWidth - diff[0], 300, 800);
  };

  const onStop = () => {
    originalWidth = undefined;
    localStorage.setItem("chatWidth", width);
  };
</script>

<style>
  div.ticketsRoot {
    overflow-y: scroll;
    flex: 1;
  }
  div.chatContainer {
    position: relative;
  }
  div.chatContainer > .handle {
    position: absolute;
    left: -5px;
    top: 0;
    bottom: 0;
    width: 10px;
    cursor: ew-resize;
  }
  div.chatContainer > .handle:hover {
    background: rgba(100, 100, 100, 0.1);
  }
</style>

<div
  class="ticketsRoot"
  style="background-image: url({background}); background-size: cover">
  <Tickets {grooming} />
</div>
<div class="chatContainer" style="width: {width}px">
  <div class="handle">
    <Draggable on:move={onMove} on:start={onStart} on:stop={onStop} />
  </div>
  <Chat {grooming} />
</div>
<Banner {online} />
