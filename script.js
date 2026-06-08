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
    gateAudio.play();

    landing.classList.add("fade-out");

    setTimeout(() => {

        landing.style.display = "none";

        gateFlash.style.display = "flex";
        gateFlash.innerHTML = "OPEN THE GATES!";
        gateFlash.classList.add("active");

    }, 1000);

    setTimeout(() => {

        gateFlash.innerHTML = "WELCOME TO THE MIDWAY";

    }, 2000);

    setTimeout(() => {

        gateFlash.classList.remove("active");
        gateFlash.style.display = "none";

        midway.classList.remove("hidden");

        ambienceAudio.play();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 3500);

});