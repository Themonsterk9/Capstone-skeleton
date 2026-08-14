// =============================================================
//  AETHER FLOW — Custom GLSL Fragment Shader
//  FlyRank Capstone — Interactive Hero Background
// =============================================================
//  Uniforms:
//    u_time       — elapsed seconds (drives animation)
//    u_resolution — canvas size in pixels (aspect correction)
//    u_mouse      — smoothed cursor position in [0,1] (influence)
// =============================================================

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;

// -----------------------------------------------------------------
// SECTION A: Utility — pseudo-random hash
// A deterministic hash so we can build procedural noise cheaply.
// -----------------------------------------------------------------
float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
}

// -----------------------------------------------------------------
// SECTION B: Smooth value noise (2D)
// Bilinear interpolation of four hashed corner values.
// Gives organic, continuous variation — the backbone of the flow.
// -----------------------------------------------------------------
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    // Quintic smoothstep so derivatives are continuous
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// -----------------------------------------------------------------
// SECTION C: Fractal Brownian Motion (fBm)
// Stacks multiple octaves of noise at increasing frequency and
// decreasing amplitude, producing the layered, cloud-like quality
// that makes the aurora look natural rather than mechanical.
// -----------------------------------------------------------------
float fbm(vec2 p) {
    float v     = 0.0;
    float amp   = 0.5;
    float freq  = 1.0;
    // Four octaves — enough detail, not too expensive
    for (int i = 0; i < 4; i++) {
        v   += amp  * noise(p * freq);
        amp  *= 0.5;
        freq *= 2.0;
    }
    return v;
}

// -----------------------------------------------------------------
// SECTION D: Aether Palette
// Custom three-stop gradient function.
//   t in [0,1] → color in the palette
// Deep indigo-violet → teal-cyan → warm violet bloom
// These are NOT the playground defaults — palette is original.
// -----------------------------------------------------------------
vec3 aetherPalette(float t) {
    // Stop 0: near-black deep void
    vec3 c0 = vec3(0.02, 0.02, 0.08);
    // Stop 1: teal-violet midpoint — the aurora band
    vec3 c1 = vec3(0.05, 0.28, 0.42);
    // Stop 2: bright cyan bloom highlight
    vec3 c2 = vec3(0.14, 0.78, 0.72);
    // Stop 3: warm violet edge glow
    vec3 c3 = vec3(0.38, 0.08, 0.52);

    t = clamp(t, 0.0, 1.0);
    // Piecewise: three segments over [0,1]
    if (t < 0.33) return mix(c0, c1, t / 0.33);
    if (t < 0.66) return mix(c1, c2, (t - 0.33) / 0.33);
    return mix(c2, c3, (t - 0.66) / 0.34);
}

// -----------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------
void main() {

    // ---- SECTION E: UV + Aspect Ratio --------------------------
    // Convert this pixel into normalized [0,1] UV coordinates.
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Remap to centered [-0.5, 0.5] space so the field is symmetric.
    vec2 p = uv - 0.5;

    // Correct the X axis so the flow keeps its proportions on wide
    // screens.  Without this, circles become ellipses on 16:9+.
    p.x *= u_resolution.x / u_resolution.y;

    // ---- SECTION F: Mouse Influence ----------------------------
    // Normalize the smoothed cursor into centered space
    // (same coordinate frame as p above).
    vec2 mouse = u_mouse - 0.5;
    mouse.x   *= u_resolution.x / u_resolution.y;

    // Distance from this pixel to the cursor in the flow field.
    float mDist = length(p - mouse);

    // The cursor gently bends the domain — closer pixels are bent
    // further, producing a flowing wake rather than a sharp blob.
    // Strength falls off with mDist² so it stays subtle at range.
    float mStrength = 0.18 / (1.0 + mDist * mDist * 8.0);
    vec2 mBend      = (mouse - p) * mStrength;

    // ---- SECTION G: Time + Domain Distortion -------------------
    // Slow, smooth time drive.  Dividing by a large constant keeps
    // the animation gentle rather than frantic.
    float t = u_time * 0.12;

    // Apply mouse bend to a distorted copy of p used as input to
    // fBm. This makes the aurora drift and warp around the cursor.
    vec2 q = p + mBend;

    // First domain warp pass — distort the lookup coordinates.
    // This is the key trick that makes fBm look like a flow field.
    vec2 d;
    d.x = fbm(q * 1.8 + vec2(0.0,  t));
    d.y = fbm(q * 1.8 + vec2(5.2,  t * 0.9));

    // Second warp pass — warp again using the first distortion.
    // Two-level domain warp creates the curling, ribbon-like aurora.
    vec2 e;
    e.x = fbm(q * 1.4 + 2.2 * d + vec2(1.7, 9.2) + t * 0.6);
    e.y = fbm(q * 1.4 + 2.2 * d + vec2(8.3, 2.8) + t * 0.5);

    // Final field value — use the doubly-warped lookup.
    float f = fbm(q * 1.2 + 2.0 * e);

    // ---- SECTION H: Color Mapping ------------------------------
    // Map the flow field into our custom Aether palette.
    // Bias toward the dark end (multiply by 0.75) so text stays
    // readable over most of the canvas.
    vec3 color = aetherPalette(f * 0.75 + 0.1);

    // Add a secondary layer: a subtler, slightly shifted field for
    // depth. Blended at low opacity so it adds shimmer, not noise.
    float f2 = fbm(q * 0.9 + e.yx * 1.3 + t * 0.4);
    vec3 shimmer = aetherPalette(f2 * 0.5 + 0.4);
    color = mix(color, shimmer, 0.18);

    // ---- SECTION I: Grain --------------------------------------
    // Lightweight procedural grain to break up smooth gradients.
    // Hash of the pixel position + a time offset so it doesn't
    // appear static (subtle frame-to-frame flicker adds life).
    float grain = hash(gl_FragCoord.xy + fract(u_time * 0.3));
    // Scale grain to a very small perturbation — just texture.
    color += (grain - 0.5) * 0.018;

    // ---- SECTION J: Vignette -----------------------------------
    // Darken the edges of the canvas.  We use UV (not p) so the
    // vignette is anchored to screen corners, not the center.
    // This also darkens the area around the hero text (top-center).
    float vignette = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y);
    vignette = pow(vignette * 16.0, 0.5);
    // Clamp so the center stays bright but corners go dark.
    vignette = clamp(vignette, 0.0, 1.0);
    // Additional top-center darkening to ensure text contrast.
    float topMask = 1.0 - smoothstep(0.0, 0.4, uv.y);
    color *= mix(0.35, 1.0, vignette) * mix(0.6, 1.0, 1.0 - topMask * 0.5);

    // ---- SECTION K: Final Color --------------------------------
    // Clamp to a valid color range and output.
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
