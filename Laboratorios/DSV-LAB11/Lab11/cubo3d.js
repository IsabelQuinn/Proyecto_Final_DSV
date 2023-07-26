
document.addEventListener('DOMContentLoaded', function(event) {
    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame;
    })();

    function animateScene() {
        requestAnimationFrame(animateScene);

        cube.rotation.y += 0.02;
        cube.rotation.x += 0.01;
        
        renderScene();
    }

    function createCube() {
        var cubeMaterials = [
            new THREE.MeshBasicMaterial({color:0x2173fd}),
            new THREE.MeshBasicMaterial({color:0xd5d918}),
            new THREE.MeshBasicMaterial({color:0xd2dbeb}),
            new THREE.MeshBasicMaterial({color:0xa3a3c6}),
            new THREE.MeshBasicMaterial({color:0xfe6b9f}),
            new THREE.MeshDepthMaterial({color:0x856af9})
        ];

        var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
        var cubeGeometry = new THREE.BoxGeometry(2, 2, 2);

        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        return cube;
    }

    function startScene(cube) {
        var canvas = document.getElementById('canvas');
        render = new THREE.WebGLRenderer();

        render.setClearColor(0x000000, 1);

        var canvasWidth =  canvas.getAttribute('width');
        var canvasHeight = canvas.getAttribute('height');
        render.setSize(canvasWidth, canvasHeight);

        canvas.appendChild(render.domElement);

        scene = new THREE.Scene();
        var aspect = canvasWidth / canvasHeight;

        camera = new THREE.PerspectiveCamera(45, aspect);
        camera.position.set(0, 0, 0);
        camera.lookAt(scene.position);
        scene.add(camera);

        cube.position.set(0, 0, -7.0);
        scene.add(cube);
    }

    function renderScene() {
        render.render(scene, camera);
    }

    var cube = createCube();
    startScene(cube);
    animateScene();
    renderScene();

});