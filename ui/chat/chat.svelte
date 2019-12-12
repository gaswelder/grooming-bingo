<script>
  import Form from "./form.svelte";
  import Message from "./message.svelte";
  import Log from "./log.svelte";
  import Typing from "./typing.svelte";
  import User from "../user.svelte";
  import { afterUpdate, onMount } from "svelte";

  export let grooming;

  let users = [];
  let messages = [];
  let messagesContainer;
  let lastMessage;

  grooming.onChange(state => {
    messages = state.chat;
    users = state.users;
    lastMessage = grooming.lastChatMessage();
  });

  grooming.onLoad(state => {
    users = state.users;
    messages = state.chat;
  });

  afterUpdate(() => {
    messagesContainer.scrollBy(0, 1e6);
  });
</script>

<style>
  div.root {
    display: flex;
    flex-direction: column;
    border-left: dashed 1px gray;
    height: 100%;
    padding: 0 10px;
  }
  div.messages {
    display: block;
    border: none;
    width: auto;
    height: auto;
    padding: 0;
    overflow-y: scroll;
    flex: 1;
  }
</style>

<div class="root">
  <div>
    {#each users as user}
      <User {user} />
    {/each}
  </div>
  <div class="messages" bind:this={messagesContainer}>
    {#each messages as message}
      {#if message.author == null}
        <Log timestamp={message.timestamp} text={message.text} />
      {:else}
        <Message specials={grooming.specialMessages} {message} />
      {/if}
    {/each}
  </div>
  <Typing {users} currentUser={grooming.username} />
  <Form
    {lastMessage}
    on:submit={e => {
      grooming.sendChatMessage(e.detail);
    }}
    on:edit={e => {
      grooming.editChatMessage(e.detail);
    }}
    on:typingstart={() => {
      grooming.startTyping();
    }}
    on:typingstop={() => {
      grooming.stopTyping();
    }} />
</div>
