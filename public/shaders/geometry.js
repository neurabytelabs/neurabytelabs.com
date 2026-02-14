initBlogShader(`
#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
out vec4 fragColor;

float seg(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
}

vec2 node(float i) {
    float r = 0.42 * sqrt(i / 24.0);
    float a = i * 2.39996 + iTime * 0.08;
    return vec2(cos(a), sin(a)) * r;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.y, iResolution.x);
    vec2 m = (iMouse - 0.5) * (iResolution / min(iResolution.y, iResolution.x));
    vec3 col = vec3(0.01, 0.005, 0.04) * (1.2 - length(uv));
    float g = 0.0;
    
    // Constructing the Geometric Proof
    for(float i = 0.0; i < 24.0; i++) {
        vec2 p1 = node(i);
        float dM = length(p1 - m);
        p1 += (m - p1) * exp(-dM * 12.0) * 0.2; // Spatio-logical attraction
        
        // Proposition Node
        float d = length(uv - p1);
        g += 0.00018 / (d + 0.004) * (0.8 + 0.2 * sin(iTime + i));
        
        for(float j = i + 1.0; j < 24.0; j++) {
            // Logical dependencies (Axiom -> Proposition -> Proof)
            if(j - i < 3.0 || mod(i, 6.0) == mod(j, 6.0)) {
                vec2 p2 = node(j);
                float dM2 = length(p2 - m);
                p2 += (m - p2) * exp(-dM2 * 12.0) * 0.2;
                
                float l = seg(uv, p1, p2);
                float mS = exp(-seg(m, p1, p2) * 18.0); // Mouse proximity
                
                // Cyan Glow on active logic paths
                float beam = 0.00035 / (l + 0.0015);
                g += beam * (1.0 + mS * 14.0 * (0.5 + 0.5 * sin(iTime * 7.0)));
                
                // Detaching fragments (Logic atoms)
                float t = fract(iTime * 0.4 + i * 0.1);
                vec2 pf = mix(p1, p2, t) + vec2(sin(iTime*2.+i), cos(iTime*2.+j)) * 0.01 * mS;
                g += (0.0001 / (length(uv - pf) + 0.001)) * mS;
            }
        }
    }
    
    // Sacred Geometric Rings (Substance)
    for(float r = 0.1; r < 0.6; r += 0.15) {
        float ring = abs(length(uv) - r) - 0.0005;
        g += 0.00006 / (ring + 0.006);
    }
    
    col += g * vec3(0.0, 0.9, 1.0); // Cyan edge-glow
    col += g * vec3(0.5, 0.0, 1.0) * 0.4; // Deep Purple depth
    col += pow(g, 2.0) * 0.05; // Highlight peaks
    
    fragColor = vec4(col, 1.0);
}
`);
