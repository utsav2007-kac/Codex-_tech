import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * GlobalScrollCanvas3D
 * Ambient 3D floating depth environment for all pages with 100% reversible scroll responsiveness.
 * Meshes glide, rotate, and parallax in 3D depth as you scroll down and smoothly reverse when scrolling up.
 */
export const GlobalScrollCanvas3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      const testGl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!testGl) return;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    // Subtle soft ambient & directional lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    const dirLight1 = new THREE.DirectionalLight(0xF15A34, 1.0);
    dirLight1.position.set(10, 12, 10);
    const dirLight2 = new THREE.DirectionalLight(0x1F6AA5, 1.2);
    dirLight2.position.set(-10, -12, 8);
    scene.add(ambientLight, dirLight1, dirLight2);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Floating 3D Octahedrons & Polyhedra
    const octaGeo = new THREE.OctahedronGeometry(0.65, 0);
    const tetraGeo = new THREE.TetrahedronGeometry(0.55, 0);
    const torusGeo = new THREE.TorusGeometry(0.8, 0.04, 16, 48);

    const brandOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xF15A34,
      emissive: 0xC2410C,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.4,
      transparent: true,
      opacity: 0.45,
    });

    const brandBlueMat = new THREE.MeshStandardMaterial({
      color: 0x1F6AA5,
      emissive: 0x1E40AF,
      emissiveIntensity: 0.3,
      roughness: 0.25,
      metalness: 0.5,
      transparent: true,
      opacity: 0.45,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    interface FloatingObject {
      mesh: THREE.Object3D;
      baseX: number;
      baseY: number;
      baseZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      scrollFactor: number;
    }

    const floatingObjects: FloatingObject[] = [];

    // Deterministic placement across screen depth
    const itemsConfig = [
      { geo: octaGeo, mat: brandOrangeMat, x: -7.5, y: 3.5, z: -3, sf: 0.0035 },
      { geo: tetraGeo, mat: brandBlueMat, x: 7.2, y: 2.0, z: -2, sf: 0.004 },
      { geo: torusGeo, mat: wireMat, x: -6.8, y: -4.0, z: -1, sf: 0.0028 },
      { geo: octaGeo, mat: brandBlueMat, x: 8.0, y: -3.5, z: -4, sf: 0.0032 },
      { geo: tetraGeo, mat: brandOrangeMat, x: -8.5, y: 8.0, z: -5, sf: 0.0045 },
      { geo: torusGeo, mat: wireMat, x: 7.8, y: 9.0, z: -3, sf: 0.003 },
      { geo: octaGeo, mat: wireMat, x: -5.5, y: -9.5, z: -4, sf: 0.0038 },
      { geo: tetraGeo, mat: brandBlueMat, x: 6.5, y: -10.0, z: -2, sf: 0.0042 },
    ];

    itemsConfig.forEach((cfg) => {
      const mesh = new THREE.Mesh(cfg.geo, cfg.mat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      worldGroup.add(mesh);

      floatingObjects.push({
        mesh,
        baseX: cfg.x,
        baseY: cfg.y,
        baseZ: cfg.z,
        rotSpeedX: 0.4 + Math.random() * 0.4,
        rotSpeedY: 0.5 + Math.random() * 0.4,
        rotSpeedZ: 0.3 + Math.random() * 0.3,
        scrollFactor: cfg.sf,
      });
    });

    // 2. Talent Constellation Starfield Points
    const PARTICLE_COUNT = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const basePositions: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 26;
      const y = (Math.random() - 0.5) * 36;
      const z = (Math.random() - 0.5) * 12 - 2;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePositions.push({ x, y, z });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x94A3B8,
      transparent: true,
      opacity: 0.35,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particles);

    // Scroll & Mouse Tracking (Smooth Bidirectional Lerping)
    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (renderer) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = !document.hidden;

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (!renderer || !canvas) return;

      const elapsed = clock.getElapsedTime();

      // Smooth lerp (responds smoothly in BOTH scroll down and scroll up directions)
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const scrollDelta = currentScrollY;

      // Group rotation and slight camera parallax
      worldGroup.rotation.y = Math.sin(elapsed * 0.15) * 0.05 + currentMouseX * 0.06;
      worldGroup.rotation.x = Math.cos(elapsed * 0.12) * 0.04 - currentMouseY * 0.05;

      // Animate floating items (bidirectional: shifts with scrollDelta, returns when scrolling back up)
      floatingObjects.forEach((item, idx) => {
        // Continuous idle spin
        item.mesh.rotation.x = elapsed * item.rotSpeedX * 0.4 + scrollDelta * 0.0015;
        item.mesh.rotation.y = elapsed * item.rotSpeedY * 0.4 + scrollDelta * 0.002;
        item.mesh.rotation.z = elapsed * item.rotSpeedZ * 0.3;

        // Position responds directly to scroll height (moves vertically with subtle depth parallax)
        const verticalShift = ((scrollDelta * item.scrollFactor) % 18);
        item.mesh.position.y = item.baseY + Math.sin(elapsed * 0.8 + idx) * 0.35 + verticalShift * 0.3;
        item.mesh.position.z = item.baseZ + Math.cos(elapsed * 0.6 + idx) * 0.2;
      });

      // Subtle particle float
      particles.rotation.y = elapsed * 0.02 + scrollDelta * 0.0004;
      particles.position.y = -((scrollDelta * 0.003) % 10);

      renderer.render(scene, camera);
    };

    const animateLoop = () => {
      if (isVisible) {
        render();
      }
      animationFrameId = requestAnimationFrame(animateLoop);
    };

    animationFrameId = requestAnimationFrame(animateLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);

      octaGeo.dispose();
      tetraGeo.dispose();
      torusGeo.dispose();
      particleGeo.dispose();

      brandOrangeMat.dispose();
      brandBlueMat.dispose();
      wireMat.dispose();
      particleMat.dispose();

      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
