'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Heart, MessageSquare, Settings, LogOut, User as UserIcon, Save, Calendar, ShieldAlert, Camera, Globe, Github, Linkedin, Twitter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiService } from '@/lib/api-service';
import { BlogPost, Comment } from '@/data/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';

function UserDashboardContent() {
  const { user, logout, isLoading, refreshUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'liked' | 'comments' | 'settings'>('overview');

  // Dynamic user details
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [profession, setProfession] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // User activity states
  const [likedBlogs, setLikedBlogs] = useState<BlogPost[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);

  // Sync tab with query param if present
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'settings') {
      setActiveTab('settings');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar || '');
      setProfession(user.profession || '');
      setBio(user.bio || '');
      setWebsite(user.website || '');
      setGithub(user.socialLinks?.github || '');
      setLinkedin(user.socialLinks?.linkedin || '');
      setTwitter(user.socialLinks?.twitter || '');
      setAvatarPreview(user.avatar || '');

      const fetchUserActivities = async () => {
        try {
          // Fetch liked blogs
          if (user.likedBlogs && user.likedBlogs.length > 0) {
            const blogsRes = await fetch(`/api/blogs?ids=${user.likedBlogs.join(',')}`);
            const blogsData = await blogsRes.json();
            if (blogsData.success) {
              setLikedBlogs(blogsData.data.blogs);
            }
          } else {
            setLikedBlogs([]);
          }

          // Fetch comments
          const commentsRes = await fetch('/api/admin/comments');
          const commentsData = await commentsRes.json();
          if (commentsData.success) {
            setUserComments(commentsData.data);
          }
        } catch (error) {
          console.error('Failed to load user activity:', error);
        }
      };

      fetchUserActivities();
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Only PNG, JPG, JPEG, and WEBP formats are supported.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit.', 'error');
      return;
    }

    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!name.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }

    setIsSaving(true);

    try {
      let finalAvatarUrl = avatar;

      if (avatarFile) {
        try {
          const uploadResult = await ApiService.uploadImage(avatarFile, 'avatar');
          finalAvatarUrl = uploadResult.url;
          setAvatar(finalAvatarUrl);
          setAvatarFile(null);
        } catch (uploadErr: any) {
          console.error('Avatar upload failed:', uploadErr);
          showToast(uploadErr.message || 'Image upload failed. Settings not saved.', 'error');
          setIsSaving(false);
          return;
        }
      }

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          avatar: finalAvatarUrl,
          bio,
          profession,
          website,
          socialLinks: {
            github,
            linkedin,
            twitter
          }
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser(); // Sync auth context session
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to update profile settings.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update profile settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="flex-grow pt-32 pb-20 flex items-center justify-center bg-brand-bg min-h-screen">
        <LoadingState message="Connecting to secure session..." />
      </div>
    );
  }

  const sidebarTabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'liked' as const, label: 'Liked Articles', icon: Heart },
    { id: 'comments' as const, label: 'Comment History', icon: MessageSquare },
    { id: 'settings' as const, label: 'Account Settings', icon: Settings }
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-32 pb-20 min-h-screen relative bg-brand-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Profile Card */}
              <Card hoverEffect={false} className="p-5 border border-brand-border-white bg-brand-card-dark/45 text-center">
                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-brand-accent">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight leading-none mb-1.5">{user.name}</h3>
                <p className="text-[10px] text-brand-text-muted mb-4">{user.email}</p>
                <span className="px-2.5 py-0.5 bg-brand-accent/10 border border-brand-accent/20 text-[9px] font-bold tracking-widest text-brand-accent rounded-full uppercase">
                  {user.role} Account
                </span>
                {user.role === 'admin' && (
                  <Link href="/admin" className="block mt-4">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 py-1.5!">
                      <ShieldAlert className="w-3.5 h-3.5" /> Admin Panel
                    </Button>
                  </Link>
                )}
              </Card>

              {/* Navigation Tabs List */}
              <Card hoverEffect={false} className="p-2 border border-brand-border-white bg-brand-card-dark/20 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible scrollbar-none gap-1">
                {sidebarTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-brand-accent text-white shadow-md'
                          : 'text-brand-text-muted hover:text-white hover:bg-brand-card-light'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer text-left w-full mt-auto"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Logout
                </button>
              </Card>
            </div>

            {/* Content Display Grid */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Active Header badge */}
              <div className="flex items-center justify-between border-b border-brand-border-white pb-4">
                <h1 className="text-xl font-bold text-white tracking-tight uppercase">
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'liked' && 'Liked Articles'}
                  {activeTab === 'comments' && 'Comments History'}
                  {activeTab === 'settings' && 'Profile Settings'}
                </h1>
                <span className="text-[10px] text-brand-text-muted font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Session Active
                </span>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Summary Metric widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card hoverEffect className="p-5 flex items-center gap-4 border border-brand-border-white">
                      <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-xl">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-brand-text-muted font-bold leading-none mb-1.5">LIKED ARTICLES</p>
                        <p className="text-xl font-extrabold text-white tracking-tight">{likedBlogs.length}</p>
                      </div>
                    </Card>

                    <Card hoverEffect className="p-5 flex items-center gap-4 border border-brand-border-white">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-brand-text-muted font-bold leading-none mb-1.5">POSTED COMMENTS</p>
                        <p className="text-xl font-extrabold text-white tracking-tight">{userComments.length}</p>
                      </div>
                    </Card>
                  </div>

                  {/* Profile info block */}
                  <Card hoverEffect={false} className="p-6 border border-brand-border-white bg-brand-card-dark/25">
                    <h3 className="text-sm font-bold text-white mb-4 tracking-tight border-l-2 border-brand-accent pl-2.5">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[9px] text-brand-text-muted uppercase mb-1">Full Name</p>
                        <p className="text-white font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-brand-text-muted uppercase mb-1">Email Address</p>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-brand-text-muted uppercase mb-1">User Role</p>
                        <p className="text-white font-medium capitalize">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-brand-text-muted uppercase mb-1">Registered On</p>
                        <p className="text-white font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Tab 2: Liked Blogs */}
              {activeTab === 'liked' && (
                <div>
                  {likedBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {likedBlogs.map((blog) => (
                        <Card hoverEffect key={blog.id} className="p-4 border border-brand-border-white flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-brand-accent uppercase tracking-wider">{blog.category}</span>
                            <h4 className="text-sm font-bold text-white mt-1 mb-2 line-clamp-1 hover:text-brand-accent transition-colors">
                              <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
                            </h4>
                            <p className="text-xs text-brand-text-muted leading-relaxed line-clamp-2 mb-4">{blog.excerpt}</p>
                          </div>
                          <Link href={`/blog/${blog.id}`} className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1">
                            Read Article
                          </Link>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No Liked Articles"
                      message="You haven't liked any technical articles yet. Explore the blog section and show your appreciation!"
                      actionText="Browse Blogs"
                      onAction={() => router.push('/blog')}
                    />
                  )}
                </div>
              )}

              {/* Tab 3: Comments */}
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {userComments.length > 0 ? (
                    userComments.map((comment) => (
                      <Card hoverEffect={false} key={comment.id} className="p-4 border border-brand-border-white">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <span className="text-[9px] font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded">
                            Article: {comment.blogTitle || comment.blogId}
                          </span>
                          <span className="text-[9px] text-brand-text-muted font-medium">
                            Posted: {new Date(comment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-white/95 leading-relaxed italic mb-3">"{comment.content}"</p>
                        <Link href={`/blog/${comment.blogId}`} className="text-[10px] text-brand-text-muted hover:text-brand-accent hover:underline font-semibold block w-fit">
                          View article comments thread
                        </Link>
                      </Card>
                    ))
                  ) : (
                    <EmptyState
                      title="No Comments History"
                      message="You haven't posted any comments yet. Share your feedback or ask questions on our technical blogs!"
                      actionText="Browse Blogs"
                      onAction={() => router.push('/blog')}
                    />
                  )}
                </div>
              )}

              {/* Tab 4: Settings */}
              {activeTab === 'settings' && (
                <Card hoverEffect={false} className="p-6 border border-brand-border-white bg-brand-card-dark/25">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column: Avatar & Core Profile Info */}
                      <div className="space-y-4">
                        {/* Avatar Image Selection with Preview */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-card-dark/40 border border-brand-border-white/5">
                          <div className="relative group w-16 h-16 rounded-full overflow-hidden border border-brand-accent bg-brand-card">
                            {avatarPreview ? (
                              <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-brand-text-muted">
                                <UserIcon className="w-6 h-6" />
                              </div>
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] font-semibold text-white cursor-pointer transition-opacity">
                              <Camera className="w-4 h-4" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">Profile Photo</p>
                            <p className="text-[9px] text-brand-text-muted mt-0.5">Click photo to upload new image (PNG, JPG, WebP, max 5MB)</p>
                          </div>
                        </div>

                        {/* Name input */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white/90">Full Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                            required
                          />
                        </div>

                        {/* Profession input */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white/90">Profession / Title</label>
                          <input
                            type="text"
                            placeholder="Frontend Developer"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                          />
                        </div>

                        {/* Bio input */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white/90">Bio / About Me</label>
                          <textarea
                            placeholder="Write a brief introduction about yourself..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all resize-none animate-none"
                          />
                        </div>
                      </div>

                      {/* Right Column: Web & Social Links */}
                      <div className="space-y-4">
                        {/* Direct URL option for Avatar */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white/90">Avatar Image URL (Alternative)</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={avatar}
                            onChange={(e) => {
                              setAvatar(e.target.value);
                              setAvatarPreview(e.target.value);
                            }}
                            className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                          />
                        </div>

                        {/* Website input */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-brand-text-muted" /> Website URL</label>
                          <input
                            type="url"
                            placeholder="https://yourwebsite.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                          />
                        </div>

                        {/* GitHub URL input */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-brand-text-muted" /> GitHub Profile</label>
                          <input
                            type="url"
                            placeholder="https://github.com/username"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                          />
                        </div>

                        {/* LinkedIn URL input */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 text-brand-text-muted" /> LinkedIn Profile</label>
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                          />
                        </div>

                        {/* Twitter/X URL input */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5"><Twitter className="w-3.5 h-3.5 text-brand-text-muted" /> Twitter/X Profile</label>
                          <input
                            type="url"
                            placeholder="https://twitter.com/username"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-brand-border-white/5 flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        className="font-bold py-2.5 text-xs px-6"
                        isLoading={isSaving}
                        leftIcon={<Save className="w-4 h-4" />}
                      >
                        Save Settings
                      </Button>
                    </div>

                  </form>
                </Card>
              )}

            </div>

          </div>
          
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="flex-grow pt-32 pb-20 flex items-center justify-center bg-brand-bg min-h-screen">
        <LoadingState message="Loading dashboard..." />
      </div>
    }>
      <UserDashboardContent />
    </Suspense>
  );
}
