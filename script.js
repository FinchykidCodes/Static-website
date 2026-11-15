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

// Live YouTube subscriber counts (see "data-handle" attributes in index.html)
const YT_KEY = "PASTE_YOUR_KEY_HERE";
const fmt = n => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(n);

async function getSubs(handle) {
  const url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=" +
    encodeURIComponent(handle) + "&key=" + YT_KEY;
  const j = await (await fetch(url)).json();
  return Number(j.items[0].statistics.subscriberCount);
}

(async () => {
  if (YT_KEY.startsWith("PASTE")) return; // no key yet, keep the numbers typed in the HTML
  const counts = [];
  const els = [...document.querySelectorAll("[data-handle]")].filter(e => !e.dataset.handle.startsWith("REPLACE"));
  await Promise.all(els.map(async el => {
    try {
      const n = await getSubs(el.dataset.handle);
      el.textContent = fmt(n);
      if (el.classList.contains("client")) counts.push(n);
    } catch (e) { /* keep the fallback text */ }
  }));
  const big = document.getElementById("biggest");
  if (big && counts.length) big.textContent = fmt(Math.max(...counts));
})();
