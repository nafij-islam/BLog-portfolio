'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-28 pb-16 px-6">
        <div className="w-full flex items-center justify-center py-6">
          <AuthForm mode="register" />
        </div>
      </main>
      <Footer />
    </>
  );
}
