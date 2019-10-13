<script>
  import Form from "./form.svelte";
  import Messages from "./messages.svelte";
  import Users from "../users.svelte";
  import { onMount } from "svelte";

  export let grooming;

  let users = [];
  let messages = [];

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

  function submit(text) {
    grooming.sendChatMessage(text);
  }
</script>

<style>
  .root {
    display: flex;
    flex-direction: column;
    border-left: dashed 1px gray;
    height: 100%;
    width: 300px;
    padding: 0 10px;
  }
</style>

<div class="root">
  <Users {users} />
  <Messages {messages} />
  <Form onSubmit={submit} />
</div>
