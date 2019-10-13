<script>
  import Form from "./form.svelte";
  import Message from "./message.svelte";
  import Users from "../users.svelte";
  import { afterUpdate } from "svelte";

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

  function submit(text) {
    grooming.sendChatMessage(text);
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
    flex: 1;
    overflow-y: scroll;
  }
</style>

<div>
  <Users {users} />
  <div bind:this={messagesContainer}>
    {#each messages as message}
      <Message {message} />
    {/each}
  </div>
  <Form onSubmit={submit} />
</div>
