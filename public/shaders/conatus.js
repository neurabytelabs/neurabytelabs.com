initBlogShader(`
#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform sampler2D iChannel0;
out vec4 fragColor;

void main() {
    // Coordinate setup
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.y, iResolution.x);
    vec2 m = iMouse.xy / iResolution.xy;
    m.y = 1.0 - m.y; // Correct Y-flip
    vec2 mUV = (m - 0.5) * (iResolution.xy / min(iResolution.y, iResolution.x));
    float mDist = length(uv - mUV);
    
    // Interaction: External disruption field
    float disrupt = smoothstep(0.45, 0.0, mDist);
    float noise = fract(sin(dot(uv * 13.0 + iTime * 0.8, vec2(12.98, 78.23))) * 437.58);
    
    // Conatus: The System's Core (Strange Attractor approximation)
    // The system subtly follows the mouse but maintains its internal logic
    vec3 p = vec3(uv * 1.15 - mUV * disrupt * 0.2, 0.6 + 0.2 * sin(iTime * 0.2));
    float d = 0.0;
    mat2 rot = mat2(cos(iTime * 0.12), sin(iTime * 0.12), -sin(iTime * 0.12), cos(iTime * 0.12));
    for(int i = 0; i < 10; i++) {
        p = abs(p) / dot(p, p) - 0.82;
        p.yz *= rot;
        p.xy *= rot;
        d += exp(-5.5 * length(p));
    }
    
    // Particle Shedding: Fragments breaking off near the mouse
    float sparks = smoothstep(0.96, 1.0, noise) * disrupt * 4.0;
    
    // Color System: Purple (#A855F7) and Cyan (#22D3EE)
    vec3 purple = vec3(0.658, 0.333, 0.968);
    vec3 cyan = vec3(0.133, 0.827, 0.933);
    vec3 col = mix(purple, cyan, 0.5 + 0.4 * sin(d * 0.2 + iTime));
    
    // Apply disruption: The structure dims and breaks where the mouse touches
    // But it never truly disappears, representing the drive to persist
    col *= d * 0.14 * (1.0 - disrupt * 0.75);
    col += sparks * mix(cyan, purple, noise);
    
    // Temporal trails (The system persevering through time)
    vec4 prev = texture(iChannel0, gl_FragCoord.xy / iResolution.xy);
    fragColor = vec4(col, 1.0) * 0.18 + prev * 0.84;
    
    // Vignette and final polish
    float vig = smoothstep(1.2, 0.3, length(uv));
    fragColor.rgb *= vig;
    fragColor.a = 1.0;
}
`);
