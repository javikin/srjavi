'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!quoteRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Quote animation
      gsap.fromTo(
        quoteRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 80%',
          },
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-background via-surface to-background"
    >
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '-2s' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-32">
        {/* Minimal Quote Section */}
        <motion.div
          ref={quoteRef}
          className="mb-32"
        >
          <div className="relative py-24 px-8 md:px-16 text-center">
            {/* Top line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* Quote */}
            <blockquote className="text-4xl md:text-5xl lg:text-7xl font-bold text-text-primary leading-tight max-w-5xl mx-auto">
              I don&apos;t build prototypes.
              <br />
              <span className="gradient-text">I ship production-ready MVPs.</span>
            </blockquote>

            {/* Subtitle info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-text-secondary"
            >
              <span>2 weeks avg delivery</span>
              <span className="hidden sm:block">·</span>
              <span>10K+ users</span>
              <span className="hidden sm:block">·</span>
              <span>YC experience</span>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#contact"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 text-center glow-purple"
              >
                Validate Your Idea
              </a>
              <a
                href="#work"
                className="px-8 py-4 rounded-full border-2 border-text-primary/20 text-text-primary font-medium hover:border-primary hover:text-primary transition-all duration-300 text-center"
              >
                See Work
              </a>
            </motion.div>

            {/* Bottom line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
        </motion.div>

        {/* Not Your Average Builder Section */}
        <div ref={contentRef} className="max-w-4xl mx-auto space-y-12">
          {/* Title */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Not Your Average Builder
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary" />
          </div>

          {/* Main content */}
          <div className="space-y-8 text-xl md:text-2xl text-text-secondary leading-relaxed">
            <p>
              No agencies. No middle-men. No bullshit.
              <br />
              Just me, AI tools, and a proven process.
            </p>

            <p>
              While agencies charge <span className="text-text-primary font-semibold">$50K</span> and take{' '}
              <span className="text-text-primary font-semibold">6 months</span>, I ship MVPs in{' '}
              <span className="gradient-text font-bold">2 weeks</span> at a fraction of the cost.
            </p>

            <p>
              The secret?{' '}
              <span className="text-text-primary font-semibold">AI-first development + senior-level experience.</span>
            </p>
          </div>

          {/* What You Get */}
          <div className="pt-8">
            <h3 className="text-2xl font-bold text-text-primary mb-6">What You Get</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Web & Mobile Apps', purpose: 'iOS, Android, and responsive web' },
                { name: 'CI/CD Configured', purpose: 'Automated deployments from day one' },
                { name: 'Dev Environment Ready', purpose: 'Continue development on your own' },
                { name: 'Full Documentation', purpose: 'Your language, your stack, your way' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-light/30 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-text-primary">{item.name}</div>
                    <div className="text-text-secondary text-base">{item.purpose}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom statement */}
          <div className="pt-8 border-t border-text-primary/10">
            <p className="text-2xl md:text-3xl font-bold text-text-primary">
              You get <span className="gradient-text">senior-level quality</span> at{' '}
              <span className="gradient-text">startup speed</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
