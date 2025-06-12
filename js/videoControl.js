const video = document.getElementById("dual-video");
const canvas = document.getElementById("video-canvas");
const ctx = canvas.getContext("2d");

// 畫布大小設置為視頻一半高度（假設上下對半）
video.addEventListener("loadedmetadata", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight / 2;
});

// 建立 texture 並附著在 a-plane
const sceneEl = document.querySelector("a-scene");
sceneEl.addEventListener("loaded", () => {
    const plane = document.querySelector("#video-plane");
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

    plane.getObject3D("mesh").material = material;

    function drawFrame() {
        if (video.readyState >= 2) {
            // 上半部 RGB
            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight / 2,
                0, 0, canvas.width, canvas.height);

            // 下半部 alpha
            const alphaFrame = document.createElement("canvas");
            alphaFrame.width = canvas.width;
            alphaFrame.height = canvas.height;
            const alphaCtx = alphaFrame.getContext("2d");

            // 將下半部畫到 alpha 畫布上
            alphaCtx.drawImage(video, 0, video.videoHeight / 2, video.videoWidth, video.videoHeight / 2,
                0, 0, canvas.width, canvas.height);

            const rgbData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const alphaData = alphaCtx.getImageData(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < rgbData.data.length; i += 4) {
                // 取灰階作為 alpha 值（你也可以直接用 R 通道）
                const alpha = alphaData.data[i]; // 假設是白色表示可見
                rgbData.data[i + 3] = alpha;
            }

            ctx.putImageData(rgbData, 0, 0);
            texture.needsUpdate = true;
        }

        requestAnimationFrame(drawFrame);
    }

    video.play().then(() => drawFrame());
});