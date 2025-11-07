'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from '@/lib/i18n-context';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

interface ProjectProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  index: number;
}

interface FeaturedWorkProps {
  showCTA?: boolean;
}

function ProjectCard({ title, description, image, tags, link, index }: ProjectProps) {
  const t = useTranslations('work');
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // Zoom effect for image (Jason Briscoe style)
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);

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
      className="project-card group relative grid md:grid-cols-2 gap-8 items-center"
    >
      {/* Image */}
      <motion.div
        style={{ y: index % 2 === 0 ? y : undefined }}
        className={`relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden ${
          index % 2 === 0 ? 'md:order-1' : 'md:order-2'
        }`}
      >
        <motion.div
          ref={imageRef}
          data-project-image
          style={{ scale }}
          className="absolute inset-0 w-full h-full"
        >
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              filter: 'grayscale(100%)',
              transition: 'filter 0.5s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.filter = 'grayscale(50%)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.filter = 'grayscale(100%)';
            }}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
          <motion.button
            onClick={(e) => {
              e.preventDefault();

              if (link.startsWith('/')) {
                // Store transition type in sessionStorage
                sessionStorage.setItem('pageTransition', 'overlay');

                // Navigate after small delay
                setTimeout(() => {
                  router.push(link);
                }, 50);
              } else {
                window.open(link, '_blank', 'noopener,noreferrer');
              }
            }}
            className="text-text-primary hover:text-text-secondary font-medium cursor-pointer transition-colors"
          >
            View Project →
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <div className={`space-y-6 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
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

        {/* View Project Link - Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="pt-4"
        >
          <button
            onClick={(e) => {
              e.preventDefault();

              if (link.startsWith('/')) {
                // Store transition type in sessionStorage
                sessionStorage.setItem('pageTransition', 'overlay');

                // Navigate after small delay
                setTimeout(() => {
                  router.push(link);
                }, 50);
              } else {
                window.open(link, '_blank', 'noopener,noreferrer');
              }
            }}
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-lg font-bold group cursor-pointer"
          >
            <span>View Project</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>

        {/* Visit App Link - Secondary - Only for paga.one */}
        {link === '/projects/paga-one' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="pt-2"
          >
            <a
              href="https://paga.one"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium group"
            >
              <span>Visit paga.one</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function FeaturedWork({ showCTA = false }: FeaturedWorkProps) {
  const t = useTranslations('work');
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
      title: 'paga.one',
      description:
        'Split restaurant bills and share banking info with a simple link. No more asking for CLABEs. Built with Next.js 15, React 19, and Supabase. Live in production.',
      image: '/images/projects/pagaone-mockup.jpg',
      tags: ['Next.js 15', 'React 19', 'Supabase', 'Payments', 'PWA'],
      link: '/projects/paga-one',
      transition: 'overlay', // Color overlay transition
    },
  ];

  return (
    <section
      id="work"
      ref={sectionRef}
      data-scroll-section
      className="relative py-32 overflow-hidden bg-surface"
    >
      {/* Fade from previous section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />

      {/* Subtle pastel orbs for depth */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-lavender/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky/8 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <motion.h2
          ref={titleRef}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-20 text-center"
        >
          {t('title')}
        </motion.h2>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} index={index} />
          ))}
        </div>

        {/* CTA - Only show if showCTA is true */}
        {showCTA && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <a
              href="#contact"
              className="inline-block text-text-secondary hover:text-text-primary font-medium transition-colors"
            >
              {t('cta')} →
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
