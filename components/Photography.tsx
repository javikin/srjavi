'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Photography() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  useEffect(() => {
    if (!imageRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Image reveal
      gsap.fromTo(
        imageRef.current,
        {
          clipPath: 'inset(0% 100% 0% 0%)',
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 70%',
          },
        }
      );

      // Text animation
      gsap.fromTo(
        textRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="photography"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-off-white to-deep-purple/5" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            style={{ y, scale }}
            className="relative h-[600px] rounded-3xl overflow-hidden order-2 lg:order-1"
          >
            <div
              ref={imageRef}
              className="absolute inset-0 bg-gradient-to-br from-electric-cyan/20 via-deep-purple/20 to-electric-cyan/20"
            >
              {/* Placeholder - Replace with actual Carrillo Puerto photo */}
              <div className="w-full h-full bg-gradient-to-br from-deep-purple/30 via-electric-cyan/30 to-deep-purple/30 flex items-center justify-center relative overflow-hidden">
                {/* Abstract representation */}
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.3) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 80%, rgba(139, 61, 255, 0.3) 0%, transparent 50%)`,
                  }}
                />
                <span className="text-8xl font-bold opacity-10 z-10">Carrillo Puerto</span>
              </div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/50 via-transparent to-transparent" />

            {/* Photo info overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 text-white"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <p className="font-medium">Carrillo Puerto, Mexico</p>
                  <p className="text-sm text-white/70">Artistic Photography</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div ref={textRef} className="space-y-8 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-dark-bg mb-6">
                The Reality
              </h2>

              <div className="space-y-6 text-lg text-dark-bg/60 leading-relaxed">
                <p>
                  I live in a quiet pueblo in <span className="text-electric-cyan font-medium">Carrillo Puerto, Mexico</span>,
                  but build products for a global audience.
                </p>

                <p>
                  This balance keeps me grounded and focused. When I&apos;m not coding, you can find me
                  behind a camera shooting artistic portraits or in the gym powerbuilding.
                </p>

                <p>
                  The contrast between small-town life and building global tech products gives me a
                  unique perspective on what really matters in product development:{' '}
                  <span className="gradient-text font-medium">solving real problems for real people</span>.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                {[
                  { value: '🏋️', label: 'Powerbuilding' },
                  { value: '📷', label: 'Photography' },
                  { value: '🇲🇽', label: 'Carrillo Puerto' },
                  { value: '🌎', label: 'Global Reach' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-2xl glass"
                  >
                    <div className="text-4xl mb-2">{stat.value}</div>
                    <div className="text-sm text-dark-bg/60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
