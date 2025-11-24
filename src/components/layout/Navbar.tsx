'use client';

import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, User, Cpu, FolderGit2, Mail } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Skills', href: '#skills', icon: Cpu },
  { name: 'Projects', href: '#projects', icon: FolderGit2 },
  { name: 'Contact', href: '#contact', icon: Mail },
];

function DockItem({ mouseX, item, isActive }: { mouseX: MotionValue; item: typeof navItems[0]; isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Link href={item.href}>
      <motion.div
        ref={ref}
        style={{ width }}
        className="aspect-square rounded-full bg-zinc-900/50 border border-white/10 backdrop-blur-md flex items-center justify-center relative group"
      >
        <item.icon className={`w-1/2 h-1/2 transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`} />
        {isActive && (
          <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full" />
        )}
        
        {/* Tooltip */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900/90 border border-white/10 rounded-md text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {item.name}
        </div>
      </motion.div>
    </Link>
  );
}

export default function Navbar() {
  const mouseX = useMotionValue(Infinity);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    navItems.forEach((item) => {
      const sectionId = item.href.substring(1);
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-4 px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 pointer-events-auto"
      >
        {navItems.map((item) => (
          <DockItem 
            key={item.name} 
            mouseX={mouseX} 
            item={item} 
            isActive={activeSection === item.href.substring(1)}
          />
        ))}
      </motion.div>
    </div>
  );
}
