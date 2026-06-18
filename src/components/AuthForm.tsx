'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiService } from '@/lib/api-service';
import Button from './Button';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const isLogin = mode === 'login';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!email || !password) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!isLogin && !name) {
      showToast('Please provide your name.', 'error');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          showToast('Successfully logged in!', 'success');
          const stored = localStorage.getItem('portfolio_logged_in_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/dashboard');
            }
          } else {
            router.push('/');
          }
        } else {
          showToast('Invalid email or password.', 'error');
        }
      } else {
        let uploadedAvatarUrl = undefined;
        if (avatarFile) {
          try {
            const uploadResult = await ApiService.uploadImage(avatarFile, 'avatar');
            uploadedAvatarUrl = uploadResult.url;
          } catch (uploadErr: any) {
            console.error('Avatar upload failed:', uploadErr);
            showToast(uploadErr.message || 'Avatar upload failed. Registering without photo.', 'warning');
          }
        }

        const success = await register(name, email, password, uploadedAvatarUrl);
        if (success) {
          showToast('Registration successful! Welcome.', 'success');
          router.push('/dashboard');
        } else {
          showToast('Email address already registered.', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred during authentication.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl text-brand-accent mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-xs text-brand-text-muted mt-1.5 leading-relaxed">
          {isLogin
            ? 'Sign in to access your customized dashboard and comments'
            : 'Register to comment, save blog articles, and track updates'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        {/* Name input (Register only) */}
        {!isLogin && (
          <>
            <div className="flex flex-col items-center justify-center space-y-2 pb-3 border-b border-brand-border/40">
              <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-brand-accent/30 hover:border-brand-accent transition-colors bg-brand-card-dark flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-brand-text-muted" />
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-semibold text-white cursor-pointer transition-opacity">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <span className="text-[10px] text-brand-text-muted">Optional Profile Picture (Max 5MB)</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-text-muted" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-brand-card-dark border border-brand-border-white rounded-xl text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                />
              </div>
            </div>
          </>
        )}

        {/* Email input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/90">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-text-muted" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-brand-card-dark border border-brand-border-white rounded-xl text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
              required
            />
          </div>
        </div>

        {/* Password input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white/90">Password</label>
            {isLogin && (
              <span className="text-[10px] text-brand-accent hover:underline cursor-pointer">
                Forgot password?
              </span>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-2.5 text-sm bg-brand-card-dark border border-brand-border-white rounded-xl text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password (Register only) */}
        {!isLogin && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-brand-card-dark border border-brand-border-white rounded-xl text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                required
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4 font-bold py-3"
          isLoading={isLoading}
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      {/* Alternative redirection link */}
      <div className="text-center mt-6 text-xs text-brand-text-muted relative">
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <Link href="/register" className="text-brand-accent hover:underline font-semibold">
              Create one here
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-brand-accent hover:underline font-semibold">
              Sign in here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
