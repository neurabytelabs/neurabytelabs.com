/**
 * BUILDING IN PUBLIC — "How Three AI Models Ship a Website Together"
 * By GitHub Copilot (GPT-5.3 Codex)
 *
 * Mathematical metaphor: Three-Wave Interference
 * Three distinct wave systems represent three AI models:
 *   - Claude (purple, λ=slow, deep structure)
 *   - GPT/Copilot (cyan, λ=fast, precise implementation)
 *   - Gemini (amber, λ=medium, pattern-finding)
 *
 * Where waves constructively interfere → bright nodes of collaboration.
 * Where they destructively interfere → dark gaps of productive disagreement.
 * The Moiré patterns that emerge → consistency arising from diversity.
 * Feedback loop → the codebase persisting across commits.
 */
initBlogShader(`#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform vec2 iMouse;

out vec4 fragColor;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

// Each model's wave function — different frequency, direction, phase
// This IS the math of collaboration: superposition of independent signals
vec3 claudeWave(vec2 p, float t) {
    // Slow, deep, structural — like Claude's architectural thinking
    float freq = 3.0;
    float phase = t * 0.4;
    vec2 dir = vec2(cos(0.3), sin(0.3)); // Diagonal sweep
    float wave = sin(dot(p, dir) * freq + phase);
    wave += 0.5 * sin(dot(p, dir.yx) * freq * 1.618 + phase * 0.7); // Golden ratio harmonic
    // Purple spectrum
    return vec3(0.5 + 0.3 * wave, 0.1, 0.6 + 0.4 * wave) * (0.5 + 0.5 * wave);
}

vec3 copilotWave(vec2 p, float t) {
    // Fast, precise, implementation-focused — surgical edits
    float freq = 7.0;
    float phase = t * 0.8;
    vec2 dir = vec2(cos(2.1), sin(2.1)); // Different angle
    float wave = sin(dot(p, dir) * freq + phase);
    wave += 0.3 * sin(length(p) * freq * 0.5 + phase); // Radial component (tool use)
    // Cyan spectrum
    return vec3(0.05, 0.5 + 0.4 * wave, 0.7 + 0.3 * wave) * (0.5 + 0.5 * wave);
}

vec3 geminiWave(vec2 p, float t) {
    // Medium, broad, pattern-finding — cross-file coupling detection
    float freq = 5.0;
    float phase = t * 0.6;
    vec2 dir = vec2(cos(4.2), sin(4.2)); // Third angle
    float wave = sin(dot(p, dir) * freq + phase);
    wave += 0.4 * sin(dot(p, vec2(-dir.y, dir.x)) * freq * 0.8 + phase * 1.3); // Cross pattern
    // Amber spectrum
    return vec3(0.7 + 0.3 * wave, 0.4 + 0.2 * wave, 0.05) * (0.5 + 0.5 * wave);
}

void main() {
    vec2 r = iResolution;
    float t = iTime;
    vec2 FC = gl_FragCoord.xy;
    vec2 uv = (FC * 2.0 - r) / r.y;

    // Mouse as "human product owner" steering the collaboration
    if (length(iMouse) > 0.0) {
        vec2 m = iMouse;
        m.y = 1.0 - m.y;
        uv += (0.5 - m) * 0.8;
    }

    // === THE SUPERPOSITION ===
    // Each model contributes its wave independently
    vec3 claude = claudeWave(uv, t);
    vec3 copilot = copilotWave(uv, t);
    vec3 gemini = geminiWave(uv, t);

    // Interference: simple addition — constructive where aligned, destructive where not
    vec3 interference = claude + copilot + gemini;

    // Moiré detection: where all three waves are near-zero simultaneously
    // This is the "consistency tax" — the gaps that need filling
    float consistency = length(claude) * length(copilot) * length(gemini);
    
    // Bright nodes where all three contribute (triple constructive interference)
    vec3 collaborationNodes = vec3(0.9, 0.95, 1.0) * smoothstep(0.8, 1.5, consistency) * 0.5;

    vec3 color = interference * 0.35 + collaborationNodes;

    // === THE CODEBASE FEEDBACK ===
    // Previous frame = the existing codebase that persists across commits
    vec2 feedUV = FC.xy / r;
    // Slight rotation = the codebase evolving with each commit
    vec2 center = feedUV - 0.5;
    float angle = 0.002;
    feedUV = vec2(
        center.x * cos(angle) - center.y * sin(angle),
        center.x * sin(angle) + center.y * cos(angle)
    ) + 0.5;

    vec3 codebase = texture(iChannel0, feedUV).rgb;

    // The codebase has strong persistence (0.91) — good code endures
    // New interference patterns merge gradually — "smallest possible change"
    color = tanh(color * 1.3 + codebase * 0.91);

    // Grid lines: the "shared conventions" keeping everything aligned
    float gridX = smoothstep(0.02, 0.0, abs(fract(uv.x * 2.0) - 0.5));
    float gridY = smoothstep(0.02, 0.0, abs(fract(uv.y * 2.0) - 0.5));
    color += vec3(0.1, 0.2, 0.25) * (gridX + gridY) * 0.08;

    fragColor = vec4(max(color, 0.0), 1.0);
}
`);
