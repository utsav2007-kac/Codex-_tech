/**
 * Adaptive Quality Governor for Smoothness Architecture
 * Decides data-motion="full | lite | off" based on:
 * - prefers-reduced-motion
 * - saveData
 * - hardwareConcurrency (< 4)
 * - deviceMemory (< 4 GB)
 * - Viewport width (< 768px starts in lite)
 * - Real-time frame time monitor over the first 60 frames
 * 
 * Rules:
 * - May downgrade mid-session if avg frame time > 20ms (< 50 FPS)
 * - NEVER upgrades automatically mid-session (prevents visual flicker)
 * - Supports manual toggle via footer with localStorage persistence
 */

export type MotionMode = 'full' | 'lite' | 'off';

type Listener = (mode: MotionMode) => void;

class QualityGovernor {
  private mode: MotionMode = 'full';
  private listeners: Set<Listener> = new Set();
  private isMonitoring = false;
  private frameTimes: number[] = [];
  private lastTime = 0;
  private frameCount = 0;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // 1. Check user manual override in localStorage
    try {
      const saved = localStorage.getItem('codex_motion_pref') as MotionMode | null;
      if (saved && (saved === 'full' || saved === 'lite' || saved === 'off')) {
        this.setMode(saved, false);
        return;
      }
    } catch {
      // Ignore localStorage security/sandbox errors
    }

    // 2. Hardware and device capability checks
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const nav = navigator as unknown as { deviceMemory?: number; connection?: { saveData?: boolean } };
    const memory = nav.deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 4;
    const saveData = nav.connection?.saveData || false;

    if (prefersReduced) {
      this.mode = 'off';
    } else if (saveData || memory < 4 || cores < 4) {
      this.mode = 'lite';
    } else if (isMobile) {
      this.mode = 'lite';
    } else {
      this.mode = 'full';
    }

    this.applyToDOM();

    // 3. Start frame time monitor during initial scroll if in 'full' mode
    if (this.mode === 'full') {
      this.startFrameMonitor();
    }
  }

  public getMode(): MotionMode {
    return this.mode;
  }

  public setMode(newMode: MotionMode, persist = true) {
    this.mode = newMode;
    if (persist) {
      try {
        localStorage.setItem('codex_motion_pref', newMode);
      } catch {
        // storage disabled or sandboxed
      }
    }
    this.applyToDOM();
    this.listeners.forEach((fn) => fn(this.mode));
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private applyToDOM() {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-motion', this.mode);
  }

  private startFrameMonitor() {
    if (this.isMonitoring || typeof window === 'undefined') return;
    this.isMonitoring = true;
    this.frameCount = 0;
    this.frameTimes = [];
    this.lastTime = performance.now();

    const monitorStep = (time: number) => {
      if (!this.isMonitoring) return;

      const delta = time - this.lastTime;
      this.lastTime = time;

      // Only count frames when user is actively scrolling or animating
      if (delta > 0 && delta < 100) {
        this.frameTimes.push(delta);
        this.frameCount++;
      }

      if (this.frameCount >= 60) {
        this.evaluatePerformance();
        return;
      }

      requestAnimationFrame(monitorStep);
    };

    requestAnimationFrame(monitorStep);
  }

  private evaluatePerformance() {
    this.isMonitoring = false;
    if (this.frameTimes.length === 0) return;

    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;

    // If avg frame time exceeds 20ms (< 50 FPS), downgrade to 'lite'
    if (avg > 20 && this.mode === 'full') {
      console.warn(`[QualityGovernor] Frame time average was ${avg.toFixed(2)}ms (>20ms). Downgrading to 'lite' motion.`);
      this.setMode('lite', false);
    }
  }
}

export const qualityGovernor = new QualityGovernor();
