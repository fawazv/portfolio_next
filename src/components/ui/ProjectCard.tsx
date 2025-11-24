'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import React, { useRef } from 'react';

interface ProjectProps {
  project: {
    name: string;
    description: string;
    tech: string[];
    github: string;
    live: string;
    highlight?: string;
  };
}

export default function ProjectCard({ project }: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      className="relative h-full w-full rounded-xl bg-zinc-900/40 p-6 border border-white/10 backdrop-blur-sm transition-colors hover:bg-zinc-900/60 group"
    >
      <div style={{ transform: 'translateZ(75px)' }} className="absolute inset-4 grid place-content-center rounded-xl bg-white/5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        {/* Optional: Add an image or overlay here */}
      </div>
      
      <div style={{ transform: 'translateZ(50px)' }} className="relative flex flex-col h-full">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {project.name}
        </h3>
        
        <p className="text-zinc-400 mb-4 flex-grow text-sm leading-relaxed">
          {project.description}
        </p>

        {project.highlight && (
          <div className="mb-4 p-2 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
            <span className="font-semibold">Highlight:</span> {project.highlight}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech) => (
            <span key={tech} className="px-2 py-1 text-xs rounded-full bg-white/5 text-zinc-300 border border-white/5">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-auto">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <Github size={16} />
            Code
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink size={16} />
            Live Demo
          </a>
        </div>
      </div>
    </motion.div>
  );
}
