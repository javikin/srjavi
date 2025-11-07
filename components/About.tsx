'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from '@/lib/i18n-context';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // Parallax effect for image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate text lines with stagger (Ashfall style)
      textRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(
            ref,
            {
              y: 100,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
              delay: index * 0.1,
              scrollTrigger: {
                trigger: ref,
                start: 'top 85%',
              },
            }
          );
        }
      });

      // Image reveal animation
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            clipPath: 'inset(100% 0% 0% 0%)',
            opacity: 0,
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1.5,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLParagraphElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      data-scroll-section
      className="relative py-32 pt-40 overflow-hidden bg-background"
    >
      {/* Fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none z-10" />
      {/* Subtle pastel orbs for depth (Jason Briscoe style) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-coral/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-mint/8 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-sky/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Asymmetric Grid Layout */}
        <div className="grid md:grid-cols-12 gap-12 items-start">

          {/* Left: Image - Takes 5 columns */}
          <motion.div
            ref={imageRef}
            style={{ y: imageY }}
            className="md:col-span-5 relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-text-primary/10 bg-surface"
          >
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-mint/5 via-transparent to-coral/5" />
            <Image
              src="/images/javi-profile.jpg"
              alt="Javi"
              fill
              className="object-cover"
              style={{
                objectPosition: 'center 0%',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
              }}
            />
          </motion.div>

          {/* Right: Content - Takes 7 columns */}
          <div className="md:col-span-7 space-y-8">

            {/* Title */}
            <h2
              ref={addToRefs}
              className="text-5xl md:text-6xl font-bold text-text-primary"
            >
              {t('title')}
            </h2>

            {/* Main paragraphs */}
            <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
              <p ref={addToRefs}>{t('p1')}</p>
              <p ref={addToRefs}>{t('p2')}</p>
              <p ref={addToRefs}>{t('p3')}</p>
            </div>

            {/* Closing / CTA */}
            <div className="space-y-4 pt-8 border-t border-gray-200">
              <p ref={addToRefs} className="text-lg text-text-secondary leading-relaxed">
                {t('closingP1')}
              </p>

              {/* Signature with Instagram handle inline */}
              <div className="pt-4">
                <p className="text-text-primary font-medium text-xl">
                  {t('signature')}{' '}
                  <a
                    href="https://instagram.com/srjavi.arw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-mint/80 transition-colors"
                  >
                    {t('instagramHandle')}
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
