import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SideScenes Component
 * Dual-gutter Three.js scenes rendered through ONE shared WebGL canvas with scissor/viewport.
 * - Left Gutter: "Candidate Journey" (Wireframe icosahedron, spiraling orange helix nodes, pulsing ring)
 * - Right Gutter: "Hiring Network" (Constellation of talent & employers, traveling match pulse, rising market bars)
 * - Rendered strictly outside the 1280px container in gutters >= 140px.
 * - Hidden on mobile/tablet (<1024px) or narrow screens (gutter < 140px). Zero CPU overhead when hidden.
 */
export const SideScenes: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions & Gutter Calculation
    const CONTAINER_MAX_WIDTH = 1280;
    const MIN_GUTTER_WIDTH = 140;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let gutter = (width - CONTAINER_MAX_WIDTH) / 2;

    let isVisible = width >= 1024 && gutter >= MIN_GUTTER_WIDTH;

    // Set initial display
    canvas.style.display = isVisible ? 'block' : 'none';

    // If not visible on this screen size or gutter, do not create WebGL context
    if (!isVisible) return;

    // Test WebGL context availability before passing to Three.js
    const testGl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!testGl) {
      console.warn('WebGL context unavailable for SideScenes');
      return;
    }

    // Create Single WebGL Renderer
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
      renderer.setScissorTest(true);
    } catch (e) {
      console.warn('WebGL not supported for SideScenes:', e);
      return;
    }

    // Common Geometries & Materials (Reused)
    const sphereGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const orangeMaterial = new THREE.MeshStandardMaterial({
      color: 0xF25C2A,
      emissive: 0xC2410C,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.3,
    });
    const blueMaterial = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      emissive: 0x2563EB,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.3,
    });

    // ──────────────────────────────────────────────
    // 1. LEFT SCENE: "Candidate Journey"
    // ──────────────────────────────────────────────
    const leftScene = new THREE.Scene();
    const leftCamera = new THREE.PerspectiveCamera(45, Math.max(gutter, 1) / height, 0.1, 100);
    leftCamera.position.set(0, 0, 5.8);

    const leftAmbient = new THREE.AmbientLight(0xffffff, 1.0);
    const leftDirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    leftDirLight.position.set(2, 6, 5);
    leftScene.add(leftAmbient, leftDirLight);

    const leftGroup = new THREE.Group();
    leftScene.add(leftGroup);

    // Core Wireframe Icosahedron
    const icosaGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const icosaMat = new THREE.MeshBasicMaterial({
      color: 0xF25C2A,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const icosaMesh = new THREE.Mesh(icosaGeo, icosaMat);
    leftGroup.add(icosaMesh);

    // Inner Glowing Core Node
    const coreNodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const coreNodeMat = new THREE.MeshStandardMaterial({
      color: 0xF25C2A,
      emissive: 0xF25C2A,
      emissiveIntensity: 1.0,
    });
    const coreNodeMesh = new THREE.Mesh(coreNodeGeo, coreNodeMat);
    leftGroup.add(coreNodeMesh);

    // Vertical Helix of Candidate Skill Points (18 Nodes)
    const HELIX_NODE_COUNT = 18;
    const helixMesh = new THREE.InstancedMesh(sphereGeo, orangeMaterial, HELIX_NODE_COUNT);
    const dummy = new THREE.Object3D();
    const helixRadius = 0.52;
    const helixHeight = 3.8;

    const helixPoints: THREE.Vector3[] = [];
    for (let i = 0; i < HELIX_NODE_COUNT; i++) {
      const frac = i / (HELIX_NODE_COUNT - 1);
      const angle = frac * Math.PI * 4;
      const x = Math.cos(angle) * helixRadius;
      const y = (frac - 0.5) * helixHeight;
      const z = Math.sin(angle) * helixRadius;
      const pt = new THREE.Vector3(x, y, z);
      helixPoints.push(pt);

      dummy.position.copy(pt);
      dummy.scale.setScalar(0.9 + Math.sin(frac * Math.PI) * 0.35);
      dummy.updateMatrix();
      helixMesh.setMatrixAt(i, dummy.matrix);
    }
    helixMesh.instanceMatrix.needsUpdate = true;
    leftGroup.add(helixMesh);

    // Connecting Helix Line
    const helixLineGeo = new THREE.BufferGeometry().setFromPoints(helixPoints);
    const helixLineMat = new THREE.LineBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.5,
    });
    const helixLine = new THREE.Line(helixLineGeo, helixLineMat);
    leftGroup.add(helixLine);

    // Pulsing Ring (Horizon marker)
    const ringGeo = new THREE.RingGeometry(0.68, 0.72, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xF25C2A,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    leftGroup.add(ringMesh);

    // ──────────────────────────────────────────────
    // 2. RIGHT SCENE: "Hiring Network"
    // ──────────────────────────────────────────────
    const rightScene = new THREE.Scene();
    const rightCamera = new THREE.PerspectiveCamera(45, Math.max(gutter, 1) / height, 0.1, 100);
    rightCamera.position.set(0, 0, 5.8);

    const rightAmbient = new THREE.AmbientLight(0xffffff, 1.0);
    const rightDirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rightDirLight.position.set(-2, 6, 5);
    rightScene.add(rightAmbient, rightDirLight);

    const rightGroup = new THREE.Group();
    rightScene.add(rightGroup);

    // Constellation of Employers & Talent Nodes (14 Nodes)
    const NETWORK_NODE_COUNT = 14;
    const networkNodesMesh = new THREE.InstancedMesh(sphereGeo, blueMaterial, NETWORK_NODE_COUNT);
    const networkPoints: THREE.Vector3[] = [];

    // Deterministic cluster in a cylindrical space
    for (let i = 0; i < NETWORK_NODE_COUNT; i++) {
      const frac = i / NETWORK_NODE_COUNT;
      const angle = frac * Math.PI * 2 + (i % 3) * 0.8;
      const rad = 0.38 + ((i * 7) % 5) * 0.06;
      const x = Math.cos(angle) * rad;
      const y = ((i / NETWORK_NODE_COUNT) - 0.5) * 3.8;
      const z = Math.sin(angle) * rad;
      const pt = new THREE.Vector3(x, y, z);
      networkPoints.push(pt);

      dummy.position.copy(pt);
      dummy.scale.setScalar(i % 3 === 0 ? 1.3 : 0.95);
      dummy.updateMatrix();
      networkNodesMesh.setMatrixAt(i, dummy.matrix);
      // Alternating color highlights
      networkNodesMesh.setColorAt(
        i,
        i % 3 === 0 ? new THREE.Color(0xF25C2A) : i % 2 === 0 ? new THREE.Color(0x38BDF8) : new THREE.Color(0x2563EB)
      );
    }
    networkNodesMesh.instanceMatrix.needsUpdate = true;
    if (networkNodesMesh.instanceColor) networkNodesMesh.instanceColor.needsUpdate = true;
    rightGroup.add(networkNodesMesh);

    // Connecting Network Lines
    const networkLinePts: THREE.Vector3[] = [];
    for (let i = 0; i < networkPoints.length; i++) {
      const next1 = (i + 1) % networkPoints.length;
      networkLinePts.push(networkPoints[i], networkPoints[next1]);
      if (i % 2 === 0) {
        const next2 = (i + 3) % networkPoints.length;
        networkLinePts.push(networkPoints[i], networkPoints[next2]);
      }
    }
    const networkLineGeo = new THREE.BufferGeometry().setFromPoints(networkLinePts);
    const networkLineMat = new THREE.LineBasicMaterial({
      color: 0x2563EB,
      transparent: true,
      opacity: 0.45,
    });
    const networkLines = new THREE.LineSegments(networkLineGeo, networkLineMat);
    rightGroup.add(networkLines);

    // Traveling Match Pulse
    const pulseGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const pulseMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      emissive: 0x38BDF8,
      emissiveIntensity: 1.4,
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    rightGroup.add(pulseMesh);

    // Rising Market Growth Bar Shapes (4 Bars)
    const barHeights = [0.45, 0.7, 0.95, 1.25];
    const barsGroup = new THREE.Group();
    barsGroup.position.set(0, -1.8, 0.3);

    const barMeshes: THREE.Mesh[] = [];
    barHeights.forEach((h, idx) => {
      const bGeo = new THREE.BoxGeometry(0.08, h, 0.08);
      const bMat = new THREE.MeshStandardMaterial({
        color: idx === 3 ? 0xF25C2A : 0x38BDF8,
        emissive: idx === 3 ? 0xC2410C : 0x2563EB,
        emissiveIntensity: 0.7,
        roughness: 0.25,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set((idx - 1.5) * 0.18, h / 2, 0);
      barsGroup.add(bMesh);
      barMeshes.push(bMesh);
    });
    rightGroup.add(barsGroup);

    // ──────────────────────────────────────────────
    // 3. Scroll & Mouse Parallax System
    // ──────────────────────────────────────────────
    let targetScrollY = window.scrollY;
    let smoothScrollY = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      gutter = (width - CONTAINER_MAX_WIDTH) / 2;

      isVisible = width >= 1024 && gutter >= MIN_GUTTER_WIDTH;
      if (canvas) {
        canvas.style.display = isVisible ? 'block' : 'none';
      }

      if (renderer && isVisible) {
        renderer.setSize(width, height, false);
        const aspect = Math.max(gutter, 1) / height;
        leftCamera.aspect = aspect;
        leftCamera.updateProjectionMatrix();
        rightCamera.aspect = aspect;
        rightCamera.updateProjectionMatrix();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial resize setup
    onResize();

    // ──────────────────────────────────────────────
    // 4. Animation & Render Loop
    // ──────────────────────────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isTabVisible = !document.hidden;

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const renderFrame = () => {
      if (!renderer || !canvas) return;

      const elapsed = clock.getElapsedTime();

      // Smooth scroll lerp
      smoothScrollY += (targetScrollY - smoothScrollY) * 0.08;
      // Smooth mouse lerp
      smoothMouseX += (mouseX - smoothMouseX) * 0.05;
      smoothMouseY += (mouseY - smoothMouseY) * 0.05;

      const scrollOffset = smoothScrollY * 0.0025;

      // Update Left Scene ("Candidate Journey")
      leftGroup.rotation.y = elapsed * 0.2 + scrollOffset * 0.8 + smoothMouseX * 0.15;
      leftGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.1 + smoothMouseY * 0.1;
      icosaMesh.rotation.z = elapsed * 0.15;
      ringMesh.scale.setScalar(1 + Math.sin(elapsed * 1.8) * 0.08);

      // Update Right Scene ("Hiring Network")
      rightGroup.rotation.y = -elapsed * 0.18 - scrollOffset * 0.6 - smoothMouseX * 0.15;
      rightGroup.rotation.x = Math.cos(elapsed * 0.25) * 0.1 - smoothMouseY * 0.1;

      // Pulse traveling between nodes
      if (networkPoints.length > 0) {
        const pulseCycle = (elapsed * 0.6) % 1;
        const nodeIndexA = Math.floor(elapsed * 0.3) % networkPoints.length;
        const nodeIndexB = (nodeIndexA + 2) % networkPoints.length;
        if (networkPoints[nodeIndexA] && networkPoints[nodeIndexB]) {
          pulseMesh.position.lerpVectors(networkPoints[nodeIndexA], networkPoints[nodeIndexB], pulseCycle);
          pulseMesh.scale.setScalar(0.9 + Math.sin(pulseCycle * Math.PI) * 0.5);
        }
      }

      // Rising bars subtle wave
      barMeshes.forEach((bar, idx) => {
        bar.scale.y = 1 + Math.sin(elapsed * 2.2 + idx * 0.8) * 0.12;
      });

      // Render dual scissor viewports
      renderer.clear();

      const gWidth = Math.max(1, Math.floor(gutter));
      const gHeight = Math.max(1, Math.floor(height));

      // 1. Render Left Gutter
      renderer.setViewport(0, 0, gWidth, gHeight);
      renderer.setScissor(0, 0, gWidth, gHeight);
      renderer.render(leftScene, leftCamera);

      // 2. Render Right Gutter
      const rX = Math.max(0, Math.floor(width - gWidth));
      renderer.setViewport(rX, 0, gWidth, gHeight);
      renderer.setScissor(rX, 0, gWidth, gHeight);
      renderer.render(rightScene, rightCamera);
    };

    const animate = () => {
      try {
        if (isVisible && isTabVisible) {
          renderFrame();
        }
      } catch (err) {
        console.warn('SideScenes frame error:', err);
      }
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // If reduced motion, render single static frame
    if (prefersReducedMotion) {
      if (isVisible) renderFrame();
    } else {
      // Initialize gracefully with requestIdleCallback or setTimeout
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          animationFrameId = requestAnimationFrame(animate);
        });
      } else {
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(animate);
        }, 100);
      }
    }

    // ──────────────────────────────────────────────
    // 5. Cleanup & Disposal on Unmount
    // ──────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      sphereGeo.dispose();
      icosaGeo.dispose();
      coreNodeGeo.dispose();
      helixLineGeo.dispose();
      ringGeo.dispose();
      networkLineGeo.dispose();
      pulseGeo.dispose();

      orangeMaterial.dispose();
      blueMaterial.dispose();
      icosaMat.dispose();
      coreNodeMat.dispose();
      helixLineMat.dispose();
      ringMat.dispose();
      networkLineMat.dispose();
      pulseMat.dispose();

      barMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });

      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-500"
      aria-hidden="true"
      style={{
        maskImage:
          'linear-gradient(to right, black 0%, black calc((100vw - 1280px)/2 - 20px), transparent calc((100vw - 1280px)/2), transparent calc(100vw - (100vw - 1280px)/2), black calc(100vw - (100vw - 1280px)/2 + 20px), black 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, black 0%, black calc((100vw - 1280px)/2 - 20px), transparent calc((100vw - 1280px)/2), transparent calc(100vw - (100vw - 1280px)/2), black calc(100vw - (100vw - 1280px)/2 + 20px), black 100%)',
      }}
    />
  );
};
