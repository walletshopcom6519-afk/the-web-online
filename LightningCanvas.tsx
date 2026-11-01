import React, { useEffect, useRef } from 'react';

export const LightningCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse coordinates tracking
    let mouse = { x: width / 2, y: height / 2, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Particle field
    const particleCount = isReducedMotion ? 20 : 60;
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Procedural Lightning Bolt Generator
    interface LightningBranch {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      alpha: number;
      thickness: number;
    }

    let activeBolts: LightningBranch[][] = [];
    let lastBoltTime = 0;

    const createLightningBolt = (startX: number, startY: number, endX: number, endY: number): LightningBranch[] => {
      const segments: LightningBranch[] = [];
      const steps = 12;
      let currX = startX;
      let currY = startY;

      const deltaX = (endX - startX) / steps;
      const deltaY = (endY - startY) / steps;

      for (let i = 0; i < steps; i++) {
        const nextX = i === steps - 1 ? endX : currX + deltaX + (Math.random() - 0.5) * 45;
        const nextY = i === steps - 1 ? endY : currY + deltaY + (Math.random() - 0.5) * 45;

        segments.push({
          startX: currX,
          startY: currY,
          endX: nextX,
          endY: nextY,
          alpha: 1.0,
          thickness: Math.random() * 2 + 1,
        });

        currX = nextX;
        currY = nextY;
      }
      return segments;
    };

    const render = (time: number) => {
      // Clear with soft trails
      ctx.fillStyle = 'rgba(4, 7, 17, 0.35)';
      ctx.fillRect(0, 0, width, height);

      // Render subtle energy grid mesh
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw floating energy particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle blue energy threads
        particles.forEach((other) => {
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 100) * 0.08})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Periodically trigger lightning arcs
      if (!isReducedMotion && time - lastBoltTime > 3200 + Math.random() * 4000) {
        lastBoltTime = time;
        const startX = Math.random() * width;
        const startY = 0;
        const endX = startX + (Math.random() - 0.5) * 300;
        const endY = height * (0.4 + Math.random() * 0.4);

        activeBolts.push(createLightningBolt(startX, startY, endX, endY));
      }

      // Render active lightning bolts
      activeBolts = activeBolts.filter((bolt) => {
        let alive = false;
        bolt.forEach((seg) => {
          seg.alpha -= 0.04;
          if (seg.alpha > 0) {
            alive = true;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f0ff';
            ctx.strokeStyle = `rgba(0, 240, 255, ${seg.alpha})`;
            ctx.lineWidth = seg.thickness;

            ctx.beginPath();
            ctx.moveTo(seg.startX, seg.startY);
            ctx.lineTo(seg.endX, seg.endY);
            ctx.stroke();

            // Core bright white inner stroke
            ctx.shadowBlur = 0;
            ctx.strokeStyle = `rgba(255, 255, 255, ${seg.alpha * 0.9})`;
            ctx.lineWidth = Math.max(1, seg.thickness * 0.4);
            ctx.beginPath();
            ctx.moveTo(seg.startX, seg.startY);
            ctx.lineTo(seg.endX, seg.endY);
            ctx.stroke();
          }
        });
        return alive;
      });

      // Mouse energetic field aura
      if (mouse.active && !isReducedMotion) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 5, mouse.x, mouse.y, 160);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
        gradient.addColorStop(0.5, 'rgba(0, 150, 255, 0.04)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(mouse.x - 160, mouse.y - 160, 320, 320);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
