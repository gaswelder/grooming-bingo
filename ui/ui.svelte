<script>
  import Chat from "./chat/chat.svelte";
  import Tickets from "./tickets/tickets.svelte";
  import Banner from "./banner.svelte";

  export let grooming;

  let online = false;

  grooming.onConnectionChange(function(newOnline) {
    online = newOnline;
  });

  let state = null;
  grooming.onLoad(data => {
    state = data;
  });
  grooming.onChange(data => {
    state = data;
  });
</script>

<div class="ticketsRoot">
  <Tickets {grooming} />
  <pre>{JSON.stringify(state, null, '  ')}</pre>
</div>
<div class="chatRoot">
  <Chat {grooming} />
</div>
<Banner {online} />
