// Change these two lines to your own details
const EMAIL = "you@example.com";
const HANDLE = "@yourdiscord";

// Duplicate the marquee images so the loop is seamless
const track = document.querySelector(".track");
if (track) [...track.children].forEach(el => track.appendChild(el.cloneNode(true)));

// Copy Discord handle
const copyBtn = document.getElementById("copy");
document.getElementById("handle").textContent = HANDLE;
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(HANDLE);
    copyBtn.textContent = "Copied";
  } catch (e) {
    copyBtn.textContent = "Press Ctrl+C to copy";
  }
  setTimeout(() => (copyBtn.textContent = "Copy handle"), 2000);
});

// Build an email from the brief form
document.getElementById("brief").addEventListener("submit", e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  const body = [
    "Channel: " + d.channel,
    "Contact: " + d.contact,
    "Upload date: " + (d.when || "not set"),
    "",
    d.idea || ""
  ].join("\n");
  location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("New thumbnail brief") + "&body=" + encodeURIComponent(body);
});
