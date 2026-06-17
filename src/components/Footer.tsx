'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-card-dark border-t border-brand-border-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="text-xl font-bold text-white tracking-tight flex items-center gap-0.5">
              Nafij<span className="text-brand-accent">.</span>
            </Link>
            <p className="text-xs text-brand-text-muted mt-2 max-w-xs leading-relaxed">
              Crafting premium digital products, frontend layout systems, and fast no-code architectures.
            </p>
          </div>

          {/* Site Map Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <Link href="/" className="text-brand-text hover:text-brand-accent transition-colors">Home</Link>
            <Link href="/about" className="text-brand-text hover:text-brand-accent transition-colors">About</Link>
            <Link href="/projects" className="text-brand-text hover:text-brand-accent transition-colors">Projects</Link>
            <Link href="/blog" className="text-brand-text hover:text-brand-accent transition-colors">Blog</Link>
            <Link href="/contact" className="text-brand-text hover:text-brand-accent transition-colors">Contact</Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-brand-card hover:bg-brand-accent/10 border border-brand-border-white hover:border-brand-accent text-brand-text-muted hover:text-brand-accent rounded-xl transition-all duration-300"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-brand-card hover:bg-brand-accent/10 border border-brand-border-white hover:border-brand-accent text-brand-text-muted hover:text-brand-accent rounded-xl transition-all duration-300"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-brand-card hover:bg-brand-accent/10 border border-brand-border-white hover:border-brand-accent text-brand-text-muted hover:text-brand-accent rounded-xl transition-all duration-300"
            >
              <Twitter className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>

        <div className="border-t border-brand-border-white mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-text-muted">
          <p>© {currentYear} Nafij. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-brand-accent fill-brand-accent animate-pulse" /> using Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
