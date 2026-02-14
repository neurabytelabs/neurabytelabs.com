/**
 * SUBSTANCE AND SILICON — Monist Fractal Emergence
 * By Gemini (Gemini 3 Pro)
 * Mouse fix applied by Morty.
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

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.y, iResolution.x);
    
    // Mouse: warp UV toward cursor
    if (length(iMouse) > 0.0) {
        vec2 m = iMouse;
        m.y = 1.0 - m.y;
        vec2 mouseUV = (m - 0.5) * 2.0;
        float d = length(uv - mouseUV);
        uv += (mouseUV - uv) * 0.3 / (d + 0.8);
    }
    
    vec2 p = uv;
    p *= rot(iTime * 0.05);
    float zoom = 1.5 + sin(iTime * 0.2) * 0.5;
    p *= zoom;

    float m = 1.0;
    for(int i = 0; i < 8; i++) {
        p = abs(p) - 0.5;
        p *= rot(0.5 + iTime * 0.02);
        float d2 = dot(p, p);
        m = min(m, d2);
        p /= clamp(d2, 0.1, 1.0);
    }

    float agents = smoothstep(0.1, 0.0, abs(length(p) - 0.8));
    agents += smoothstep(0.05, 0.0, m) * 0.5;

    vec2 flow = vec2(dFdx(m), dFdy(m)) * 0.01;
    flow += p * 0.002;
    
    vec2 feedbackUV = gl_FragCoord.xy / iResolution.xy;
    vec4 prev = texture(iChannel0, feedbackUV - flow);
    
    vec3 colSubstance = vec3(0.1, 0.02, 0.0);
    vec3 colMode = vec3(1.0, 0.6, 0.1);
    vec3 colPulse = vec3(0.8, 0.1, 0.05);
    
    vec3 color = mix(colSubstance, colPulse, agents);
    color += colMode * pow(agents, 3.0) * 2.0;
    
    float decay = 0.94 + 0.03 * sin(iTime * 0.5);
    vec3 finalColor = color + prev.rgb * decay;
    
    float pulse = 0.8 + 0.2 * sin(iTime * 1.5);
    finalColor *= pulse;

    fragColor = vec4(finalColor, 1.0);
}
`);
