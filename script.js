// The landing/entry sequence must never leave an invisible full-height landing
// in front of (or above) the Midway. Browsers can defer timers when a tab is
// backgrounded, so all critical visibility changes happen in the click handler.
(() => {
    const enterButton = document.getElementById("enterButton");
    const landing = document.getElementById("landing");
    const midway = document.getElementById("midway");
    const gateFlash = document.getElementById("gateFlash");
    if (!enterButton || !landing || !midway || !gateFlash) return;

    const gateAudio = new Audio("assets/audio/openthegates.wav");
    const ambienceAudio = new Audio("assets/audio/background.wav");
    ambienceAudio.loop = true;
    ambienceAudio.volume = 0.25;
    let entered = false;
    let flashTimer = null;

    function revealMidway() {
        entered = true;
        landing.classList.remove("fade-out");
        landing.style.display = "none";
        midway.classList.remove("hidden");
        window.scrollTo({top: 0, left: 0, behavior: "instant"});
    }

    enterButton.addEventListener("click", () => {
        if (entered) return;
        revealMidway();
        gateAudio.currentTime = 0;
        gateAudio.play().catch(() => {});
        ambienceAudio.play().catch(() => {});
        gateFlash.textContent = "WELCOME TO THE MIDWAY";
        gateFlash.classList.add("show");
        clearTimeout(flashTimer);
        flashTimer = setTimeout(() => gateFlash.classList.remove("show"), 950);
    });

    // Chrome's back/forward cache can restore a partially transitioned page.
    // Repair any such state synchronously rather than leaving a blank screen.
    window.addEventListener("pageshow", () => {
        if (entered || landing.style.display === "none") {
            revealMidway();
            gateFlash.classList.remove("show");
        } else {
            landing.style.display = "";
            landing.classList.remove("fade-out");
            midway.classList.add("hidden");
            gateFlash.classList.remove("show");
        }
    });
})();
