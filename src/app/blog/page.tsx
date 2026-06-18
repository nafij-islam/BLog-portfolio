'use client';

import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { mockDb } from '@/data/mockDb';
import { BlogPost } from '@/data/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import SectionHeading from '@/components/SectionHeading';
import EmptyState from '@/components/EmptyState';

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Frontend' | 'Shopify' | 'Bubble.io' | 'SEO' | 'UI/UX'>('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.blogs) {
            setBlogs(json.data.blogs);
            setFilteredBlogs(json.data.blogs);
          }
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      }
    };
    fetchBlogs();
  }, []);

  // Filter callback
  useEffect(() => {
    let result = [...blogs];

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter(b => b.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q)
      );
    }

    setFilteredBlogs(result);
  }, [searchQuery, selectedCategory, blogs]);

  const categories: ('All' | 'Frontend' | 'Shopify' | 'Bubble.io' | 'SEO' | 'UI/UX')[] = [
    'All',
    'Frontend',
    'Shopify',
    'Bubble.io',
    'SEO',
    'UI/UX'
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-32 pb-20 relative min-h-screen">
        {/* Glows */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <SectionHeading
            badge="My Writings"
            title="Technical Insights"
            subtitle="Articles on Next.js structures, SEO alignments, custom Liquid modules, and no-code visual database workflows."
          />

          {/* Search/Filter wrapper */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 mb-10 bg-brand-card p-4 rounded-2xl border border-brand-border-white shadow-lg">
            
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2.5 md:pb-0 scrollbar-none">
              <SlidersHorizontal className="w-4 h-4 text-brand-text-muted shrink-0 mr-1 hidden sm:block" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-brand-accent text-white shadow-md'
                      : 'bg-brand-card-dark text-brand-text-muted border border-brand-border-white hover:text-white hover:border-brand-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search query input */}
            <div className="relative w-full md:max-w-xs shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
              />
            </div>

          </div>

          {/* Blog card grids */}
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div key={blog.id}>
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No articles found"
              message="No blog posts match your search or filter. Try looking under alternative categories or query standard terms like layout or performance."
              onAction={() => {
                setSearchInput('');
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              actionText="Reset All Filters"
            />
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
