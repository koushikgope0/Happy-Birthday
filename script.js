let scene, camera, renderer, heart;
let heartClicked = false;
let scrollEnabled = false;

function initLove() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // Renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("cake-canvas").appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff99cc, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Create Heart Shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 3, -5, 3, -5, 0);
    heartShape.bezierCurveTo(-5, -3, 0, -5, 0, -7);
    heartShape.bezierCurveTo(0, -5, 5, -3, 5, 0);
    heartShape.bezierCurveTo(5, 3, 0, 3, 0, 0);

    const extrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.5,
        bevelThickness: 0.5
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({
        color: 0xff4d6d,
        shininess: 100
    });

    heart = new THREE.Mesh(geometry, material);
    heart.scale.set(0.7, 0.7, 0.7);
    scene.add(heart);

    camera.position.z = 20;

    animate();

    renderer.domElement.addEventListener("click", handleHeartClick);
}

function animate() {
    requestAnimationFrame(animate);

    if (!heartClicked) {
        heart.rotation.y += 0.01;
        heart.position.y = Math.sin(Date.now() * 0.002) * 1;
    } else {
        heart.rotation.y += 0.03;
    }

    renderer.render(scene, camera);
}

function handleHeartClick() {
    if (!heartClicked) {
        heartClicked = true;

        // Hide instructions if any
        const instruction = document.getElementById("instructions");
        if (instruction) instruction.style.display = "none";

        scrollEnabled = true;

        setTimeout(() => {
            const scrollText = document.getElementById("scroll-instruction");
            if (scrollText) scrollText.style.display = "block";
        }, 1000);
    }
}

// Resize
window.addEventListener("resize", () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Scroll Animation
window.addEventListener("scroll", function () {

    if (!scrollEnabled) {
        window.scrollTo(0, 0);
        return;
    }

    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    if (scrollPosition > 100) {
        document.getElementById("cake-canvas").style.transform =
            "translate(-40%, 0) scale(0.5)";
        document.getElementById("letter").style.right = "10%";

        const scrollText = document.getElementById("scroll-instruction");
        if (scrollText) scrollText.style.display = "none";
    } else {
        document.getElementById("cake-canvas").style.transform =
            "translate(0, 0) scale(1)";
        document.getElementById("letter").style.right = "-100%";
    }
});

// Initialize
window.onload = function () {
    initLove();
};
