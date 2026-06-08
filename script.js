const enterButton = document.getElementById("enterButton");
const landing = document.getElementById("landing");
const midway = document.getElementById("midway");
const gateFlash = document.getElementById("gateFlash");

const gateAudio = new Audio("assets/audio/openthegates.wav");

enterButton.addEventListener("click", () => {

    gateFlash.classList.add("active");

    gateAudio.play();

    setTimeout(() => {
        landing.style.display = "none";
        midway.classList.remove("hidden");
    }, 1500);

    setTimeout(() => {
        gateFlash.classList.remove("active");
    }, 2000);

});