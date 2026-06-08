const enterButton = document.getElementById("enterButton");
const landing = document.getElementById("landing");
const midway = document.getElementById("midway");
const gateFlash = document.getElementById("gateFlash");

const gateAudio = new Audio("assets/audio/openthegates.wav");

const ambienceAudio = new Audio("assets/audio/background.wav");
ambienceAudio.loop = true;
ambienceAudio.volume = 0.25;

enterButton.addEventListener("click", () => {
    gateAudio.currentTime = 0;
    gateAudio.play().catch(() => {});

    landing.classList.add("fade-out");

    setTimeout(() => {
        landing.style.display = "none";
        gateFlash.style.display = "flex";
        gateFlash.textContent = "OPEN THE GATES!";
        gateFlash.classList.add("gate-shake");
    }, 800);

    setTimeout(() => {
        gateFlash.textContent = "WELCOME TO THE MIDWAY";
    }, 1800);

    setTimeout(() => {
        gateFlash.style.display = "none";
        gateFlash.classList.remove("gate-shake");

        midway.classList.remove("hidden");
        midway.classList.add("midway-reveal");

        ambienceAudio.play().catch(() => {});
        window.scrollTo(0, 0);
    }, 3000);
});