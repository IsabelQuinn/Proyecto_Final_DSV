var cubeRotation = 0.0;

main();

//
// start here
//
function main() {
  const canvas = document.querySelector("#glCanvas");
  //inicializar contexto gl
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  //Continuar solo si wegl esta disponible y funcionando
  if (!gl) {
    alert(
      "No se pudo inicializar el webGL. Es posible que su navegador o maquina no lo admita"
    );
    return;
  }

// Programa del shader de vértices

const vsSource = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying lowp vec4 vColor;
void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
}
`;

 // Programa del shader de fragmentos

 const fsSource = `
 varying lowp vec4 vColor;
 void main(void) {
   gl_FragColor = vColor;
 }
`;

 // Inicializar el programa del shader; aquí se establece toda la iluminación
// para los vértices, etc.
const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

// Recopilar toda la información necesaria para usar el programa del shader.
// Buscar qué atributos usa nuestro programa del shader
// para aVertexPosition y aVertexColor,
// y también buscar las ubicaciones de los uniformes.
const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };
  //Aquí es donde llamamos al procedimiento que 
  //construye todos los objetos que dibujaremos.
  const buffers = initBuffers(gl);

  var then = 0;
  // Dibujar la escena repetidamente
  function render(now) {
    now *= 0.001;  // convertir a segundos
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
// initBuffers
//
//Inicializar los buffers que necesitaremos. Para esta demostración, solo
// tenemos un objeto: un cubo tridimensional simple.
//
function initBuffers(gl) {
    // Crear un buffer para las posiciones de los vértices del cubo.
    const positionBuffer = gl.createBuffer();
    // Seleccionar positionBuffer como el que se aplicará
    // las operaciones de buffer a partir de aquí.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
    // Ahora crear una matriz de posiciones para el cubo. 
    const positions = [
      // Cara frontal
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
  
      // Cara trasera
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,
  
      // Cara superior
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,
  
      // Cara inferior
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,
  
      // Cara derecha
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,
  
      // Cara izquierdae
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ];
  
    // Ahora pasamos la lista de posiciones a WebGL para construir la
    // forma. Hacemos esto creando un Float32Array a partir de la
    // matriz de JavaScript, luego lo usamos para llenar el búfer actual.   
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    // Ahora configuramos los colores para las caras. Usaremos colores sólidos
    // para cada cara.
  
    const faceColors = [
      [1.0,  1.0,  1.0,  1.0],    // Cara frontal: blanco
      [1.0,  0.0,  0.0,  1.0],    // Cara trasera: rojo
      [0.0,  1.0,  0.0,  1.0],    // Cara superior: verde
      [0.0,  0.0,  1.0,  1.0],    // Cara inferior: azul
      [1.0,  1.0,  0.0,  1.0],    // Cara derecha: amarillo
      [1.0,  0.0,  1.0,  1.0],    // Cara izquierda: morado
    ];
  
    // Convertimos la matriz de colores en una tabla para todos los vértices.
  
    var colors = [];
  
    for (var j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];
  
      // Repetimos cada color cuatro veces para los cuatro vértices de la cara
      colors = colors.concat(c, c, c, c);
    }
  
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
    // Construimos el búfer de índices de elementos; esto especifica los índices
    // en los arreglos de vértices para los vértices de cada cara.
 
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
   // Esta matriz define cada cara como dos triángulos, usando los
   // índices en el arreglo de vértices para especificar la posición de cada triángulo.    
  
   const indices = [
    0, 1, 2,       0, 2, 3, // frente
    4, 5, 6,       4, 6, 7, // detrás
    8, 9, 10,      8, 10, 11, // arriba
    12, 13, 14,    12, 14, 15, // abajo
    16, 17, 18,    16, 18, 19, // derecha
    20, 21, 22,    20, 22, 23, // izquierda
    ];
  
   // Ahora envía el array de elementos a GL
  
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);
  
    return {
      position: positionBuffer,
      color: colorBuffer,
      indices: indexBuffer,
    };
  }
  
  //
  // Dibuja la escena.
  //
  function drawScene(gl, programInfo, buffers, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);      // Borra con negro, completamente opaco
    gl.clearDepth(1.0);                     // Borra todo
    gl.enable(gl.DEPTH_TEST);               // Habilita la prueba de profundidad
    gl.depthFunc(gl.LEQUAL);                // Objetos cercanos ocultan objetos lejanos
  
    // Borra el lienzo antes de comenzar a dibujar en el.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Crea una matriz de perspectiva, una matriz especial que se utiliza
    // para simular la distorsión de la perspectiva en una cámara.
    // Nuestro campo de visión es de 45 grados, con una relación de
    // ancho/alto que coincide con el tamaño de visualización del lienzo
    // y solo queremos ver objetos entre 0.1 unidades
    // y 100 unidades de distancia de la cámara..
  
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
    // nota: glmatrix.js siempre tiene el primer argumento
    // como el destino que recibe el resultado.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
  
    // Establece la posición de dibujo en el punto "identidad", que es
    // el centro de la escena.
    const modelViewMatrix = mat4.create();
  
    // Ahora mueve la posición de dibujo un poco hacia donde queremos
    // comenzar a dibujar el cubo.
  
    mat4.translate(modelViewMatrix,     // matriz de destino
                   modelViewMatrix,     // matriz a trasladar
                   [-0.0, 0.0, -6.0]);  // cantidad a trasladar
    mat4.rotate(modelViewMatrix,        // matriz de destino
                modelViewMatrix,        // matriz a rotar
                cubeRotation,           // cantidad a rotar en radianes
                [0, 0, 1]);             // eje alrededor del cual rotar (Z)
    mat4.rotate(modelViewMatrix,        // matriz de destino
                modelViewMatrix,        // matriz a rotar
                cubeRotation * .7,      // cantidad a rotar en radianes
                [0, 1, 0]);             // eje alrededor del cual rotar (X)
  
    // Indica a WebGL cómo extraer las posiciones del búfer de posición
    // en el atributo vertexPosition.
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }
  
    // Indica a WebGL cómo extraer los colores del búfer de color
    // en el atributo vertexColor.
    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexColor,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexColor);
    }
  
    // Indica a WebGL qué índices usar para indexar los vértices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
    // Indica a WebGL que use nuestro programa al dibujar
  
    gl.useProgram(programInfo.program);
  
    // Establece los uniformes del shader
  
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
  
    {
      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  
    // Actualiza la rotación para el siguiente dibujo
  
    cubeRotation += deltaTime;
  }
  
  //
  // Inicializa un programa de sombreado, para que WebGL sepa cómo dibujar nuestros datos
  //
  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    // Crea el programa de sombreado
  
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // Si la creación del programa de sombreado falló, alerta
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
  
    return shaderProgram;
  }
  
  //
  // Crea un sombreador del tipo dado, carga la fuente y
  // lo compila.
  //
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    // Envía la fuente al objeto sombreador
  
    gl.shaderSource(shader, source);
  
    // Compila el programa de sombreado
  
    gl.compileShader(shader);
  
    // Verifica si se compiló correctamente
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
}



