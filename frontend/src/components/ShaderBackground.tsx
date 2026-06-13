"use client";

import { useEffect, useRef } from "react";

interface ShaderBackgroundProps {
  mode?: "home" | "dashboard";
  opacity?: number;
}

export default function ShaderBackground({ mode = "home", opacity = 0.6 }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    let animationFrameId: number;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsHome = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
        vec2 uv = v_texCoord;
        vec2 mouse = u_mouse / u_resolution;
        
        // Refined Emerald theme palette
        vec3 color1 = vec3(0.97, 0.98, 0.96); // #f8faf6
        vec3 color2 = vec3(0.92, 0.93, 0.92); // #eceeeb
        vec3 color3 = vec3(0.85, 0.88, 0.84); // #d8dbd7 with subtle green/gray tint
        
        float noise = sin(uv.x * 8.0 + u_time * 0.3 + mouse.x * 1.5) * cos(uv.y * 8.0 + u_time * 0.3 + mouse.y * 1.5);
        noise += sin(uv.x * 15.0 - u_time * 0.15) * cos(uv.y * 12.0 + u_time * 0.2) * 0.5;
        
        vec2 shift = (mouse - 0.5) * 0.12;
        float dist = length(uv - 0.5 - shift);
        
        vec3 finalColor = mix(color1, color2, noise * 0.4 + 0.5);
        finalColor = mix(finalColor, color3, pow(dist, 2.5) * 0.4);
        
        // Subtle vignette
        finalColor *= 1.0 - pow(length(uv - 0.5), 3.0) * 0.12;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const fsDashboard = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
        vec2 uv = v_texCoord;
        vec2 mouse = u_mouse / u_resolution;

        vec3 color1 = vec3(0.97, 0.98, 0.99); // Off-white
        vec3 color2 = vec3(0.94, 0.95, 0.97); // Soft gray
        vec3 color3 = vec3(0.90, 0.92, 0.95); // Deep soft blue-gray
        
        float noise = sin(uv.x * 10.0 + u_time * 0.4) * cos(uv.y * 10.0 + u_time * 0.4);
        noise += sin(uv.x * 20.0 - u_time * 0.15) * cos(uv.y * 15.0 + u_time * 0.2) * 0.5;
        
        vec2 shift = (mouse - 0.5) * 0.08;
        vec3 finalColor = mix(color1, color2, noise * 0.5 + 0.5);
        finalColor = mix(finalColor, color3, pow(length(uv - 0.5 - shift), 2.0) * 0.3);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const fs = mode === "home" ? fsHome : fsDashboard;

    function compileShader(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const resizeObserver = new ResizeObserver(() => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    });
    resizeObserver.observe(canvas);

    canvas.width = canvas.clientWidth || window.innerWidth;
    canvas.height = canvas.clientHeight || window.innerHeight;

    function render(timeMs: number) {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, timeMs * 0.001);
      if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
    };
  }, [mode]);

  return (
    <div 
      className="fixed inset-0 z-[-10] pointer-events-none transition-opacity duration-1000"
      style={{ opacity }}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background pointer-events-none" />
    </div>
  );
}
