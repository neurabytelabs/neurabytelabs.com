initBlogShader(`
#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
out vec4 fragColor;

float h(vec2 p) { return fract(sin(dot(p, vec2(12.9, 78.2))) * 43758.5); }
float n(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
    return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y);
}
float f(vec2 p) {
    float v = 0., a = .5;
    for(int i=0; i<3; i++) { v += a * n(p); p *= 2.1; a *= .5; }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = (gl_FragCoord.xy - .5 * iResolution.xy) / iResolution.y;
    vec2 m = (iMouse - .5) * (iResolution / iResolution.y);
    
    float dM = length(p - m), mF = exp(-dM * 8.0);
    p += (p - m) * mF * 0.4; // Bend coordinate space toward mouse

    vec3 col = vec3(0);
    float sumI = 0.0;
    
    for(int i=0; i<3; i++) {
        float ang = atan(p.y, p.x) + float(i) * 2.0944 + iTime * 0.15;
        ang = abs(mod(ang + 3.1416, 6.2832) - 3.1416); // Radial stream paths
        
        float d = length(p);
        float w = sin(d * 12.0 - iTime * 5.0 + f(p * 2.5) * 4.0) * 0.12;
        float s = smoothstep(0.18, 0.0, ang + w) * exp(-d * 0.7);
        
        // Colors: Claude (Purple), GPT (Cyan), Gemini (Amber)
        vec3 sC = (i==0) ? vec3(0.6, 0.2, 1.0) : (i==1 ? vec3(0.0, 0.8, 1.0) : vec3(1.0, 0.6, 0.1));
        if(i == 1) s *= 1.6; // GPT/Cyan dominance
        
        float inst = s * (1.0 + mF * 6.0);
        col += sC * inst;
        sumI += inst;
        
        // Spark generation near mouse interaction
        if(dM < 0.15) col += sC * step(0.97, h(p * 180.0 + iTime)) * mF * 2.5;
    }

    // Convergence point: Bright silver/white flashes
    float center = exp(-length(p) * 15.0);
    col += vec4(0.8, 0.95, 1.0, 1.0).rgb * center * (1.5 + sin(iTime * 15.0) * 0.5);
    
    // Productive Disagreement: Dark interference patterns where streams collide
    float collide = pow(col.r * col.g * col.b, 0.4) * 5.0;
    col = mix(col, vec3(0.02, 0.03, 0.05), collide * step(0.6, n(p * 50.0 + iTime)) * 0.8);

    // Final color grading and vignette
    fragColor = vec4(col * (1.1 - length(uv - 0.5) * 1.4), 1.0);
}
`);
