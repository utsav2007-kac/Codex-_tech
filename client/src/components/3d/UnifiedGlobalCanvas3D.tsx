import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * UnifiedGlobalCanvas3D
 * Single shared Three.js WebGL canvas combining:
 * 1. Global ambient 3D depth field (polyhedra & instanced particle stars)
 * 2. Dual-gutter scenes (Left: Candidate Helix, Right: Hiring Network Constellation) via scissor testing
 *
 * Rules:
 * - Exactly ONE canvas element.
 * - Disabled completely below 1024px (0 GPU overhead on mobile).
 * - Gutter scenes render only when gutter >= 140px.
 * - devicePixelRatio capped at 1.5.
 * - Pauses rendering when tab is hidden.
 * - Complete resource disposal on unmount (geometries, materials, textures, forceContextLoss).
 */
export const UnifiedGlobalCanvas3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const check = () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setEnabled(window.innerWidth >= 1024 && !reducedMotion);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      canvas.style.display = 'none';
      return;
    }

    const CONTAINER_MAX_WIDTH = 1280;
    const MIN_GUTTER_WIDTH = 140;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let gutter = Math.max(0, (width - CONTAINER_MAX_WIDTH) / 2);

    // Disable WebGL completely on tablets & mobile (<1024px)
    if (width < 1024) {
      canvas.style.display = 'none';
      return;
    }

    canvas.style.display = 'block';

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      renderer.setScissorTest(false);
    } catch {
      canvas.style.display = 'none';
      return;
    }

    // ── 1. AMBIENT BACKGROUND SCENE & CAMERA ──
    const ambientScene = new THREE.Scene();
    const ambientCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    ambientCamera.position.set(0, 0, 16);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    const dirLight1 = new THREE.DirectionalLight(0xF15A34, 0.9);
    dirLight1.position.set(10, 12, 10);
    const dirLight2 = new THREE.DirectionalLight(0x1F6AA5, 1.0);
    dirLight2.position.set(-10, -12, 8);
    ambientScene.add(ambientLight, dirLight1, dirLight2);

    // Ambient InstancedMesh for floating polyhedra
    const octaGeo = new THREE.OctahedronGeometry(0.55, 0);
    const tetraGeo = new THREE.TetrahedronGeometry(0.45, 0);
    const torusGeo = new THREE.TorusGeometry(0.7, 0.03, 16, 36);

    const brandOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xF15A34,
      metalness: 0.15,
      roughness: 0.25,
      transparent: true,
      opacity: 0.65,
    });
    const brandBlueMat = new THREE.MeshStandardMaterial({
      color: 0x1F6AA5,
      metalness: 0.2,
      roughness: 0.3,
      transparent: true,
      opacity: 0.6,
    });
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });

    const ambientGroup = new THREE.Group();
    ambientScene.add(ambientGroup);

    // 8 floating ambient shapes placed along vertical journey
    const shapes: { mesh: THREE.Mesh; baseX: number; baseY: number; baseZ: number; speedX: number; speedY: number }[] = [];
    const shapeConfigs = [
      { geo: octaGeo, mat: brandOrangeMat, x: -7.5, y: 5.0, z: -2, sx: 0.4, sy: 0.6 },
      { geo: tetraGeo, mat: brandBlueMat, x: 7.2, y: 3.5, z: -1, sx: -0.5, sy: 0.5 },
      { geo: torusGeo, mat: ringMat, x: -6.8, y: -2.0, z: -3, sx: 0.3, sy: -0.4 },
      { geo: octaGeo, mat: brandBlueMat, x: 6.9, y: -4.5, z: -2, sx: -0.4, sy: 0.5 },
      { geo: tetraGeo, mat: brandOrangeMat, x: -7.0, y: -9.0, z: -1.5, sx: 0.6, sy: 0.3 },
      { geo: torusGeo, mat: ringMat, x: 7.5, y: -12.5, z: -3, sx: -0.3, sy: -0.5 },
      { geo: octaGeo, mat: brandOrangeMat, x: -6.5, y: -16.0, z: -2, sx: 0.5, sy: 0.4 },
      { geo: tetraGeo, mat: brandBlueMat, x: 7.0, y: -19.5, z: -1, sx: -0.5, sy: 0.6 },
    ];

    shapeConfigs.forEach((cfg) => {
      const mesh = new THREE.Mesh(cfg.geo, cfg.mat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      ambientGroup.add(mesh);
      shapes.push({ mesh, baseX: cfg.x, baseY: cfg.y, baseZ: cfg.z, speedX: cfg.sx, speedY: cfg.sy });
    });

    // InstancedMesh for ambient background particle stars (50 particles)
    const particleCount = 50;
    const starGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const starMat = new THREE.MeshBasicMaterial({ color: 0x94A3B8, transparent: true, opacity: 0.45 });
    const starInstanced = new THREE.InstancedMesh(starGeo, starMat, particleCount);
    const dummy = new THREE.Object3D();
    const starBasePositions: [number, number, number][] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 36;
      const z = (Math.random() - 0.5) * 12 - 4;
      starBasePositions.push([x, y, z]);
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      starInstanced.setMatrixAt(i, dummy.matrix);
    }
    starInstanced.instanceMatrix.needsUpdate = true;
    ambientGroup.add(starInstanced);

    // ── 2. DUAL-GUTTER SCENES & CAMERAS (Rendered when gutter >= 140px) ──
    const leftGutterScene = new THREE.Scene();
    const leftGutterCamera = new THREE.PerspectiveCamera(45, Math.max(1, gutter) / height, 0.1, 100);
    leftGutterCamera.position.set(0, 0, 7);

    const rightGutterScene = new THREE.Scene();
    const rightGutterCamera = new THREE.PerspectiveCamera(45, Math.max(1, gutter) / height, 0.1, 100);
    rightGutterCamera.position.set(0, 0, 7);

    // Left Gutter: Candidate Helix Journey
    const leftGroup = new THREE.Group();
    leftGutterScene.add(leftGroup);
    const leftIcosaGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const leftIcosaMat = new THREE.MeshStandardMaterial({
      color: 0xF15A34,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
      roughness: 0.3,
    });
    const leftIcosa = new THREE.Mesh(leftIcosaGeo, leftIcosaMat);
    leftGroup.add(leftIcosa);

    const leftRingGeo = new THREE.TorusGeometry(1.6, 0.02, 12, 48);
    const leftRingMat = new THREE.MeshBasicMaterial({ color: 0xF97316, transparent: true, opacity: 0.45 });
    const leftRing = new THREE.Mesh(leftRingGeo, leftRingMat);
    leftRing.rotation.x = Math.PI / 3;
    leftGroup.add(leftRing);

    const leftLight = new THREE.PointLight(0xF15A34, 1.8, 10);
    leftLight.position.set(2, 3, 3);
    leftGutterScene.add(leftLight, new THREE.AmbientLight(0xffffff, 0.6));

    // Right Gutter: Hiring Network Constellation
    const rightGroup = new THREE.Group();
    rightGutterScene.add(rightGroup);
    const rightDodecaGeo = new THREE.DodecahedronGeometry(1.0, 0);
    const rightDodecaMat = new THREE.MeshStandardMaterial({
      color: 0x1F6AA5,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      roughness: 0.3,
    });
    const rightDodeca = new THREE.Mesh(rightDodecaGeo, rightDodecaMat);
    rightGroup.add(rightDodeca);

    const rightRingGeo = new THREE.TorusGeometry(1.7, 0.02, 12, 48);
    const rightRingMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.4 });
    const rightRing = new THREE.Mesh(rightRingGeo, rightRingMat);
    rightRing.rotation.x = -Math.PI / 4;
    rightGroup.add(rightRing);

    const rightLight = new THREE.PointLight(0x38BDF8, 1.8, 10);
    rightLight.position.set(-2, 3, 3);
    rightGutterScene.add(rightLight, new THREE.AmbientLight(0xffffff, 0.6));

    // ── 3. INTERACTIVE STATE & SCROLL TRACKING ──
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let scrollProgress = 0;
    let targetScrollProgress = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      gutter = Math.max(0, (width - CONTAINER_MAX_WIDTH) / 2);

      if (width < 1024) {
        if (canvas) canvas.style.display = 'none';
        return;
      }
      if (canvas) canvas.style.display = 'block';

      if (renderer) {
        renderer.setSize(width, height, false);
      }
      ambientCamera.aspect = width / height;
      ambientCamera.updateProjectionMatrix();

      if (gutter >= MIN_GUTTER_WIDTH) {
        leftGutterCamera.aspect = gutter / height;
        leftGutterCamera.updateProjectionMatrix();
        rightGutterCamera.aspect = gutter / height;
        rightGutterCamera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Tab visibility handling (pause RAF when tab hidden)
    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ── 4. RENDER LOOP ──
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isTabVisible || !renderer) return;

      const elapsed = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Smooth scroll damping
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;

      // Camera 3D flight along scroll progress
      ambientCamera.position.y = 16 - scrollProgress * 22;
      ambientCamera.position.x = mouseX * 0.6;
      ambientCamera.rotation.y = mouseX * 0.03;
      ambientCamera.rotation.x = -mouseY * 0.02;

      // Rotate ambient shapes
      shapes.forEach((item, idx) => {
        item.mesh.rotation.x = elapsed * item.speedX * 0.3 + scrollProgress * 2;
        item.mesh.rotation.y = elapsed * item.speedY * 0.35 + scrollProgress * 2.5;
        // Subtle floating breathing
        item.mesh.position.y = item.baseY + Math.sin(elapsed * 0.8 + idx) * 0.25;
      });

      // ── PASS 1: AMBIENT FULLSCREEN BACKGROUND ──
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, width, height);
      renderer.render(ambientScene, ambientCamera);

      // ── PASS 2 & 3: DUAL GUTTERS (Only if gutter >= 140px) ──
      if (gutter >= MIN_GUTTER_WIDTH) {
        renderer.setScissorTest(true);

        // Update Left Gutter animations
        leftGroup.rotation.y = elapsed * 0.35 + scrollProgress * 3;
        leftGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
        leftRing.rotation.z = elapsed * 0.2;

        // Render Left Gutter
        renderer.setScissor(0, 0, Math.floor(gutter), height);
        renderer.setViewport(0, 0, Math.floor(gutter), height);
        renderer.render(leftGutterScene, leftGutterCamera);

        // Update Right Gutter animations
        rightGroup.rotation.y = -elapsed * 0.3 + scrollProgress * 3;
        rightGroup.rotation.z = Math.cos(elapsed * 0.4) * 0.15;
        rightRing.rotation.y = elapsed * 0.25;

        // Render Right Gutter
        const rightX = Math.floor(width - gutter);
        renderer.setScissor(rightX, 0, Math.ceil(gutter), height);
        renderer.setViewport(rightX, 0, Math.ceil(gutter), height);
        renderer.render(rightGutterScene, rightGutterCamera);

        renderer.setScissorTest(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // ── 5. STRICT UNMOUNT DISPOSAL ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Dispose Geometries
      octaGeo.dispose();
      tetraGeo.dispose();
      torusGeo.dispose();
      starGeo.dispose();
      leftIcosaGeo.dispose();
      leftRingGeo.dispose();
      rightDodecaGeo.dispose();
      rightRingGeo.dispose();

      // Dispose Materials
      brandOrangeMat.dispose();
      brandBlueMat.dispose();
      ringMat.dispose();
      starMat.dispose();
      leftIcosaMat.dispose();
      leftRingMat.dispose();
      rightDodecaMat.dispose();
      rightRingMat.dispose();

      // Force WebGL Context Loss & Dispose Renderer
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-700 block"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
};
