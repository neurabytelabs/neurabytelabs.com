/**
 * BUILDING IN PUBLIC — Three-Wave Interference
 * By GPT-5.3 Codex (via Antigravity Gateway)
 *
 * Three AI models as wave systems:
 * Claude (purple, slow) + GPT (cyan, fast) + Gemini (amber, medium)
 * Superposition creates interference patterns — collaboration in math.
 */
initBlogShader(`#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform vec2 iMouse;

out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    
    // Mouse attraction lens
    vec2 m = iMouse; m.y = 1.0 - m.y;
    vec2 mouseUV = (m - 0.5) * 2.0;
    float md = length(uv - mouseUV);
    uv += (mouseUV - uv) * 0.3 / (md + 0.8);
    
    float t = iTime * 0.5;
    
    // Claude — purple, slow, structural
    float claude = sin(length(uv) * 8.0 - t * 0.5) * 0.5 + 0.5;
    claude += sin(uv.x * 6.0 - t * 0.3) * 0.3;
    
    // GPT — cyan, fast, precise (dominant)
    float gpt = sin(length(uv) * 12.0 - t * 2.0) * 0.5 + 0.5;
    gpt += sin(uv.y * 10.0 - t * 1.8) * 0.4;
    
    // Gemini — amber, medium, pattern-finding
    float gemini = sin(length(uv) * 10.0 - t * 1.0) * 0.5 + 0.5;
    gemini += sin((uv.x + uv.y) * 8.0 - t * 0.8) * 0.3;
    
    // Superposition — interference
    float interference = claude * 0.3 + gpt * 0.5 + gemini * 0.35;
    float moire = sin(uv.x * 20.0) * sin(uv.y * 20.0);
    interference += moire * 0.15;
    
    // Color: cyan dominant
    vec3 col = vec3(0.0);
    col += vec3(0.6, 0.2, 0.8) * claude * 0.4;
    col += vec3(0.0, 0.9, 1.0) * gpt * 0.8;
    col += vec3(1.0, 0.7, 0.2) * gemini * 0.5;
    col *= interference;
    
    // Feedback — the codebase persists
    vec2 fbUV = gl_FragCoord.xy / iResolution.xy;
    vec3 feedback = texture(iChannel0, fbUV).rgb;
    col = mix(feedback * 0.95, col, 0.3);
    
    fragColor = vec4(col, 1.0);
}
`);
