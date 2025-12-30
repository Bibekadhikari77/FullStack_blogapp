import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>
        
        {/* Shooting Stars */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
              style={{
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 8}s`,
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)'
              }}
            />
          ))}
        </div>
        
        {/* Moon */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full shadow-2xl shadow-yellow-300/50 animate-float">
          <div className="absolute top-3 right-3 w-7 h-7 bg-slate-900 rounded-full opacity-15"></div>
          <div className="absolute top-10 right-8 w-5 h-5 bg-slate-900 rounded-full opacity-15"></div>
          <div className="absolute top-5 right-12 w-3 h-3 bg-slate-900 rounded-full opacity-20"></div>
          {/* Moon glow */}
          <div className="absolute inset-0 rounded-full bg-yellow-200 blur-xl opacity-50 animate-pulse-glow"></div>
        </div>
        
        {/* Animated Blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute bg-purple-300 rounded-full opacity-30 animate-float-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
