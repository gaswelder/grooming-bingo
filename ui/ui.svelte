<script>
  import Chat from "./chat/chat.svelte";
  import Tickets from "./tickets/tickets.svelte";
  import Banner from "./banner.svelte";

  export let grooming;

  let online = false;

  grooming.onConnectionChange(function(newOnline) {
    online = newOnline;
  });
</script>

<div class="ticketsRoot">
  <Tickets {grooming} />
</div>
<div class="chatRoot">
  <Chat {grooming} />
</div>
<Banner {online} />
