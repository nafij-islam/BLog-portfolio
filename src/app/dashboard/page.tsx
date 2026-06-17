'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Heart, MessageSquare, Settings, LogOut, User as UserIcon, Save, Calendar, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!name.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar }),
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
                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    
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

                    {/* Avatar URL input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/90">Avatar URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-brand-card-dark border border-brand-border-white rounded-xl text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                      />
                      <p className="text-[9px] text-brand-text-muted leading-none">Provide an image URL (e.g. Unsplash link) to change your visual profile picture.</p>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        className="font-bold py-2.5 text-xs"
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
