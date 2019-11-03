<script>
  import Chat from "./chat/chat.svelte";
  import Tickets from "./tickets/tickets.svelte";
  import Banner from "./banner.svelte";

  export let grooming;

  let online = false;

  grooming.onConnectionChange(function(newOnline) {
    online = newOnline;
  });

  let background = "none";
  grooming.onChange(state => {
    background = state.map;
  });
</script>

<style>
  div.ticketsRoot {
    overflow-y: scroll;
    flex: 1;
  }
</style>

<div
  class="ticketsRoot"
  style="background-image: url({background}); background-size: cover">
  <Tickets {grooming} />
</div>
<div>
  <Chat {grooming} />
</div>
<Banner {online} />
