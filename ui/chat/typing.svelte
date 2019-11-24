<script>
  export let users;
  export let currentUser;

  $: typingUsers = users.filter(
    user => user.typing && user.name != currentUser
  );
</script>

<style>
  p {
    font-style: italic;
  }
</style>

<p>
  {#if typingUsers.length > 2}
    @{typingUsers[0].name}, @{typingUsers[1].name} and {typingUsers.length - 2}
    more are typing...
  {:else if typingUsers.length > 1}
    @{typingUsers[0].name} and @{typingUsers[1].name} are typing...
  {:else if typingUsers.length == 1}
    @{typingUsers[0].name} is typing...
  {:else}&nbsp;{/if}
</p>
