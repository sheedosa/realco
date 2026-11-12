// One place for what every sheet needs (the enquiry drawer and the phone menu): the page behind is locked, and the
// phone's Back button or back swipe closes the sheet instead of leaving the page. A sheet takes one history entry
// while it is open; handing over from the menu to the drawer reuses it.
let owner: (() => void) | null = null;
let pushed = false;
let locks = 0;

function lock() {
  if (locks++ > 0) return;
  const root = document.documentElement, gap = window.innerWidth - root.clientWidth;
  root.style.overflow = "hidden"; document.body.style.overflow = "hidden";
  if (gap > 0) document.body.style.paddingRight = `${gap}px`; // no sideways jump where scrollbars take room
}
function unlock() {
  if (--locks > 0) return;
  locks = 0;
  document.documentElement.style.overflow = ""; document.body.style.overflow = ""; document.body.style.paddingRight = "";
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    if (!pushed) return;
    pushed = false;
    const close = owner; owner = null; close?.();
  });
}

/** Call when a sheet opens; call what it returns when the sheet closes (for any reason). */
export function openSheet(close: () => void) {
  owner = close; lock();
  if (!pushed) { try { window.history.pushState({ ...window.history.state, sheet: true }, ""); pushed = true; } catch { /* sandboxed */ } }
  return () => {
    unlock();
    if (owner === close) owner = null;
    // Wait a tick: another sheet may be taking over, or a link in the sheet may have replaced the entry.
    setTimeout(() => { if (owner || !pushed) return; pushed = false; if (window.history.state?.sheet) window.history.back(); }, 0);
  };
}
