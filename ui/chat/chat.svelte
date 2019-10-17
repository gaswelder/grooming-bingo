<script>
  import Form from "./form.svelte";
  import Message from "./message.svelte";
  import Typing from "./typing.svelte";
  import Users from "../users.svelte";
  import { afterUpdate } from "svelte";

  export let grooming;

  let users = [];
  let messages = [];
  let messagesContainer;
  let typing = []

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
    grooming.startTyping()
  }
  function stopTyping() {
    grooming.stopTyping()
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
    flex: 1;
  }
  
</style>

<div>
  <Users {users} />
  <div bind:this={messagesContainer}>
    {#each messages as message}
      <Message {message} />
    {/each}
  </div>
  <Typing typing={typing} />
  <Form onSubmit={submit} startTyping={startTyping} stopTyping={stopTyping} />
</div>
