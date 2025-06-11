
window.addEventListener("load", () => {
    const video = document.querySelector("#my-video");
    video.play().catch((e) => {
        console.log("Autoplay failed:", e);
    });
});
