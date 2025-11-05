'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface ProjectProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  index: number;
}

function ProjectCard({ title, description, image, tags, link, index }: ProjectProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  useEffect(() => {
    if (!cardRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
          },
        }
      );

      // Image reveal animation
      gsap.fromTo(
        imageRef.current,
        {
          clipPath: 'inset(100% 0% 0% 0%)',
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity }}
      className="group relative grid md:grid-cols-2 gap-8 items-center"
    >
      {/* Image */}
      <motion.div
        style={{ y: index % 2 === 0 ? y : undefined }}
        className={`relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden ${
          index % 2 === 0 ? 'md:order-1' : 'md:order-2'
        }`}
      >
        <div
          ref={imageRef}
          className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20"
        >
          {/* Placeholder for project image */}
          <div className="w-full h-full bg-gradient-to-br from-surface via-primary/10 to-surface flex items-center justify-center">
            <span className="text-6xl text-secondary opacity-30">{title[0]}</span>
          </div>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
          <motion.a
            href={link}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium"
          >
            View Project →
          </motion.a>
        </div>
      </motion.div>

      {/* Content */}
      <div className={`space-y-6 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium gradient-text">Project {index + 1}</span>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-text-primary"
        >
          {title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-lg text-text-secondary leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3"
        >
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full bg-surface border border-primary/30 text-sm font-medium text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function FeaturedWork() {
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

  const projects = [
    {
      title: 'Fit AI',
      description:
        'Personalized workout plans generated by AI. Built with Flutter, Claude AI, and Supabase. Shipped to production in 2 weeks with real user traction.',
      image: '/images/fit.jpg',
      tags: ['Flutter', 'Claude AI', 'Supabase', 'Fitness'],
      link: '#',
    },
    {
      title: 'Punto Blanco',
      description:
        'E-commerce platform with AI-powered product recommendations. Features real-time inventory, payment processing, and smart search functionality.',
      image: '/images/punto-blanco.jpg',
      tags: ['Next.js', 'AI', 'E-commerce', 'Stripe'],
      link: '#',
    },
  ];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <motion.h2
          ref={titleRef}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-20 text-center"
        >
          Featured Work
        </motion.h2>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <a
            href="#contact"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300"
          >
            Let&apos;s Build Your Next Project
          </a>
        </motion.div>
      </div>
    </section>
  );
}
