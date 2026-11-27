// Restore the original OPEN THE GATES → WELCOME TO THE MIDWAY sequence.
// The Midway is revealed behind the transition immediately, so timer delays
// or browser tab throttling can never strand the visitor on an empty page.
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
    let animating = false;
    let timers = [];

    function clearTimers() {
        timers.forEach(clearTimeout);
        timers = [];
    }
    function schedule(callback, ms) {
        timers.push(setTimeout(callback, ms));
    }
    function finishTransition() {
        clearTimers();
        landing.style.display = "none";
        landing.classList.remove("fade-out");
        gateFlash.classList.remove("show");
        document.body.classList.remove("gate-entering");
        animating = false;
        window.scrollTo({top: 0, left: 0, behavior: "instant"});
    }

    enterButton.addEventListener("click", () => {
        if (entered) return;
        entered = true;
        animating = true;
        // Make the actual page visible immediately underneath the overlays.
        midway.classList.remove("hidden");
        document.body.classList.add("gate-entering");
        landing.classList.add("fade-out");
        window.scrollTo(0, 0);

        gateAudio.currentTime = 0;
        gateAudio.play().catch(() => {});
        // Avoid continuing entrance ambience on top of the gate announcement.
        schedule(() => { ambienceAudio.play().catch(() => {}); }, 3100);

        // Preserve the original timing and two distinct titles.
        schedule(() => {
            gateFlash.textContent = "OPEN THE GATES!";
            gateFlash.classList.add("show");
        }, 600);
        schedule(() => {
            landing.style.display = "none";
            gateFlash.textContent = "WELCOME TO THE MIDWAY";
        }, 1700);
        schedule(finishTransition, 3200);
    });

    // When returning through browser history, ensure no half-faded overlay
    // obstructs the page. A visit that has not entered remains at the gate.
    window.addEventListener("pageshow", event => {
        if (event.persisted) {
            if (entered) {
                midway.classList.remove("hidden");
                finishTransition();
            } else {
                clearTimers();
                document.body.classList.remove("gate-entering");
                landing.style.display = "";
                landing.classList.remove("fade-out");
                gateFlash.classList.remove("show");
                midway.classList.add("hidden");
            }
        }
    });

    // If a tab sleeps during the effect, recover on return if enough time passed.
    let startedAt = 0;
    const priorClick = enterButton;
    priorClick.addEventListener("click", () => { if (animating) startedAt = Date.now(); });
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && animating && startedAt && Date.now() - startedAt > 3600) {
            finishTransition();
        }
    });
})();
