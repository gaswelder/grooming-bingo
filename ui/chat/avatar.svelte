<script>
  export let user;

  const colors = [
    "cadetblue",
    "brown",
    "cornflowerblue",
    "darkcyan",
    "dodgerblue"
  ];
  const hash = str =>
    [...str].map(x => x.charCodeAt(0)).reduce((a, b) => (a * 113 + b) % 227, 0);
  const userColor = user => colors[hash(user) % colors.length];
  const userStamp = user => (user[0] + user[user.length - 1]).toUpperCase();
</script>

<style>
  div {
    width: 36px;
    height: 36px;
    border-radius: 2px;
    background-color: gray;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
  }
</style>

<div style="background-color: {userColor(user)}">{userStamp(user)}</div>
