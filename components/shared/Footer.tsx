import React from 'react';
import { Bot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <footer className={`bg-black text-white border-t border-white/10 ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-lg p-2">
              <Bot className="h-5 w-5 text-black" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold tracking-tight">Mockrithm</h3>
              <p className="text-xs text-gray-400 mt-0.5">Face the Machine</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-8">
            {navigationLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                </a>
                {index < navigationLinks.length - 1 && (
                  <Separator orientation="vertical" className="h-4 bg-white/20" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <Separator className="my-6 bg-white/10" />

        {/* Copyright Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {currentYear} AI Interview. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-xs text-gray-400 font-medium">
              Powered by AI Technology
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
