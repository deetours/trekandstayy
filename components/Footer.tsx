'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-foreground/5 border-t border-border">
      {/* Accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-4 gap-8 mb-12"
        >
          {/* Brand section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-2 text-accent tracking-wide" style={{ fontFamily: 'var(--font-bebas, serif)' }}>
              ADVENTURE
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Experience the raw wilderness. No hotels. No comfort. Just the journey.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Explore</h4>
            <ul className="space-y-2">
              {['Destinations', 'Experiences', 'Stories', 'Gallery'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Team', 'Careers', 'Press'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <ul className="space-y-2">
              {['Instagram', 'Twitter', 'YouTube', 'Discord'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Bottom footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60"
        >
          <p>© {currentYear} Adventure Awaits. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
