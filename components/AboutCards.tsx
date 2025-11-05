'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ServiceProps {
  title: string;
  description: string;
  index: number;
}

function ServiceItem({ title, description, index }: ServiceProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;

    gsap.fromTo(
      itemRef.current,
      {
        x: -50,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: itemRef.current,
          start: 'top 85%',
        },
        delay: index * 0.2,
      }
    );
  }, [index]);

  return (
    <motion.div
      ref={itemRef}
      className="relative pb-12 mb-12 last:mb-0 last:pb-0 border-b border-dark-bg/10 last:border-0"
    >
      {/* Title */}
      <motion.h3
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-bg mb-6 tracking-tight"
        whileHover={{ x: 10 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h3>

      {/* Decorative line */}
      <div className="w-24 h-1 bg-gradient-to-r from-electric-cyan to-deep-purple mb-6" />

      {/* Description */}
      <p className="text-xl md:text-2xl text-dark-bg/60 max-w-3xl leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export default function AboutCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    gsap.fromTo(
      titleRef.current,
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
          trigger: titleRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  const services = [
    {
      title: 'Ship in 2 Weeks',
      description:
        'From idea to live MVP in 14 days average. Production-ready. Period.',
    },
    {
      title: 'AI-First Development',
      description:
        '50% faster. Leveraging Claude, GPT-4, and battle-tested patterns.',
    },
    {
      title: 'Validated & Scalable',
      description:
        '10K+ users. Zero prototypes. Infrastructure that scales from day one.',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-deep-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-electric-cyan/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <motion.h2
          ref={titleRef}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-dark-bg mb-20"
        >
          What I Do
        </motion.h2>

        {/* Typography-First List */}
        <div className="max-w-5xl">
          {services.map((service, index) => (
            <ServiceItem key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
