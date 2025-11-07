'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function BarbaWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    if (typeof window === 'undefined') return;

    isInitialized.current = true;

    let barbaInstance: any = null;

    // Dynamic import to avoid SSR issues
    import('@barba/core').then(({ default: barba }) => {
      barbaInstance = barba;

      // Initialize Barba.js
      barba.init({
      transitions: [
        {
          name: 'default-transition',
          async leave(data) {
            const done = this.async();

            // Fade out current page
            await gsap.to(data.current.container, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.inOut',
            });

            done();
          },
          async enter(data) {
            // Scroll to top
            window.scrollTo(0, 0);

            // Fade in new page
            gsap.from(data.next.container, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.inOut',
            });
          },
        },
        {
          name: 'project-transition',
          from: {
            namespace: ['home'],
          },
          to: {
            namespace: ['project'],
          },
          async leave(data) {
            const done = this.async();

            // Check if there's a clicked project card
            const clickedCard = document.querySelector('.project-card.clicked');

            if (clickedCard) {
              const rect = clickedCard.getBoundingClientRect();

              // Create morphing overlay
              const overlay = document.createElement('div');
              overlay.style.cssText = `
                position: fixed;
                top: ${rect.top}px;
                left: ${rect.left}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                background: var(--color-background);
                z-index: 9999;
                border-radius: 24px;
                overflow: hidden;
              `;

              // Clone the image
              const img = clickedCard.querySelector('img');
              if (img) {
                const clonedImg = img.cloneNode(true) as HTMLElement;
                clonedImg.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
                overlay.appendChild(clonedImg);
              }

              document.body.appendChild(overlay);

              // Morph to fullscreen
              await gsap.to(overlay, {
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                borderRadius: 0,
                duration: 0.7,
                ease: 'power3.inOut',
              });

              // Fade out current content
              await gsap.to(data.current.container, {
                opacity: 0,
                duration: 0.3,
              });

              // Remove overlay after transition
              overlay.remove();
            } else {
              // Default fade out
              await gsap.to(data.current.container, {
                opacity: 0,
                duration: 0.3,
              });
            }

            done();
          },
          async enter(data) {
            window.scrollTo(0, 0);

            // Fade in new page
            gsap.from(data.next.container, {
              opacity: 0,
              duration: 0.5,
              ease: 'power2.inOut',
            });
          },
        },
      ],
      views: [
        {
          namespace: 'home',
          beforeEnter() {
            console.log('✅ Entering home view');
          },
        },
        {
          namespace: 'project',
          beforeEnter() {
            console.log('✅ Entering project view');
          },
        },
      ],
      prevent: ({ el }) => {
        // Prevent Barba on external links
        return el.classList.contains('no-barba') || el.getAttribute('target') === '_blank';
      },
    });

      console.log('✅ Barba.js initialized');
    });

    // Cleanup function for useEffect
    return () => {
      if (barbaInstance) {
        barbaInstance.destroy();
      }
    };
  }, []);

  return null;
}
