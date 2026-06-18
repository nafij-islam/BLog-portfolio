'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Compass, Star, Code, ShoppingBag, Layers, Zap, Calendar, Clock, ThumbsUp, MessageSquare } from 'lucide-react';
import { mockDb } from '@/data/mockDb';
import { Project, Skill, Service, Experience, Testimonial, BlogPost } from '@/data/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';
import SkillCard from '@/components/SkillCard';
import ProjectCard from '@/components/ProjectCard';
import ExperienceCard from '@/components/ExperienceCard';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';
import OptimizedImage from '@/components/OptimizedImage';

export default function HomePage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [featuredBlog, setFeaturedBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Fetch static mock lists
    setSkills(mockDb.getSkills());
    setExperience(mockDb.getExperience());
    setServices(mockDb.getServices());
    setTestimonials(mockDb.getTestimonials());

    // Fetch dynamic backend APIs
    const fetchDynamicData = async () => {
      try {
        const projRes = await fetch('/api/projects/featured');
        if (projRes.ok) {
          const projJson = await projRes.json();
          if (projJson.success && projJson.data) {
            setProjects(projJson.data.slice(0, 3));
          }
        }

        const settingsRes = await fetch('/api/admin/settings');
        if (settingsRes.ok) {
          const settingsJson = await settingsRes.json();
          if (settingsJson.success && settingsJson.data) {
            setSiteSettings(settingsJson.data);
          }
        }

        const blogRes = await fetch('/api/blogs/featured');
        if (blogRes.ok) {
          const blogJson = await blogRes.json();
          if (blogJson.success && blogJson.data && blogJson.data.length > 0) {
            setFeaturedBlog(blogJson.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dynamic homepage data:', err);
      }
    };
    fetchDynamicData();
  }, []);

  const heroTitle = siteSettings?.heroTitle || "Hi, I’m Nafij";
  const heroSubtitle = siteSettings?.heroSubtitle || "I Build Digital Experiences";
  const heroIntro = siteSettings?.heroIntro || "I am a frontend developer and no-code architect specializing in building clean, high-performance, and pixel-perfect applications.";

  return (
    <>
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
        {/* Background glow animations */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text details */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/10 border border-brand-accent/25 rounded-full text-xs font-semibold text-brand-accent mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
              {siteSettings?.availability || "Available for new projects"}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              {heroTitle}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-orange-400 to-amber-500 text-glow mt-2">
                {heroSubtitle}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-brand-text-muted mt-6 max-w-xl leading-relaxed"
            >
              {heroIntro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Link href="/projects">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View My Work
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" leftIcon={<Mail className="w-4 h-4" />}>
                  Get In Touch
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right side Floating Tech Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Main Visual Profile Glow Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-72 h-72 md:w-85 md:h-85 rounded-3xl bg-gradient-to-tr from-brand-card to-brand-card-light p-1 border border-brand-accent/25 glow-accent flex items-center justify-center overflow-hidden"
            >
              {/* Inner glowing core */}
              <div className="absolute inset-0 bg-radial-gradient from-brand-accent/20 to-transparent pointer-events-none" />
              <OptimizedImage
                src="/nafij-islam.jpg"
                alt="Nafij Islam"
                fill
                sizes="(max-width: 768px) 100vw, 385px"
                className="object-cover rounded-2xl relative z-10"
              />
            </motion.div>

            {/* Floating technology cards */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute -top-4 -left-4 md:-top-6 bg-brand-card/90 backdrop-blur border border-brand-border px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2"
            >
              <div className="p-1.5 bg-brand-accent/15 rounded-lg text-brand-accent">
                <Code className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] text-brand-text-muted leading-none">Frontend</p>
                <p className="text-xs font-bold text-white mt-0.5">Next.js & React</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-6 -right-6 bg-brand-card/90 backdrop-blur border border-brand-border px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2"
            >
              <div className="p-1.5 bg-blue-500/15 rounded-lg text-blue-400">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] text-brand-text-muted leading-none">No-Code App</p>
                <p className="text-xs font-bold text-white mt-0.5">Bubble.io Expert</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -left-6 bg-brand-card/90 backdrop-blur border border-brand-border px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2"
            >
              <div className="p-1.5 bg-green-500/15 rounded-lg text-green-400">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] text-brand-text-muted leading-none">E-Commerce</p>
                <p className="text-xs font-bold text-white mt-0.5">Shopify Dev</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="py-20 bg-brand-card-dark/45 border-y border-brand-border-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeading
            badge="My Services"
            title="What I Offer"
            subtitle="I specialize in translating vision to modular code, crafting layouts that score perfectly across SEO and performance audits."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SKILLS & TECHNOLOGIES SECTION */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeading
            badge="Skills & Stack"
            title="Expertise & Technologies"
            subtitle="Providing pixel-perfect layouts, responsive frontends, and dynamic visual application structures."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, idx) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <SkillCard skill={skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS SECTION */}
      <section className="py-20 bg-brand-card-dark/45 border-y border-brand-border-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeading
            badge="My Works"
            title="Featured Projects"
            subtitle="Explore some of my recently completed systems, custom Shopify integrations, and Bubble SaaS builder platforms."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects">
              <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED BLOG SECTION */}
      {featuredBlog && (
        <section className="py-20 bg-brand-bg relative overflow-hidden">
          {/* Radial glow effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
            <SectionHeading
              badge="Hot Off The Press"
              title="Featured Publication"
              subtitle="Read my most popular article detailing implementation steps, engineering architecture, and tech stack details."
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden bg-brand-card border-2 border-brand-accent/20 hover:border-brand-accent/40 transition-all duration-500 shadow-2xl p-6 md:p-8 lg:p-10 group text-left"
            >
              {/* Subtle hover orange border glow */}
              <div className="absolute inset-0 border border-brand-accent/0 group-hover:border-brand-accent/20 rounded-3xl transition-colors duration-500 pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Image panel */}
                <div className="lg:col-span-5 aspect-video w-full rounded-2xl overflow-hidden border border-brand-border-white shadow-md relative bg-brand-card-dark">
                  <OptimizedImage
                    src={
                      featuredBlog.image || (
                        featuredBlog.category === 'Frontend' ? 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80' :
                        featuredBlog.category === 'Shopify' ? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' :
                        featuredBlog.category === 'Bubble.io' ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80' :
                        featuredBlog.category === 'SEO' ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' :
                        'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80'
                      )
                    }
                    alt={featuredBlog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-brand-bg/95 border border-brand-accent/40 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-brand-accent uppercase tracking-wider">
                    {featuredBlog.category}
                  </span>
                </div>

                {/* Info details panel */}
                <div className="lg:col-span-7 flex flex-col justify-center h-full">
                  <div className="flex items-center gap-4 text-[10px] text-brand-text-muted mb-4 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                      {featuredBlog.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-accent" />
                      {featuredBlog.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3 tracking-tight group-hover:text-brand-accent transition-colors duration-300">
                    <Link href={`/blog/${featuredBlog.id}`}>{featuredBlog.title}</Link>
                  </h3>

                  <p className="text-xs md:text-sm text-brand-text-muted mb-6 leading-relaxed">
                    {featuredBlog.excerpt}
                  </p>

                  {/* Metrics and Author and Link */}
                  <div className="flex flex-wrap gap-4 items-center justify-between pt-5 border-t border-brand-border-white mt-auto">
                    {/* Author details */}
                    <div className="flex items-center gap-3">
                      <img src={featuredBlog.author.avatar} alt={featuredBlog.author.name} className="w-8 h-8 rounded-full object-cover border border-brand-border-white" />
                      <div>
                        <p className="text-xs font-bold text-white leading-none">{featuredBlog.author.name}</p>
                        <p className="text-[9px] text-brand-text-muted mt-0.5">{featuredBlog.author.role}</p>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4 text-xs text-brand-text-muted font-bold">
                        <span className="flex items-center gap-1.5 hover:text-brand-accent transition-colors">
                          <ThumbsUp className="w-4 h-4 text-brand-accent/80" />
                          {featuredBlog.likes}
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-brand-accent transition-colors">
                          <MessageSquare className="w-4 h-4 text-brand-accent/80" />
                          {featuredBlog.commentsCount}
                        </span>
                      </div>

                      <Link href={`/blog/${featuredBlog.id}`}>
                        <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          Read Article
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 5. EXPERIENCE SECTION */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeading
            badge="Career Timeline"
            title="Professional Experience"
            subtitle="My path as a frontend developer, commerce engineer, and no-code architect."
          />

          <div className="max-w-4xl mx-auto space-y-6">
            {experience.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <ExperienceCard experience={exp} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-20 bg-brand-card-dark/45 border-y border-brand-border-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeading
            badge="Client Feedback"
            title="What Clients Say"
            subtitle="Here is what founders, product managers, and agency team leads say about collaborating with me."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <TestimonialCard testimonial={test} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA SECTION */}
      <section className="py-24 relative overflow-hidden text-center">
        {/* Background particle glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-accent/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-6"
          >
            Let's Build Something Amazing Together
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-brand-text-muted mb-8 leading-relaxed"
          >
            Whether you need a custom Next.js frontend, a Shopify conversion layout boost, or a rapid Bubble.io app prototype, I am ready to help scale your project.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/contact">
              <Button variant="primary" size="lg" rightIcon={<Mail className="w-4 h-4" />}>
                Contact Me Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
