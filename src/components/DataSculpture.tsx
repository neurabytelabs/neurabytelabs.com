import React, { useEffect, useRef } from 'react';

export default function DataSculpture({ systemState }: { systemState: 'IDLE' | 'PROCESSING' | 'RESPONDING' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: any[] = [];
    const particleCount = 2000; // Dense particle field for Anadol effect

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: Math.random() * 1.2 + 0.3,
        color: Math.random() > 0.95 ? '#00FFAA' : 'rgba(237, 237, 237, 0.4)',
        offset: Math.random() * 100
      });
    }

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      // Speed up flow field when processing
      const timeIncrement = systemState === 'PROCESSING' ? 0.015 : 0.002;
      time += timeIncrement;

      // Trail effect (Void color with low opacity)
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        // Complex flow field using sine/cosine to mimic Perlin noise
        const angle = Math.sin(p.x * 0.001 + time) * Math.PI * 2 + 
                      Math.cos(p.y * 0.002 + time + p.offset) * Math.PI;
        
        const speed = systemState === 'PROCESSING' ? 4 : 0.8;
        
        // Add some turbulence when responding
        const turbulence = systemState === 'RESPONDING' ? Math.sin(time * 10 + p.offset) * 2 : 0;

        p.vx = Math.cos(angle) * speed + turbulence;
        p.vy = Math.sin(angle) * speed + turbulence;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around seamlessly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [systemState]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen transition-opacity duration-1000" 
      aria-hidden="true"
    />
  );
}
