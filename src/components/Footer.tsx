import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-bold text-xl text-[#482dff]">Byteswift Digital</span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Tech analysis, Windows performance optimization, AI tools, and cybersecurity insights by A. Bayern.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about-us" className="text-sm text-gray-500 hover:text-[#482dff]">About Us</Link></li>
              <li><Link href="/contact-us" className="text-sm text-gray-500 hover:text-[#482dff]">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-[#482dff]">Privacy Policy</Link></li>
              <li><Link href="/sitemap.xml" className="text-sm text-gray-500 hover:text-[#482dff]">Sitemap</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <a href="https://facebook.com/byteswiftdigital" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#482dff]">Facebook</a>
              <a href="https://x.com/byteswifts" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#482dff]">X</a>
              <a href="https://instagram.com/byteswiftdigital_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#482dff]">Instagram</a>
            </div>
            <div className="mt-6">
              <a href="https://www.buymeacoffee.com/byteswifts" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#482dff] hover:bg-blue-700">
                Buy Me a Coffee
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex items-center justify-between">
          <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} Byteswift Digital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
