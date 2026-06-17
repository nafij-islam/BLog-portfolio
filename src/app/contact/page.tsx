'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Send, Github, Linkedin, Twitter } from 'lucide-react';
import { mockDb } from '@/data/mockDb';
import { useToast } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Card from '@/components/Card';
import SectionHeading from '@/components/SectionHeading';

export default function ContactPage() {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    { id: 1, label: 'Email', value: 'contact@nafij.dev', icon: Mail, color: 'text-brand-accent' },
    { id: 2, label: 'Phone', value: '+880 1700 000000', icon: Phone, color: 'text-blue-400' },
    { id: 3, label: 'Location', value: 'Dhaka, Bangladesh', icon: MapPin, color: 'text-green-400' },
    { id: 4, label: 'Availability', value: 'Open for Freelance & Contracts', icon: Calendar, color: 'text-amber-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all the fields.', 'error');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Your message has been sent successfully!', 'success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        showToast(json.message || 'Failed to submit message.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to submit message.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <SectionHeading
            badge="Get In Touch"
            title="Let's Build Something Amazing"
            subtitle="Fill out the contact form or reach out through social channels. I usually respond within 12 hours."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Contact details */}
            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {contactInfo.map((info, idx) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card hoverEffect className="p-5 flex items-center gap-4 border border-brand-border-white">
                        <div className={`p-3 bg-brand-card-light rounded-xl ${info.color} border border-brand-border-white`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-brand-text-muted leading-none font-medium mb-1.5">{info.label}</p>
                          <p className="text-xs font-bold text-white tracking-tight">{info.value}</p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Social boxes */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card hoverEffect className="p-5 flex flex-col gap-4 border border-brand-border-white">
                  <h4 className="text-xs font-bold text-white tracking-tight">Connect with me</h4>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-brand-card-light border border-brand-border-white hover:border-brand-accent text-brand-text-muted hover:text-brand-accent rounded-xl transition-all flex items-center gap-2 text-xs font-semibold"
                    >
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-brand-card-light border border-brand-border-white hover:border-brand-accent text-brand-text-muted hover:text-brand-accent rounded-xl transition-all flex items-center gap-2 text-xs font-semibold"
                    >
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-brand-card-light border border-brand-border-white hover:border-brand-accent text-brand-text-muted hover:text-brand-accent rounded-xl transition-all flex items-center gap-2 text-xs font-semibold"
                    >
                      <Twitter className="w-4 h-4" /> Twitter
                    </a>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-7"
            >
              <Card hoverEffect={false} className="p-6 md:p-8 border border-brand-border">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/90">Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                        required
                      />
                    </div>
                    {/* Email input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/90">Email Address</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/90">Subject</label>
                    <input
                      type="text"
                      placeholder="Project Inquiry / Job Opportunity"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                      required
                    />
                  </div>

                  {/* Message input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/90">Your Message</label>
                    <textarea
                      placeholder="Describe your project goals or detail your query here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full font-bold py-3 text-xs tracking-wide uppercase"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
