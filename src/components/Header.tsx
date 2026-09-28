import Link from 'next/link';
import { getSlug } from '@/lib/blogger';

const CATEGORIES = [
  'Windows', 'AI', 'Android & iOS', 'Security', 'Tools'
];

export default function Header() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 pt-4 px-4 sm:px-6 pointer-events-none">
      <header className="pointer-events-auto max-w-5xl mx-auto bg-white/70 dark:bg-[#0a0a0f]/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm rounded-2xl">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhEDkATO0X6b4qdiHLeZagvH9kRabG_P8-ry2vbA7C4CFqBHH_YAEr3A5duyoKcJR1kC1O44ENsKQ6c76GFtwGO25VXvvu5eEcpnklHNGBZlrjfDIV_pLb0ZIhsE5OPhanOcKDZoX9b0cdqX-QULdI3y6zcg0mJOjuADPDARDIQ7bycAA/s1600/byteswift%20digital%202025%20main%20logo.png" 
                alt="Byteswift Digital" 
                className="h-8 w-auto drop-shadow-sm"
              />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            {CATEGORIES.map(cat => (
              <Link 
                key={cat} 
                href={`/category/${getSlug(cat)}`} 
                className="text-gray-600 dark:text-gray-300 hover:text-[#482dff] dark:hover:text-[#6a55ff] hover:bg-gray-100/50 dark:hover:bg-white/5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                {cat}
              </Link>
            ))}
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
            <Link 
              href="/search" 
              className="text-gray-600 dark:text-gray-300 hover:text-[#482dff] dark:hover:text-[#6a55ff] hover:bg-gray-100/50 dark:hover:bg-white/5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}
