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

// Match the invisible sign hitboxes to the *actual displayed image*, not
// the viewport. object-fit: contain introduces gutters on wide/tall screens.
const midwayImage = document.querySelector(".midway-image");
const signMenu = document.getElementById("signMenu");
const hero = document.querySelector(".midway-hero");

function positionSignMenu() {
    if (!midwayImage?.naturalWidth || !hero || !signMenu) return;
    const imageBox = midwayImage.getBoundingClientRect();
    const heroBox = hero.getBoundingClientRect();
    const scale = Math.min(imageBox.width / midwayImage.naturalWidth, imageBox.height / midwayImage.naturalHeight);
    const renderedWidth = midwayImage.naturalWidth * scale;
    const renderedHeight = midwayImage.naturalHeight * scale;
    signMenu.style.left = (imageBox.left - heroBox.left + (imageBox.width - renderedWidth) / 2) + "px";
    signMenu.style.top = (imageBox.top - heroBox.top + (imageBox.height - renderedHeight) / 2) + "px";
    signMenu.style.width = renderedWidth + "px";
    signMenu.style.height = renderedHeight + "px";
}
midwayImage?.addEventListener("load", positionSignMenu);
window.addEventListener("resize", positionSignMenu);
if (midwayImage?.complete) positionSignMenu();
// Append ?debug=signs to the URL to inspect every clickable rectangle.
if (new URLSearchParams(location.search).get("debug") === "signs") {
    document.documentElement.classList.add("debug-signs");
}
