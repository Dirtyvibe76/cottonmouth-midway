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
        gateFlash.textContent = "OPEN THE GATES!";
        gateFlash.classList.add("show");
    }, 600);

    setTimeout(() => {
        landing.style.display = "none";
        gateFlash.textContent = "WELCOME TO THE MIDWAY";
    }, 1700);

    setTimeout(() => {
        gateFlash.classList.remove("show");
        midway.classList.remove("hidden");
        ambienceAudio.play().catch(() => {});
        window.scrollTo(0, 0);
    }, 3200);
});