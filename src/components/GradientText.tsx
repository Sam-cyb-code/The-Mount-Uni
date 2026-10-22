import React, { useEffect, useRef } from 'react';
import './GradientText.css';

export type GradientVariant = 'linear' | 'flow' | 'conic';
export type GradientDirection = 'horizontal' | 'vertical' | 'diagonal';

const VARIANTS: GradientVariant[] = ['linear', 'flow', 'conic'];
const ANGLES: Record<GradientDirection, number> = {
  horizontal: 90,
  vertical: 180,
  diagonal: 135,
};
const TAU = Math.PI * 2;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export interface GradientTextProps {
  children: React.ReactNode;
  colors?: string[];
  animationSpeed?: number;
  variant?: GradientVariant;
  angle?: number;
  direction?: GradientDirection;
  scale?: number;
  yoyo?: boolean;
  glow?: number;
  showBorder?: boolean;
  borderWidth?: number;
  pauseOnHover?: boolean;
  followPointer?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface Settings {
  colors: string[];
  speed: number;
  variant: GradientVariant;
  angle: number;
  scale: number;
  yoyo: boolean;
  pauseOnHover: boolean;
  followPointer: boolean;
}

interface AnimationState {
  time: number;
  inside: boolean;
  visible: boolean;
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  pull: number;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors = ['#2563EB', '#60A5FA', '#F59E0B'],
  animationSpeed = 8,
  variant = 'linear',
  angle = 90,
  direction,
  scale = 3,
  yoyo = true,
  glow = 0,
  showBorder = false,
  borderWidth = 1.5,
  pauseOnHover = false,
  followPointer = false,
  className = '',
  style,
}) => {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const settingsRef = useRef<Settings>({
    colors: colors.length > 1 ? colors : [colors[0] ?? '#ffffff', colors[0] ?? '#ffffff'],
    speed: Math.max(0.2, animationSpeed),
    variant: VARIANTS.includes(variant) ? variant : 'linear',
    angle: direction ? (ANGLES[direction] ?? angle) : angle,
    scale: clamp(scale, 1, 6),
    yoyo,
    pauseOnHover,
    followPointer,
  });
  const wakeRef = useRef<(() => void) | null>(null);

  const palette = colors.length > 1 ? colors : [colors[0] ?? '#ffffff', colors[0] ?? '#ffffff'];

  settingsRef.current = {
    colors: palette,
    speed: Math.max(0.2, animationSpeed),
    variant: VARIANTS.includes(variant) ? variant : 'linear',
    angle: direction ? (ANGLES[direction] ?? angle) : angle,
    scale: clamp(scale, 1, 6),
    yoyo,
    pauseOnHover,
    followPointer,
  };

  useEffect(() => {
    wakeRef.current?.();
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state: AnimationState = {
      time: 0,
      inside: false,
      visible: true,
      x: 0.5,
      y: 0.5,
      px: 0.5,
      py: 0.5,
      vx: 0,
      vy: 0,
      pull: 0,
    };
    let raf = 0;
    let last = 0;
    let alive = true;

    const paint = () => {
      const s = settingsRef.current;
      const list = s.colors;
      const cycle = state.time / s.speed;
      let image: string;

      if (s.variant === 'flow') {
        const blobs = list.map((color, i) => {
          const spin = cycle * TAU;
          const rate = 0.55 + ((i * 0.618) % 1) * 0.5;
          let x = 50 + 44 * Math.sin(spin * rate + i * 2.1);
          let y = 50 + 40 * Math.sin(spin * (rate * 0.83 + 0.21) + i * 1.3);
          if (i === 0) {
            x += (state.px * 100 - x) * state.pull;
            y += (state.py * 100 - y) * state.pull;
          }
          return `radial-gradient(ellipse ${(22 + 12 * s.scale).toFixed(1)}% ${(60 + 30 * s.scale).toFixed(1)}% at ${x.toFixed(2)}% ${y.toFixed(2)}%, ${color} 0%, transparent 100%)`;
        });
        image = `${blobs.join(', ')}, linear-gradient(${s.angle}deg, ${list.join(', ')})`;
      } else if (s.variant === 'conic') {
        const sway = s.yoyo ? Math.sin(cycle * Math.PI) * 50 : cycle * 360;
        const cx = 50 + (state.px * 100 - 50) * state.pull;
        const cy = 260 + (state.py * 100 - 260) * state.pull;
        image = `repeating-conic-gradient(from ${(sway - 30).toFixed(2)}deg at ${cx.toFixed(2)}% ${cy.toFixed(2)}%, ${[...list, list[0]].map((color, i) => `${color} ${((i / list.length) * 60 * (3 / s.scale)).toFixed(2)}deg`).join(', ')})`;
      } else {
        const loop = [...list, list[0]];
        const period = 100 * s.scale;
        let offset: number;
        if (s.yoyo) {
          const swing = cycle % 2;
          const t = swing < 1 ? swing : 2 - swing;
          offset = (0.5 - Math.cos(Math.PI * t) / 2) * (period - 100);
        } else {
          offset = (cycle % 1) * period;
        }
        offset += (state.px - 0.5) * period * 0.5 * state.pull;
        const stops = loop.map((color, i) => `${color} ${((i / (loop.length - 1)) * period - offset).toFixed(2)}%`);
        image = `repeating-linear-gradient(${s.angle}deg, ${stops.join(', ')})`;
      }

      root.style.setProperty('--gt-gradient', image);
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;

      if (!reduce && (!s.pauseOnHover || !state.inside)) {
        state.time += dt;
      }

      if (s.followPointer) {
        const targetPull = state.inside ? 1 : 0;
        state.pull += (targetPull - state.pull) * Math.min(1, dt * 6);
        state.vx += ((state.x - state.px) * 12 - state.vx * 4) * dt;
        state.vy += ((state.y - state.py) * 12 - state.vy * 4) * dt;
        state.px += state.vx * dt;
        state.py += state.vy * dt;
      } else {
        state.pull = 0;
      }

      paint();
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!raf && alive && state.visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        state.x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        state.y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
      }
    };

    const onPointerEnter = () => {
      state.inside = true;
      wake();
    };

    const onPointerLeave = () => {
      state.inside = false;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      } else {
        wake();
      }
    };

    const observer = new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
      if (state.visible) {
        wake();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });

    observer.observe(root);
    root.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerenter', onPointerEnter);
    root.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);

    paint();
    wake();

    wakeRef.current = () => {
      paint();
      wake();
    };

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      wakeRef.current = null;
      observer.disconnect();
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerenter', onPointerEnter);
      root.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <span
      ref={rootRef}
      className={`gradient-text ${showBorder ? 'gradient-text--border' : ''} ${className}`}
      style={{
        '--gt-glow': glow,
        '--gt-border-width': `${borderWidth}px`,
        ...style,
      } as React.CSSProperties}
    >
      {glow > 0 && (
        <span className="gradient-text__glow" aria-hidden="true">
          {children}
        </span>
      )}
      <span className="gradient-text__content">{children}</span>
    </span>
  );
};

export default GradientText;
