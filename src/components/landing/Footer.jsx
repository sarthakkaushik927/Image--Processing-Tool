import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-10 py-8 text-center text-gray-500 text-sm border-t border-white/5 bg-black">
      <p>© {new Date().getFullYear()} FotoFix AI. All rights reserved.</p>
    </footer>
  );
}