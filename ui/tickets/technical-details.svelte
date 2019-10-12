<script>
  import { onMount } from "svelte";
  export let ticket;

  let container;

  const specifications = [
    "it's very easy",
    "пропозаль",
    "папап",
    "I'm not sure",
    "it's a different card",
    "there's a card for that",
    "copypest",
    "exactly",
    "I have to look at the code",
    "makes sense",
    "does not make sense"
  ];

  onMount(() => {
    container.innerHTML = renderTechnicalDetails(ticket);
  });

  function renderTechnicalDetails(ticket) {
    return (
      `<div class="notes">
      <h4>Implementation notes</h4>` +
      specifications.map(advice => renderRow(ticket, advice)).join("") +
      "</div>"
    );
  }

  function renderRow(ticket, advice) {
    const count = ticket.advices[advice];
    return `<div class="advice-row ${count ? "active" : ""}">
  ${advice}
  ${renderChecks(count)}
  <button name="remove-advice" data-advice="${advice}" data-ticket-id="${
      ticket.id
    }">&minus;</button>
  <button name="add-advice" data-advice="${advice}" data-ticket-id="${
      ticket.id
    }">+</button>
  </div>`;
  }

  function renderChecks(count) {
    if (!count) {
      return "";
    }
    let s = "";
    const n = Math.ceil(count / 2);
    for (let i = 0; i < n; i++) {
      s += "+";
    }
    return s;
  }
</script>

<div class="notes" bind:this={container} />
