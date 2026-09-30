import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

// Use the theme's grayscale luminance values so the shader follows the site palette.
const themeGray = (token: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const luminance = Number(value.match(/([\d.]+)%\s*$/)?.[1] ?? 80) / 100;
  return new Float32Array([luminance, luminance, luminance]);
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uMorphAmount;
uniform float uBands;
uniform float uThickness;
uniform float uScale;
uniform float uPixelSize;
uniform float uGlow;
uniform float uColorMode;
uniform float uContrast;
uniform float uBrightness;
uniform float uFillBands;
uniform float uOpacity;
uniform float uLightMode;
uniform vec3 uLow;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform vec2 uMouse;
uniform float uMouseEnabled;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec4 uCtrlA;
uniform vec4 uCtrlB;
uniform vec4 uCtrlC;
uniform vec4 uCtrlD;
out vec4 fragColor;

float bez(float t, vec4 c) {
  float w = 6.2831853 * t;
  return 0.5 * (c.x * sin(w) + c.y * cos(w) + c.z * sin(2.0 * w) + c.w * cos(2.0 * w));
}

float field(vec2 uv) {
  vec2 a = vec2(bez(uv.x, uCtrlA), bez(uv.x, uCtrlB));
  vec2 b = vec2(bez(uv.y, uCtrlC), bez(uv.y, uCtrlD));
  return distance(a, b);
}

vec3 elevationColor(float e) {
  vec3 c = mix(uLow, uMid, smoothstep(0.0, 0.5, e));
  c = mix(c, uHigh, smoothstep(0.5, 1.0, e));
  return c;
}

void main() {
  vec2 res = iResolution.xy;
  vec2 uv = gl_FragCoord.xy / res;

  vec2 suv = (uv - 0.5) / max(uScale, 0.001) + 0.5;

  vec2 sampleUv = suv;
  if (uPixelSize > 1.0) {
    vec2 px = res / uPixelSize;
    sampleUv = (floor(suv * px) + 0.5) / px;
  }

  float fv = field(sampleUv);

  if (uMouseEnabled > 0.5) {
    vec2 d = uv - uMouse;
    d.x *= res.x / max(res.y, 1.0);
    float r = max(uMouseRadius, 0.001);
    float bump = exp(-dot(d, d) / (r * r)) * uMouseStrength * uMouseActive;
    fv += bump;
  }

  float f = fv * uBands;
  float frac = fract(f);
  float lineDist = min(frac, 1.0 - frac);

  float aa = fwidth(f) + 0.0001;
  float mask = 1.0 - smoothstep(uThickness - aa, uThickness + aa, lineDist);

  float glowR = uThickness + uGlow * 0.5 + aa;
  float glow = (1.0 - smoothstep(uThickness, glowR, lineDist)) * step(0.0001, uGlow);

  float elev = clamp(fv / (uMorphAmount * 2.5 + 0.001), 0.0, 1.0);

  vec3 lineCol;
  if (uColorMode < 0.5) {
    lineCol = elevationColor(elev);
  } else if (uColorMode < 1.5) {
    lineCol = uMid;
  } else {
    float parity = mod(floor(f), 2.0);
    lineCol = mix(uMid, uHigh, parity);
  }

  float coverage = clamp(mask + glow * 0.55, 0.0, 1.0);
  coverage = pow(coverage, max(uContrast, 0.001));

  vec3 outColor = lineCol;
  float outAlpha = coverage;

  if (uFillBands > 0.5) {
    vec3 fillCol = elevationColor(elev);
    float fillA = 0.1 * elev;
    outColor = mix(fillCol, lineCol, coverage);
    outAlpha = clamp(coverage + fillA, 0.0, 1.0);
  }

  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    outAlpha += (g - 0.5) * uGrainIntensity;
  }

  outColor *= uBrightness;
  outColor = clamp(outColor, 0.0, 1.0);

  float a = clamp(outAlpha, 0.0, 1.0) * uOpacity;
  if (uLightMode > 0.5) {
    float peak = max(outColor.r, max(outColor.g, outColor.b));
    vec3 chroma = pow(clamp(outColor / max(peak, 0.0001), 0.0, 1.0), vec3(1.18));
    fragColor = vec4(mix(vec3(1.0), chroma, a * 0.94), 1.0);
  } else {
    fragColor = vec4(outColor * a, a);
  }
}
`;


const CONTROL_INDICES = [
  [1, -2, 3, -4],
  [9, -8, 7, -6],
  [5, 2, 5, -5],
  [-1, -3, 8, 9],
];

export default function Topography() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uMorphAmount: { value: 3 },
        uBands: { value: 2 },
        uThickness: { value: 0.01 },
        uScale: { value: 2 },
        uPixelSize: { value: 1 },
        uGlow: { value: 0.5 },
        uColorMode: { value: 0 },
        uContrast: { value: 3 },
        uBrightness: { value: 1 },
        uFillBands: { value: 0 },
        uOpacity: { value: 1 },
        uLightMode: { value: 0 },
        uGrain: { value: 1 },
        uGrainIntensity: { value: 0.05 },
        uLow: { value: themeGray('--mono-600') },
        uMid: { value: themeGray('--mono-300') },
        uHigh: { value: themeGray('--mono-50') },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseEnabled: { value: 1 },
        uMouseRadius: { value: 0.3 },
        uMouseStrength: { value: 0.4 },
        uMouseActive: { value: 0 },
        uCtrlA: { value: new Float32Array(4) },
        uCtrlB: { value: new Float32Array(4) },
        uCtrlC: { value: new Float32Array(4) },
        uCtrlD: { value: new Float32Array(4) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const controls = [program.uniforms.uCtrlA.value, program.uniforms.uCtrlB.value, program.uniforms.uCtrlC.value, program.uniforms.uCtrlD.value] as Float32Array[];
    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      program.uniforms.iResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.iResolution.value[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const mouse = [0.5, 0.5];
    const target = [0.5, 0.5];
    let mouseActive = 0;
    let mouseTarget = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      mouseTarget = inside ? 1 : 0;
      if (inside) {
        target[0] = (event.clientX - rect.left) / rect.width;
        target[1] = 1 - (event.clientY - rect.top) / rect.height;
      }
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let frame = 0;
    let visible = true;
    const started = performance.now();
    const render = (now: number) => {
      const time = (now - started) * 0.001;
      program.uniforms.iTime.value = time;
      for (let g = 0; g < 4; g++) {
        for (let j = 0; j < 4; j++) {
          const i = CONTROL_INDICES[g][j];
          controls[g][j] = 3 * Math.sin(time * 0.35 * Math.sin(i * 0.05) + i);
        }
      }
      mouse[0] += 0.05 * (target[0] - mouse[0]);
      mouse[1] += 0.05 * (target[1] - mouse[1]);
      program.uniforms.uMouse.value[0] = mouse[0];
      program.uniforms.uMouse.value[1] = mouse[1];
      mouseActive += 0.05 * (mouseTarget - mouseActive);
      program.uniforms.uMouseActive.value = mouseActive;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(render);
    };
    const startOrStop = () => {
      if (visible && !document.hidden && frame === 0) frame = requestAnimationFrame(render);
      else if ((!visible || document.hidden) && frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      startOrStop();
    });
    observer.observe(container);
    document.addEventListener('visibilitychange', startOrStop);
    startOrStop();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', startOrStop);
      window.removeEventListener('pointermove', onPointerMove);
      canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" />;
}
