/**
 * BUILDING IN PUBLIC (v2) — Three-wave interference, cyan-dominant.
 */
initBlogShader(`#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform vec2 iMouse;

out vec4 fragColor;

mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

float wave(vec2 p, vec2 dir, float freq, float speed, float phase, float t) {
    return sin(dot(p, dir) * freq + t * speed + phase);
}

void main() {
    vec2 r = iResolution;
    vec2 fc = gl_FragCoord.xy;
    float t = iTime;
    vec2 uv = (fc * 2.0 - r) / r.y;

    if (length(iMouse) > 0.0) {
        vec2 m = iMouse;
        m.y = 1.0 - m.y;
        uv += (0.5 - m) * 0.7;
    }

    vec2 p1 = rot(0.22) * uv;
    vec2 p2 = rot(2.18) * uv;
    vec2 p3 = rot(4.07) * uv;

    float w1 = wave(p1, normalize(vec2(1.0, 0.3)), 5.2, 0.90, 0.0, t);
    float w2 = wave(p2, normalize(vec2(0.4, 1.0)), 6.8, 1.15, 1.7, t);
    float w3 = wave(p3, normalize(vec2(-1.0, 0.5)), 4.6, 0.72, 3.1, t);

    float interference = (w1 + w2 + w3) / 3.0;
    float ridge = 1.0 - abs(w1 * w2 * w3);
    float nodes = smoothstep(0.80, 0.995, ridge);

    vec3 c1 = vec3(0.18, 0.85, 0.98) * (0.45 + 0.55 * w1 * w1);
    vec3 c2 = vec3(0.08, 0.65, 0.92) * (0.45 + 0.55 * w2 * w2);
    vec3 c3 = vec3(0.28, 0.42, 0.92) * (0.45 + 0.55 * w3 * w3);

    vec3 color = c1 + c2 + c3;
    color += vec3(0.75, 1.0, 1.0) * nodes * 0.35;
    color += vec3(0.02, 0.22, 0.30) * (0.5 + 0.5 * interference);

    vec2 fbUV = fc / r;
    vec2 q = fbUV - 0.5;
    q = rot(0.004 + 0.002 * sin(t * 0.3)) * q;
    fbUV = q * 0.996 + 0.5;
    vec3 memory = texture(iChannel0, fbUV).rgb;
    color = tanh(color * 1.35 + memory * 0.90);

    float vignette = smoothstep(1.25, 0.1, dot(uv, uv));
    color *= vignette;
    fragColor = vec4(max(color, 0.0), 1.0);
}
`);
