<script>
  import { createEventDispatcher } from "svelte";
  export let onStart, onStop, onMove;
  const dispatch = createEventDispatcher();

  let dragOrigin = null;

  const startDragging = e => {
    dragOrigin = [e.pageX, e.pageY];
    dispatch("start");
  };

  const stopDragging = e => {
    if (dragOrigin) {
      dragOrigin = null;
      dispatch("stop");
    }
  };

  const drag = e => {
    if (dragOrigin) {
      const pos = [e.pageX, e.pageY];
      const offset = [e.pageX - dragOrigin[0], e.pageY - dragOrigin[0]];
      dispatch("move", { offset });
    }
  };
</script>

<svelte:body on:mouseup={stopDragging} on:mousemove={drag} />
<div
  on:selectstart={e => e.preventDefault()}
  on:mousedown={startDragging}
  style="height: 100%">
  <slot />
</div>
