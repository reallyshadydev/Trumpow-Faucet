import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#212121] border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/navbar-logo.png"
            alt="Faucet Logo"
            width={200} // desired width
            height={80} // desired height
            objectFit="contain"
          />
        </div>
        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/" className="hover:text-[#e979be] text-lg font-ubuntu">
            Home
          </Link>
          <Link href="/donate" className="hover:text-[#e979be] text-lg font-ubuntu">
            Donate
          </Link>
          <Link
            href="https://flopcoin.net"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#df3da1] text-white px-4 py-2 rounded text-lg font-ubuntu hover:bg-[#ce228c] hover:text-white"
          >
            Flopcoin.net
          </Link>
        </nav>
        {/* Hamburger icon for mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#212121] border-t border-gray-700">
          <nav className="flex flex-col items-center px-4 py-2 space-y-4">
            <Link legacyBehavior href="/">
              <a
                onClick={() => setIsOpen(false)}
                className="w-full text-center hover:text-[#e979be] text-lg font-ubuntu border-b border-gray-700 pb-2"
              >
                Home
              </a>
            </Link>
            <Link legacyBehavior href="/donate">
              <a
                onClick={() => setIsOpen(false)}
                className="w-full text-center hover:text-[#e979be] text-lg font-ubuntu border-b border-gray-700 pb-2"
              >
                Donate
              </a>
            </Link>
            <Link legacyBehavior href="https://flopcoin.net">
              <a
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-[#df3da1] text-white px-4 py-2 rounded text-lg font-ubuntu hover:bg-[#ce228c]"
              >
                Flopcoin.net
              </a>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
