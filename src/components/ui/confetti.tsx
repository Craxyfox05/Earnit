"use client";

import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';

interface ParticleType {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: string;
  vx: number;
  vy: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({ active, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particles = useRef<ParticleType[]>([]);

  const colors = ['#3B82F6', '#22C55E', '#FACC15', '#E879F9'];
  const shapes = ['circle', 'square', 'triangle'];

  const randomInt = useCallback((min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }, []);

  const createParticles = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    particles.current = [];

    for (let i = 0; i < 100; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      particles.current.push({
        x: canvas.width * 0.5,
        y: canvas.height * 0.5,
        size: randomInt(5, 12),
        color,
        shape,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 3,
        alpha: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
  }, [randomInt]);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: ParticleType) => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;

    if (particle.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (particle.shape === 'square') {
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
    } else if (particle.shape === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(0, -particle.size / 2);
      ctx.lineTo(particle.size / 2, particle.size / 2);
      ctx.lineTo(-particle.size / 2, particle.size / 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }, []);

  const animate = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allDone = true;

    for (let i = 0; i < particles.current.length; i++) {
      const p = particles.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Gravity
      p.alpha -= 0.01;
      p.rotation += p.rotationSpeed;

      if (p.alpha > 0) {
        allDone = false;
        drawParticle(ctx, p);
      }
    }

    if (allDone) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (onComplete) onComplete();
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [drawParticle, onComplete]);

  const startAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    createParticles();
    animationRef.current = requestAnimationFrame(animate);
  }, [animate, createParticles]);

  useEffect(() => {
    if (active) {
      startAnimation();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [active, startAnimation]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export { Confetti };
