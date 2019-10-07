export default function initBanner(grooming) {
  grooming.onConnectionChange(function(online) {
    if (online) {
      hideBanner();
    } else {
      showBanner();
    }
  });

  const banner = document.createElement("div");
  banner.innerText = "Socket closed, reconnecting";
  banner.class = "banner";
  document.body.appendChild(banner);
  Object.assign(banner.style, {
    position: "fixed",
    left: "50%",
    top: "50%",
    background: "crimson",
    color: "white",
    padding: "1em",
    borderRadius: "8px",
    display: "none"
  });

  function showBanner() {
    banner.style.display = "block";
  }
  function hideBanner() {
    banner.style.display = "none";
  }
}
