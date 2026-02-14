// Default fallback shader — simple OMNI-FLUX fractal
initBlogShader(`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform vec2 iMouse;
out vec4 fragColor;
void main() {
    vec2 r = iResolution;
    float t = iTime * 0.5;
    vec2 FC = gl_FragCoord.xy;
    vec2 p = (FC.xy * 2. - r) / r.y / .3, v;
    vec4 o = vec4(0.);
    for(float i = 0.; i < 9.; i++) {
        float ii = i + 1., l;
        v = p;
        for(float f = 0.; f < 9.; f++) {
            float fi = f + 1.;
            v += sin(ceil(v.yx * fi + ii * .3) + r - t / 2.) / fi;
        }
        l = dot(p, p) - 5. - 2. / v.y;
        o += .1 / abs(l) * (cos(ii / 3. + .1 / l + vec4(1, 2, 3, 4)) + 1.);
    }
    vec4 fb = texture(iChannel0, (FC.xy + r.y * .04 * sin(FC.xy + FC.yx / .6)) / r);
    o = max(tanh(o + fb * o), .0);
    fragColor = o;
}
`);
