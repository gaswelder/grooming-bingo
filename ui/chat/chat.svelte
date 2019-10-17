<script>
  import Form from "./form.svelte";
  import Message from "./message.svelte";
  import Users from "../users.svelte";
  import { afterUpdate, onMount } from "svelte";

  export let grooming;

  let users = [];
  let messages = [];
  let typing = [];
  let messagesContainer;
  let string;
  let interval;

  onMount(() => {
		return () => {
      if (interval) clearInterval(interval);
    };
	});

  grooming.onChange(
    state => {
      messages = state.chat;
    },
    [["chat"]]
  );

  grooming.onChange(
    state => {
      users = state.users;
    },
    [["users"]]
  );

  grooming.onChange(
    (state, val) => {
      typing = state.typing.filter(u => u !== grooming.username);
    },
    [["typing"]]
  );

  grooming.onLoad(state => {
    users = state.users;
    messages = state.chat;
    typing = state.typing.filter(u => u !== name);
  });

  afterUpdate(() => {
    messagesContainer.scrollBy(0, 1e6);
  });

  function submit(text) {
    grooming.sendChatMessage(text);
  }
  function startTyping() {
    if (interval) clearInterval(interval);
    grooming.startTyping()
    interval = setInterval(() => {
			grooming.stopTyping()
		}, 3000);
  }
  function stopTyping() {
    grooming.stopTyping()
    if (interval) clearInterval(interval);
  }
</script>

<style>
  
  div {
    display: flex;
    flex-direction: column;
    border-left: dashed 1px gray;
    height: 100%;
    width: 300px;
    padding: 0 10px;
  }
  div > div {
    display: block;
    border: none;
    width: auto;
    height: auto;
    padding: 0;
    overflow-y: scroll;
  }

  .messages {
    flex: 1;
  }

  .typing {
    font-style: italic;
    position:relative;
  }
  
</style>

<div>
  <Users {users} />
  <div class="messages" bind:this={messagesContainer}>
    {#each messages as message}
      <Message {message} />
    {/each}
  </div>
  <div class="typing">
    {#each typing as type}
      <p>@{type} is typing...</p>
    {/each}
  </div>
  <Form onSubmit={submit} startTyping={startTyping} stopTyping={stopTyping} />
</div>
