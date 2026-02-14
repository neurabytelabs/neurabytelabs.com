/**
 * OMNI-FLUX Shader Engine — shared WebGL2 boilerplate for blog hero shaders.
 * Each shader file defines a FRAG string and calls: initBlogShader(FRAG, uniforms?)
 */
window.initBlogShader = function(FRAG, customUniforms) {
  const heroId = window.__HERO_ID;
  if (!heroId) return;
  const canvas = document.getElementById(heroId);
  if (!canvas) return;
  const wrapper = canvas.parentElement;

  const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  if (!gl) return;
  gl.getExtension('EXT_color_buffer_float');

  const mouse = { x: 0.5, y: 0.5 };
  wrapper.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  });

  const VERT = `#version 300 es
in vec4 position;
void main() { gl_Position = position; }`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error('Shader:', gl.getShaderInfoLog(s)); return null; }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs); gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error('Link:', gl.getProgramInfoLog(prog)); return; }

  const posLoc = gl.getAttribLocation(prog, 'position');
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

  // Standard uniforms
  const u = {};
  ['iResolution','iTime','iChannel0','iMouse'].forEach(function(n) { u[n] = gl.getUniformLocation(prog, n); });
  // Custom uniforms from shader
  if (customUniforms) {
    Object.keys(customUniforms).forEach(function(n) { u[n] = gl.getUniformLocation(prog, n); });
  }

  function createFBO(w, h) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const ext = gl.getExtension('EXT_color_buffer_float');
    gl.texImage2D(gl.TEXTURE_2D, 0, ext ? gl.RGBA32F : gl.RGBA16F, w, h, 0, gl.RGBA, ext ? gl.FLOAT : gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { texture: tex, fb: fb };
  }

  function deleteFBO(fbo) { gl.deleteTexture(fbo.texture); gl.deleteFramebuffer(fbo.fb); }

  var fbos;
  function resizeBuffers() {
    if (fbos) { deleteFBO(fbos[0]); deleteFBO(fbos[1]); }
    fbos = [createFBO(canvas.width, canvas.height), createFBO(canvas.width, canvas.height)];
  }

  function resize() {
    var rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    resizeBuffers();
  }

  resize();
  window.addEventListener('resize', resize);

  var visible = true;
  var observer = new IntersectionObserver(function(entries) {
    visible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(wrapper);

  function render(time) {
    requestAnimationFrame(render);
    if (!visible) return;

    var tm = time * 0.001;
    var dw = canvas.clientWidth, dh = canvas.clientHeight;
    if (canvas.width !== dw || canvas.height !== dh) { canvas.width = dw; canvas.height = dh; resizeBuffers(); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);

    gl.uniform2f(u.iResolution, canvas.width, canvas.height);
    gl.uniform1f(u.iTime, tm);
    gl.uniform2f(u.iMouse, mouse.x, mouse.y);

    // Set custom uniforms
    if (customUniforms) {
      Object.keys(customUniforms).forEach(function(name) {
        var val = customUniforms[name];
        if (typeof val === 'number') gl.uniform1f(u[name], val);
        else if (Array.isArray(val) && val.length === 2) gl.uniform2f(u[name], val[0], val[1]);
        else if (Array.isArray(val) && val.length === 3) gl.uniform3f(u[name], val[0], val[1], val[2]);
      });
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbos[0].texture);
    gl.uniform1i(u.iChannel0, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[1].fb);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fbos[1].fb);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);

    fbos = [fbos[1], fbos[0]];
  }

  requestAnimationFrame(render);
};
