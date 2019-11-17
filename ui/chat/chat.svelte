<script>
  import Form from "./form.svelte";
  import Message from "./message.svelte";
  import Typing from "./typing.svelte";
  import Users from "../users.svelte";
  import { afterUpdate, onMount } from "svelte";

  export let grooming;

  let users = [];
  let messages = [];
  let messagesContainer;

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

  grooming.onLoad(state => {
    users = state.users;
    messages = state.chat;
  });

  afterUpdate(() => {
    messagesContainer.scrollBy(0, 1e6);
  });

  function submit(event) {
    grooming.sendChatMessage(event.detail);
  }
  function startTyping() {
    grooming.startTyping();
  }
  function stopTyping() {
    grooming.stopTyping();
  }
</script>

<style>
  div {
    display: flex;
    flex-direction: column;
    border-left: dashed 1px gray;
    height: 100%;
    padding: 0 10px;
  }
  div > div {
    display: block;
    border: none;
    width: auto;
    height: auto;
    padding: 0;
    overflow-y: scroll;
    flex: 1;
  }
</style>

<div>
  <Users {users} />
  <div bind:this={messagesContainer}>
    {#each messages as message}
      <Message specials={grooming.specialMessages} {message} />
    {/each}
  </div>
  <Typing {users} currentUser={grooming.username} />
  <Form
    on:submit={submit}
    on:typingstart={startTyping}
    on:typingstop={stopTyping} />
</div>
