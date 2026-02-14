initBlogShader(`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
out vec4 fragColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
    vec2 R = iResolution.xy;
    vec2 uv = (gl_FragCoord.xy - 0.5 * R) / min(R.y, R.x);
    vec2 m_raw = iMouse; m_raw.y = 1.0 - m_raw.y;
    vec2 m = (m_raw - 0.5) * iResolution / min(iResolution.y, iResolution.x);
    vec3 col = vec3(0.015, 0.005, 0.0);
    float t = iTime * 0.5;
    float pulse = sin(t * 1.2) * 0.1 + 0.9;

    // SUBSTANCE: The Shared Fractal Substrate
    vec2 p = uv * 1.8;
    for(int i = 0; i < 6; i++) {
        p = abs(p) / dot(p, p) - 0.65 - sin(t * 0.3) * 0.02;
        col += vec3(0.18, 0.04, 0.01) * (0.007 / length(p));
    }

    // MODES: Multi-Agent Orbs and Connections
    for(float i = 0.0; i < 14.0; i++) {
        // Agent positions
        float h1 = hash(vec2(i, 1.0));
        float h2 = hash(vec2(i, 2.0));
        vec2 pos = vec2(sin(t + h1 * 6.28), cos(t * 0.8 + h2 * 6.28)) * 0.6;
        
        float d = length(uv - pos);
        float mDist = length(m - pos);
        float interaction = smoothstep(0.35, 0.0, mDist);
        
        // Luminous Agent (Orb)
        float glow = 0.008 / (d + 0.004);
        col += vec3(0.96, 0.62, 0.04) * glow * (1.0 + interaction * 6.0);
        
        // Neural Connections (Substrate Threads)
        vec2 posNext = vec2(sin(t + hash(vec2(i + 1.0, 1.0)) * 6.28), cos(t * 0.8 + hash(vec2(i + 1.0, 2.0)) * 6.28)) * 0.6;
        float hL = clamp(dot(uv - pos, posNext - pos) / dot(posNext - pos, posNext - pos), 0.0, 1.0);
        float line = length(uv - mix(pos, posNext, hL));
        col += vec3(0.8, 0.2, 0.05) * (0.0004 / (line + 0.001)) * (1.0 + interaction * 2.0) * pulse;

        // SPARKS: Emergent Particles on Interaction
        if(interaction > 0.05) {
            for(float s = 0.0; s < 7.0; s++) {
                float hs = hash(vec2(i, s));
                float life = fract(iTime * 1.8 + hs);
                vec2 dir = vec2(sin(hs * 6.28), cos(hs * 6.28));
                vec2 sPos = pos + dir * life * (0.15 + interaction * 0.45);
                float spark = 0.0006 / length(uv - sPos);
                col += vec3(1.0, 0.8, 0.3) * spark * (1.0 - life) * interaction;
            }
        }
    }

    // Finishing: Vignette and Color Grading
    col *= 1.2 - length(uv) * 0.6;
    fragColor = vec4(pow(clamp(col, 0.0, 1.0), vec3(0.85)), 1.0);
}`);
