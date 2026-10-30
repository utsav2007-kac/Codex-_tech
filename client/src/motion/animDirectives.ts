import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qualityGovernor } from './qualityGovernor';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes all data-anim directives within the target container.
 * Every animation enforces the REVERSE RULE:
 * - Scrubbed animations move backwards naturally on scroll up.
 * - Entrance animations use toggleActions: "play none none reverse".
 * - Releases to transform: none at rest for 100% crisp typography.
 */
export function initAnimDirectives(container: HTMLElement | Document = document): () => void {
  const mode = qualityGovernor.getMode();
  if (mode === 'off') {
    // Reveal all elements in final state without animation
    const elements = container.querySelectorAll<HTMLElement>('[data-anim]');
    elements.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return () => {};
  }

  const isLite = mode === 'lite';
  const ctx = gsap.context(() => {
    // ── 1. TILT-IN (Section container enters tilted back, scrubbed) ──
    const tiltSections = container.querySelectorAll<HTMLElement>('[data-anim="tilt-in"]');
    tiltSections.forEach((sec) => {
      const parent = sec.parentElement || sec;
      parent.style.perspective = '1200px';

      const rotX = isLite ? 5 : 10;
      const transZ = isLite ? -40 : -80;
      const transY = isLite ? 30 : 60;
      const sc = isLite ? 0.98 : 0.96;

      gsap.fromTo(
        sec,
        {
          rotateX: rotX,
          translateZ: transZ,
          y: transY,
          scale: sc,
          opacity: 0.85,
        },
        {
          rotateX: 0,
          translateZ: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 95%',
            end: 'top 40%',
            scrub: 0.8,
            onLeave: () => {
              // Release to transform: none at rest for sharp text
              sec.style.transform = 'none';
            },
            onEnterBack: () => {
              sec.style.transform = '';
            },
          },
        }
      );
    });

    // ── 2. STAGE-RECEDE (Hero stage scales and rotates back as it scrolls away) ──
    const stageRecede = container.querySelectorAll<HTMLElement>('[data-anim="stage-recede"]');
    stageRecede.forEach((stage) => {
      gsap.to(stage, {
        scale: 0.94,
        rotateX: isLite ? 2 : 5,
        translateZ: isLite ? -35 : -70,
        opacity: 0.7,
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: 'bottom 15%',
          scrub: true,
        },
      });
    });

    // ── 3. RISE-STAGGER (Children rise with stagger, guaranteed zero-blank) ──
    const riseGroups = container.querySelectorAll<HTMLElement>('[data-anim="rise-stagger"]');
    riseGroups.forEach((group) => {
      const targets = group.children;
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        {
          y: 16,
          opacity: 0.4,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: group,
            start: 'top 96%',
            toggleActions: 'play none none none',
            once: true,
            fastScrollEnd: true,
          },
          onComplete: () => {
            gsap.set(targets, { clearProps: 'all' });
          },
        }
      );
    });

    // ── 4. SPLIT-LINES (Headings reveal line by line from 3D horizon) ──
    const splitHeadings = container.querySelectorAll<HTMLElement>('[data-anim="split-lines"]');
    splitHeadings.forEach((heading) => {
      const lines = heading.querySelectorAll<HTMLElement>('.split-line, [data-split-line]');
      const targets = lines.length > 0 ? lines : [heading];

      targets.forEach((target) => {
        // Ensure parent masks descenders safely without clipping
        target.style.lineHeight = target.style.lineHeight || '1.15';
        target.style.paddingBottom = '0.15em';
      });

      gsap.fromTo(
        targets,
        {
          y: '100%',
          rotateX: isLite ? 0 : -15,
          opacity: 0,
        },
        {
          y: '0%',
          rotateX: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 92%',
            toggleActions: 'play none none none',
            once: true,
          },
          onComplete: () => {
            gsap.set(targets, { clearProps: 'all' });
          },
        }
      );
    });

    // ── 5. FLIP-ROWS (List rows flip in with rotateX -20deg to 0 on stagger) ──
    const flipContainers = container.querySelectorAll<HTMLElement>('[data-anim="flip-rows"]');
    flipContainers.forEach((box) => {
      const queried = box.querySelectorAll<HTMLElement>('[data-row], .flip-row');
      const targets = queried.length > 0 ? queried : box.children;
      if (targets.length === 0) return;

      box.style.perspective = '1200px';

      gsap.fromTo(
        targets,
        {
          rotateX: isLite ? -8 : -18,
          y: 24,
          opacity: 0,
        },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: box,
            start: 'top 92%',
            toggleActions: 'play none none none',
            once: true,
            fastScrollEnd: true,
          },
          onComplete: () => {
            gsap.set(targets, { clearProps: 'all' });
          },
        }
      );
    });

    // ── 6. DRAW (SVG strokes draw & progress bars scrubbed with scroll) ──
    const drawElements = container.querySelectorAll<SVGPathElement | HTMLElement>('[data-anim="draw"]');
    drawElements.forEach((el) => {
      if (el instanceof SVGPathElement) {
        const length = el.getTotalLength?.() || 1000;
        el.style.strokeDasharray = `${length}`;
        el.style.strokeDashoffset = `${length}`;

        gsap.to(el, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('svg') || el,
            start: 'top 85%',
            end: 'bottom 40%',
            scrub: 0.8,
          },
        });
      } else {
        // HTMLElement bar / width scale
        gsap.fromTo(
          el,
          { width: '0%', scaleX: 0 },
          {
            width: el.getAttribute('data-target-width') || '100%',
            scaleX: 1,
            ease: 'none',
            transformOrigin: 'left center',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 45%',
              scrub: 0.6,
            },
          }
        );
      }
    });

    // ── 7. COUNTER (Tabular-nums odometer counter tied to scroll, counts back down on scroll up) ──
    const counters = container.querySelectorAll<HTMLElement>('[data-anim="counter"]');
    counters.forEach((counter) => {
      // Safety guard: never overwrite rich container trees
      if (counter.children.length > 0 && !counter.hasAttribute('data-count-to')) return;

      const rawTarget = counter.getAttribute('data-count-to') || counter.textContent || '0';
      const cleanNum = parseFloat(rawTarget.replace(/[^0-9.]/g, '')) || 0;
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';

      const obj = { val: 0 };
      gsap.to(obj, {
        val: cleanNum,
        ease: 'none',
        scrollTrigger: {
          trigger: counter,
          start: 'top 92%',
          end: 'top 55%',
          scrub: true,
          onUpdate: () => {
            const currentFormatted = cleanNum % 1 === 0 ? Math.round(obj.val) : obj.val.toFixed(1);
            counter.textContent = `${prefix}${currentFormatted}${suffix}`;
          },
        },
      });
    });

    // ── 8. PARALLAX (data-speed layers: 0.2x, 0.5x, 1x, 1.3x) ──
    const parallaxLayers = container.querySelectorAll<HTMLElement>('[data-anim="parallax"], [data-speed]');
    parallaxLayers.forEach((layer) => {
      const speed = parseFloat(layer.getAttribute('data-speed') || '0.5');
      const deltaY = (1 - speed) * 160;

      gsap.fromTo(
        layer,
        { y: -deltaY * 0.5 },
        {
          y: deltaY * 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.closest('section') || layer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    // ── 9. DEPTH-IN (Panels come forward with translateZ and slight rotateY alternating) ──
    const depthItems = container.querySelectorAll<HTMLElement>('[data-anim="depth-in"]');
    depthItems.forEach((item, idx) => {
      const sign = idx % 2 === 0 ? 1 : -1;
      const rotY = isLite ? 0 : sign * 6;
      const transZ = isLite ? -20 : -60;

      const parent = item.parentElement;
      if (parent) parent.style.perspective = '1200px';

      gsap.fromTo(
        item,
        {
          translateZ: transZ,
          rotateY: rotY,
          opacity: 0,
          scale: 0.96,
        },
        {
          translateZ: 0,
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
          onComplete: () => {
            gsap.set(item, { clearProps: 'all' });
          },
        }
      );
    });

    // ── 10. MAGNETIC (Buttons react to cursor with gsap.quickTo; fine pointers only) ──
    if (window.matchMedia('(pointer: fine)').matches && !isLite) {
      const magnets = container.querySelectorAll<HTMLElement>('[data-anim="magnetic"]');
      magnets.forEach((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

        const onMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const strength = parseFloat(el.getAttribute('data-strength') || '0.3');
          xTo((e.clientX - cx) * strength);
          yTo((e.clientY - cy) * strength);
        };

        const onMouseLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    }

    // ── 11. TILT-HOVER (Cards react to cursor with glare through CSS vars) ──
    if (window.matchMedia('(pointer: fine)').matches && !isLite) {
      const tiltCards = container.querySelectorAll<HTMLElement>('[data-anim="tilt-hover"]');
      tiltCards.forEach((card) => {
        const onMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const maxTilt = parseFloat(card.getAttribute('data-max-tilt') || '4');

          const rotX = ((y - cy) / cy) * -maxTilt;
          const rotY = ((x - cx) / cx) * maxTilt;

          card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(12px)`;
          card.style.setProperty('--glare-x', `${((x / rect.width) * 100).toFixed(1)}%`);
          card.style.setProperty('--glare-y', `${((y / rect.height) * 100).toFixed(1)}%`);
          card.style.setProperty('--glare-opacity', '0.2');
        };

        const onMouseLeave = () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
          card.style.setProperty('--glare-opacity', '0');
        };

        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);
      });
    }
  }, container);

  return () => ctx.revert();
}
