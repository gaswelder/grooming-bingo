import Banner from "./banner.svelte";

export default function initBanner(grooming) {
  const banner = new Banner({
    target: document.body,
    props: {
      online: false
    }
  });

  grooming.onConnectionChange(function(online) {
    banner.$set({ online });
  });
}
